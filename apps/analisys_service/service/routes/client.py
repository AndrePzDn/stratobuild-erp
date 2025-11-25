from fastapi import APIRouter, Depends
import plotly.express as px
from ..db import get_db_client, get_data_from_clickhouse
from ..utils.plot import fig_to_json_safe

router = APIRouter()


@router.get("/api/dashboard/client-portfolio/{client_id}")
def get_client_portfolio(client_id: str, client = Depends(get_db_client)):
    sql = """
    SELECT 
        P.project_name as project_name,
        P.status as status,
        coalesce(CF.estimated_total, 0) as valor_proyecto,
        coalesce(avg(T.progress), 0) as avance,
        count(DISTINCT T.task_id) as total_tareas
    FROM dim_project P
    LEFT JOIN fact_cash_flow CF ON P.project_id = CF.project_id
    LEFT JOIN fact_project_task T ON P.project_id = T.project_id
    WHERE P.client_id = %(cid)s
    GROUP BY project_name, status, CF.estimated_total
    """
    df = get_data_from_clickhouse(client, sql, {'cid': client_id})
    if df.empty:
        return fig_to_json_safe(px.bar(title="Sin proyectos registrados"))
    fig = px.bar5(
        df,
        x='project_name',
        y='valor_proyecto',
        color='avance',
        title='Portafolio del Cliente',
        color_continuous_scale='Viridis',
        hover_data=['status', 'total_tareas']
    )
    fig.update_layout(xaxis_title="Proyecto", yaxis_title="Valor ($)", xaxis_tickangle=-45)
    return fig_to_json_safe(fig)


@router.get("/api/dashboard/projects-list")
def get_projects_list(client = Depends(get_db_client)):
    sql = """
    SELECT project_id, project_name, status 
    FROM dim_project 
    ORDER BY project_name
    """
    df = get_data_from_clickhouse(client, sql)
    return df.to_dict('records')


@router.get("/api/dashboard/clients-list")
def get_clients_list(client = Depends(get_db_client)):
    sql = "SELECT client_id, name FROM dim_client ORDER BY name"
    df = get_data_from_clickhouse(client, sql)
    return df.to_dict('records')
