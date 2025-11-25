from fastapi import APIRouter, Depends, HTTPException
import plotly.express as px
import pandas as pd
from datetime import date
from ..db import get_db_client, get_data_from_clickhouse
from ..utils.plot import fig_to_json_safe, get_visuals_defaults
import plotly.graph_objects as go

router = APIRouter()


@router.get("/api/dashboard/project-detail/{project_id}")
def get_project_detail(project_id: str, client = Depends(get_db_client)):
    sql = """
    SELECT 
        P.project_id,
        P.project_name,
        P.status,
        P.location,
        C.name as cliente,
        P.start_date,
        P.end_date,
        coalesce(CF.estimated_total, 0) as presupuesto,
        coalesce(PAY.total_gastos, 0) as gastos,
        coalesce(PAY.total_ingresos, 0) as ingresos,
        coalesce(avg(T.progress), 0) as avance_promedio
    FROM dim_project P
    LEFT JOIN dim_client C ON P.client_id = C.client_id
    LEFT JOIN fact_cash_flow CF ON P.project_id = CF.project_id
    LEFT JOIN (
        SELECT 
            project_id,
            sumIf(amount, payment_type = 'expense') as total_gastos,
            sumIf(amount, payment_type = 'income') as total_ingresos
        FROM fact_payment
        GROUP BY project_id
    ) PAY ON P.project_id = PAY.project_id
    LEFT JOIN fact_project_task T ON P.project_id = T.project_id
    WHERE P.project_id = %(pid)s
    GROUP BY P.project_id, P.project_name, P.status, P.location, C.name, 
             P.start_date, P.end_date, CF.estimated_total, PAY.total_gastos, PAY.total_ingresos
    """
    
    df = get_data_from_clickhouse(client, sql, {'pid': project_id})
    
    if df.empty:
        raise HTTPException(status_code=404, detail=f"Proyecto {project_id} no encontrado")
    
    result = df.to_dict('records')[0]
    if result.get('start_date'):
        result['start_date'] = str(result['start_date'])
    if result.get('end_date'):
        result['end_date'] = str(result['end_date'])
    
    return result


@router.get("/api/dashboard/gantt/{project_id}")
def get_project_gantt(project_id: str, client = Depends(get_db_client)):
    sql = """
    SELECT 
        D.name as tarea,
        D.category as categoria,
        T.estimated_start_date as inicio,
        T.estimated_end_date as fin,
        T.progress as progreso,
        T.actual_end_date as actual_end_date,
        T.status as estado
    FROM fact_project_task T
    JOIN dim_task D ON T.task_id = D.task_id
    WHERE T.project_id = %(pid)s
    ORDER BY T.estimated_start_date, categoria
    """
    
    df = get_data_from_clickhouse(client, sql, {'pid': project_id})
    if df.empty:
        return fig_to_json_safe(px.timeline(title="Sin tareas planificadas"))
    visuals = get_visuals_defaults()

    if 'progreso' in df.columns:
        df['progreso'] = df['progreso'].fillna(0)
    else:
        df['progreso'] = 0

    def get_color_and_label(row):
        estado = str(row.get('estado', '')).lower()
        progreso = float(row.get('progreso', 0))
        
        if 'not' in estado or estado in ['pending', 'planificada']:
            return 'No iniciado'
        elif 'in progress' in estado or 'progress' in estado or estado in ['in_progress', 'en_progreso']:
            if progreso >= 70:
                return '70-100%'
            elif progreso >= 40:
                return '40-70%'
            elif progreso >= 10:
                return '10-40%'
            else:
                return '0-10%'
        else:
            return 'Completado'
    
    df['color_label'] = df.apply(get_color_and_label, axis=1)
    
    color_map = {
        'No iniciado': '#9ca3af',
        '0-10%': '#EF4444',
        '10-40%': '#F97316',
        '40-70%': '#EAB308',
        '70-100%': '#BFE33F',
        'Completado': '#10B981'
    }

    fig = px.timeline(
        df,
        x_start="inicio",
        x_end="fin",
        y="tarea",
        color="color_label",
        color_discrete_map=color_map,
        hover_data=['categoria', 'estado', 'progreso']
    )
    fig.update_yaxes(autorange="reversed")
    fig.update_layout(xaxis_title="Fecha", yaxis_title="Tarea")

    if 'fin' in df.columns:
        df['fin'] = pd.to_datetime(df['fin']).dt.normalize()
        if 'actual_end_date' in df.columns:
            df['actual_end_date'] = pd.to_datetime(df['actual_end_date'])

        today = pd.to_datetime(date.today())

        def _compute_delay(row):
            est = row['fin']
            act = row.get('actual_end_date') if 'actual_end_date' in row else None
            try:
                if pd.notnull(act):
                    delta = (pd.to_datetime(act).normalize() - est).days
                else:
                    delta = (today - est).days
                return int(delta) if delta > 0 else 0
            except Exception:
                return 0

        df['delay_days'] = df.apply(_compute_delay, axis=1)

        df_delay = df[df['delay_days'] > 0].copy()
        if not df_delay.empty:
            df_delay['inicio_delay'] = df_delay['fin']
            df_delay['fin_delay'] = df_delay['fin'] + pd.to_timedelta(df_delay['delay_days'], unit='D')

            df_delay_plot = df_delay[[ 'tarea', 'inicio_delay', 'fin_delay', 'delay_days']].copy()
            df_delay_plot['delay_label'] = 'Retraso'

            fig_delay = px.timeline(
                df_delay_plot,
                x_start='inicio_delay',
                x_end='fin_delay',
                y='tarea',
                color='delay_label',
                color_discrete_map={'delay': 'rgba(239,68,68,0.6)'},
                hover_data=['delay_days']
            )

            for tr in fig_delay.data:
                fig.add_trace(tr)

            for _, row in df_delay.iterrows():
                x_pos = pd.to_datetime(row['fin']) + pd.Timedelta(days=0.5)
                try:
                    mid_x = pd.to_datetime(row['fin']) + pd.to_timedelta(row['delay_days'] / 2, unit='D')
                except Exception:
                    mid_x = pd.to_datetime(row['fin']) + pd.Timedelta(days=0.5)
                fig.add_annotation(
                    x=mid_x,
                    y=row['tarea'],
                    text=f"{int(row['delay_days'])}d",
                    showarrow=False,
                    font=dict(color='white', size=10),
                    xanchor='center',
                    yanchor='middle'
                )
    return fig_to_json_safe(fig)


@router.get("/api/dashboard/cost-breakdown/{project_id}")
def get_cost_breakdown(project_id: str, client = Depends(get_db_client)):
    sql = """
    SELECT 
        R.resource_type as categoria,
        sum(IA.quantity) as cantidad,
        R.unit_of_measurement as unidad
    FROM fact_inventory_assignment IA
    JOIN dim_task T ON IA.task_id = T.task_id
    JOIN dim_resource R ON IA.resource_id = R.resource_id
    WHERE T.project_id = %(pid)s
    GROUP BY R.resource_type, R.unit_of_measurement
    """
    df = get_data_from_clickhouse(client, sql, {'pid': project_id})
    if df.empty:
        return fig_to_json_safe(px.pie(title="Sin asignación de recursos"))
    fig = px.pie(df, names='categoria', values='cantidad', title='Distribución de Recursos Asignados', hole=0.4)
    return fig_to_json_safe(fig)


@router.get("/api/dashboard/payment-timeline/{project_id}")
def get_payment_timeline(project_id: str, client = Depends(get_db_client)):
    sql = """
    SELECT 
        date as date,
        payment_type as tipo,
        amount as monto,
        sum(amount) OVER (PARTITION BY payment_type ORDER BY date) as acumulado
    FROM fact_payment
    WHERE project_id = %(pid)s
    ORDER BY date
    """
    df = get_data_from_clickhouse(client, sql, {'pid': project_id})
    if df.empty:
        return fig_to_json_safe(px.line(title="Sin movimientos financieros"))
    visuals = get_visuals_defaults()
    disco = visuals.get('color_discrete_map', {'income': '#10b981', 'expense': '#ef4444'})
    fig = px.line(df, x='date', y='acumulado', color='tipo', title='Evolución Acumulada de Ingresos y Gastos', color_discrete_map=disco, markers=True)
    fig.update_layout(xaxis_title="Fecha", yaxis_title="Monto Acumulado ($)", hovermode='x unified')
    return fig_to_json_safe(fig)


@router.get("/api/dashboard/project-search")
def project_search(name: str, client = Depends(get_db_client)):
    sql = """
    SELECT
        project_id,
        project_name
    FROM dim_project
    WHERE project_name ILIKE %(name)s
    ORDER BY project_name
    LIMIT 50
    """
    df = get_data_from_clickhouse(client, sql, {"name": f"%{name}%"})
    if df.empty:
        return []
    return df.to_dict("records")
