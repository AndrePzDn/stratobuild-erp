from fastapi import APIRouter, Depends, Query
from typing import Optional, List
import pandas as pd
from ..db import get_db_client, get_data_from_clickhouse

router = APIRouter()


@router.get("/api/dashboard/kpis")
def get_kpis(
    project_id: Optional[str] = None,
    client_id: Optional[str] = None,
    year: Optional[int] = None,
    project_name: Optional[List[str]] = Query(None),
    client = Depends(get_db_client)
):
    filters = []
    params = {}
    
    if project_id:
        filters.append("FP.project_id = %(pid)s")
        params['pid'] = project_id
    
    if client_id:
        filters.append("DP.client_id = %(cid)s")
        params['cid'] = client_id
        
    if year:
        filters.append("toYear(FP.date) = %(year)s")
        params['year'] = year

    # Manejar múltiples nombres de proyecto
    if project_name and len(project_name) > 0:
        # Asegurarse de que es una lista
        if not isinstance(project_name, list):
            project_name = [project_name]
        
        placeholders = ", ".join([f"%(pname{i})s" for i in range(len(project_name))])
        filters.append(f"DP.project_name IN ({placeholders})")
        for i, name in enumerate(project_name):
            params[f'pname{i}'] = name
    
    where_clause = "WHERE " + " AND ".join(filters) if filters else ""
    
    sql_finance = f"""
    SELECT 
        sumIf(FP.amount, FP.payment_type = 'income') as total_income,
        sumIf(FP.amount, FP.payment_type = 'expense') as total_expense
    FROM fact_payment FP
    LEFT JOIN dim_project DP ON FP.project_id = DP.project_id
    {where_clause}
    """
    
    proj_filter = "WHERE status = 'active'"
    if client_id:
        proj_filter += f" AND client_id = %(cid)s"
    if project_name and len(project_name) > 0:
        placeholders = ", ".join([f"%(pname{i})s" for i in range(len(project_name))])
        proj_filter += f" AND project_name IN ({placeholders})"
    
    sql_projects = f"SELECT count() as val FROM dim_project {proj_filter}"
    
    progress_filters = []
    if project_id:
        progress_filters.append("FPT.project_id = %(pid)s")
    if client_id:
        progress_filters.append("DP.client_id = %(cid)s")
    if project_name and len(project_name) > 0:
        placeholders = ", ".join([f"%(pname{i})s" for i in range(len(project_name))])
        progress_filters.append(f"DP.project_name IN ({placeholders})")

    progress_where = "WHERE " + " AND ".join(progress_filters) if progress_filters else ""

    sql_progress = f"""
    SELECT avg(progress) as avg_progress
    FROM fact_project_task FPT
    LEFT JOIN dim_project DP ON FPT.project_id = DP.project_id
    {progress_where}
    """
    
    df_finance = get_data_from_clickhouse(client, sql_finance, params)
    df_projects = get_data_from_clickhouse(client, sql_projects, params)
    df_progress = get_data_from_clickhouse(client, sql_progress, params)

    task_filters = []
    if project_id:
        task_filters.append("FPT.project_id = %(pid)s")
    if client_id:
        task_filters.append("DP.client_id = %(cid)s")
    if project_name and len(project_name) > 0:
        placeholders = ", ".join([f"%(pname{i})s" for i in range(len(project_name))])
        task_filters.append(f"DP.project_name IN ({placeholders})")
    if year:
        task_filters.append("toYear(ifNull(FPT.actual_start_date, FPT.estimated_start_date)) = %(year)s")

    where_tasks = "WHERE " + " AND ".join(task_filters) if task_filters else ""

    delayed_condition = "(FPT.estimated_end_date IS NOT NULL AND ((isNotNull(FPT.actual_end_date) AND FPT.actual_end_date > FPT.estimated_end_date) OR (isNull(FPT.actual_end_date) AND today() > FPT.estimated_end_date)))"

    if where_tasks:
        where_tasks = where_tasks + " AND " + delayed_condition
    else:
        where_tasks = "WHERE " + delayed_condition

    sql_task_states = f"""
    SELECT
        FPT.status as status,
        count() as cnt
    FROM fact_project_task FPT
    LEFT JOIN dim_project DP ON FPT.project_id = DP.project_id
    {where_tasks}
    GROUP BY FPT.status
    """

    df_task_states = get_data_from_clickhouse(client, sql_task_states, params)

    task_states = {}
    total_delayed_tasks = int(df_task_states['cnt'].sum()) if not df_task_states.empty else 0
    for _, r in df_task_states.iterrows():
        st = r['status'] if 'status' in r and pd.notnull(r['status']) else 'unknown'
        cnt = int(r['cnt']) if 'cnt' in r and pd.notnull(r['cnt']) else 0
        pct = round((cnt / total_delayed_tasks * 100), 1) if total_delayed_tasks > 0 else 0.0
        task_states[st] = {"count": cnt, "percent": pct}
    
    income = float(df_finance['total_income'].iloc[0]) if not df_finance.empty and pd.notnull(df_finance['total_income'].iloc[0]) else 0.0
    expense = float(df_finance['total_expense'].iloc[0]) if not df_finance.empty and pd.notnull(df_finance['total_expense'].iloc[0]) else 0.0
    active_projs = int(df_projects['val'].iloc[0]) if not df_projects.empty else 0
    avg_progress = float(df_progress['avg_progress'].iloc[0]) if not df_progress.empty and pd.notnull(df_progress['avg_progress'].iloc[0]) else 0.0
    
    return {
        "income": income,
        "expense": expense,
        "margin_percent": ((income - expense) / income * 100) if income > 0 else 0,
        "active_projects": active_projs,
        "avg_progress": round(avg_progress, 1),
        "task_states": task_states,
        "total_delayed_tasks": total_delayed_tasks,
        "delayed_task_states": task_states
    }
