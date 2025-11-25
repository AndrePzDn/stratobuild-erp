from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
from ..db import get_db_client, get_data_from_clickhouse
from ..utils.plot import fig_to_json_safe

router = APIRouter()

@router.get("/api/dashboard/cash-flow")
def get_cash_flow(
    project_id: Optional[str] = None,
    granularity: str = "month",
    client = Depends(get_db_client)
):
    filter_sql = "AND FP.project_id = %(pid)s" if project_id else ""
    params = {'pid': project_id} if project_id else {}
    
    time_func = {
        "month": "toStartOfMonth",
        "quarter": "toStartOfQuarter",
        "year": "toYear"
    }.get(granularity, "toStartOfMonth")
    
    sql = f"""
    SELECT 
        {time_func}(FP.date) as periodo,
        FP.payment_type as payment_type,
        sum(FP.amount) as total
    FROM fact_payment FP
    WHERE 1=1 {filter_sql}
    GROUP BY periodo, payment_type
    ORDER BY periodo
    """
    
    df = get_data_from_clickhouse(client, sql, params)
    
    if df.empty:
        return fig_to_json_safe(px.area(title="Sin datos financieros"))
    
    fig = px.area(
        df,
        x='periodo', y='total', color='payment_type',
        title=f"Flujo de Caja (Granularidad: {granularity})",
        color_discrete_map={'income': '#10b981', 'expense': '#ef4444'},
        labels={'periodo': 'Período', 'total': 'Monto', 'payment_type': 'Tipo'}
    )
    fig.update_layout(hovermode='x unified')
    return fig_to_json_safe(fig)


@router.get("/api/dashboard/budget-deviation")
def get_budget_deviation(client = Depends(get_db_client)):
    sql = """
    SELECT 
        P.project_id as project_id,
        P.project_name as project_name,
        P.status as status,
        coalesce(CF.estimated_total, 0) as presupuesto,
        coalesce(PAY.gasto_real, 0) as gasto_real,
        round((coalesce(PAY.gasto_real, 0) / nullif(CF.estimated_total, 0) * 100), 2) as porcentaje_ejecutado
    FROM dim_project P
    LEFT JOIN (
        SELECT project_id, max(estimated_total) as estimated_total
        FROM fact_cash_flow
        GROUP BY project_id
    ) CF ON P.project_id = CF.project_id
    LEFT JOIN (
        SELECT project_id, sum(amount) as gasto_real
        FROM fact_payment
        WHERE payment_type = 'expense'
        GROUP BY project_id
    ) PAY ON P.project_id = PAY.project_id
    WHERE P.status = 'active' AND CF.estimated_total > 0
    ORDER BY porcentaje_ejecutado DESC
    """
    
    df = get_data_from_clickhouse(client, sql)
    
    if df.empty:
        return fig_to_json_safe(px.bar(title="No hay proyectos con presupuesto"))
    
    df['porcentaje_ejecutado'] = df['porcentaje_ejecutado'].fillna(0)
    df['color'] = df['porcentaje_ejecutado'].apply(
        lambda x: '#10b981' if x < 80 else '#f59e0b' if x < 100 else '#ef4444'
    )
    
    fig = go.Figure()
    customdata_array = df[['project_id', 'porcentaje_ejecutado']].values
    fig.add_trace(go.Bar(
        name='Presupuesto',
        x=df['project_name'],
        y=df['presupuesto'],
        marker_color='#cbd5e1',
        customdata=customdata_array,
        hovertemplate='<b>%{x}</b><br>Presupuesto: $%{y:,.0f}<br>Ejecutado: %{customdata[1]:.1f}%<extra></extra>'
    ))
    fig.add_trace(go.Bar(
        name='Gasto Real',
        x=df['project_name'],
        y=df['gasto_real'],
        marker_color=df['color'],
        customdata=customdata_array,
        hovertemplate='<b>%{x}</b><br>Gasto: $%{y:,.0f}<br>Ejecutado: %{customdata[1]:.1f}%<extra></extra>'
    ))
    fig.update_layout(
        title='Desviación Presupuestaria por Proyecto (Click para Drill-Down)',
        barmode='group',
        hovermode='x unified',
        xaxis_tickangle=-45,
        xaxis_title='Proyecto',
        yaxis_title='Monto ($)'
    )
    
    return fig_to_json_safe(fig)


@router.get("/api/dashboard/project-status-overview")
def get_project_status_overview(client = Depends(get_db_client)):
    sql = """
    SELECT 
        P.status as status,
        P.project_type_name as project_type_name,
        count() as cantidad,
        sum(coalesce(CF.estimated_total, 0)) as valor_total
    FROM dim_project P
    LEFT JOIN (
        SELECT project_id, max(estimated_total) as estimated_total
        FROM fact_cash_flow
        GROUP BY project_id
    ) CF ON P.project_id = CF.project_id
    GROUP BY status, project_type_name
    """
    df = get_data_from_clickhouse(client, sql)
    if df.empty:
        return fig_to_json_safe(px.sunburst())
    fig = px.sunburst(
        df,
        path=['status', 'project_type_name'],
        values='valor_total',
        color='cantidad',
        title='Portafolio de Proyectos (Estado → Tipo)',
        color_continuous_scale='Blues'
    )
    return fig_to_json_safe(fig)


@router.get("/api/dashboard/resource-efficiency")
def get_resource_efficiency(client = Depends(get_db_client)):
    sql = """
    SELECT 
        R.resource_type as resource_type,
        R.unit_of_measurement as unit_of_measurement,
        sum(I.quantity) as stock_total,
        coalesce(sum(IA.quantity), 0) as cantidad_asignada,
        round((coalesce(sum(IA.quantity), 0) / nullif(sum(I.quantity), 0) * 100), 2) as porcentaje_uso
    FROM fact_inventory I
    JOIN dim_resource R ON I.resource_id = R.resource_id
    LEFT JOIN fact_inventory_assignment IA ON I.inventory_id = IA.inventory_id
    GROUP BY resource_type, unit_of_measurement
    HAVING stock_total > 0
    """
    df = get_data_from_clickhouse(client, sql)
    if df.empty:
        return fig_to_json_safe(px.bar(title="Sin datos de inventario"))
    fig = go.Figure()
    fig.add_trace(go.Bar(
        name='Stock Disponible',
        x=df['resource_type'],
        y=df['stock_total'],
        marker_color='#3b82f6'
    ))
    fig.add_trace(go.Bar(
        name='Asignado',
        x=df['resource_type'],
        y=df['cantidad_asignada'],
        marker_color='#10b981'
    ))
    fig.update_layout(
        title='Eficiencia de Recursos (Stock vs Asignado)',
        barmode='group',
        hovermode='x unified',
        xaxis_title='Tipo de Recurso',
        yaxis_title='Cantidad'
    )
    return fig_to_json_safe(fig)
