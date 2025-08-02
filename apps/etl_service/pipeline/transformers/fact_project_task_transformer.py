import pandas as pd

def transform_fact_project_task(data: dict):
    tasks = data.get("tasks", [])

    if not tasks:
        return pd.DataFrame()

    df_tasks = pd.DataFrame(tasks)

    rename_map = {
        '_id': 'task_id',
        'project': 'project_id',
        'estimatedStartDate': 'estimated_start_date',
        'estimatedEndDate': 'estimated_end_date',
        'startDate': 'actual_start_date',
        'endDate': 'actual_end_date',
        'status': 'status',
        'progress': 'progress',
        'updated': 'updated'
    }

    df_tasks.rename(columns={k: v for k, v in rename_map.items() if k in df_tasks.columns}, inplace=True)

    required_columns = [
        "task_id",
        "project_id",
        "estimated_start_date",
        "estimated_end_date",
        "actual_start_date",
        "actual_end_date",
        "status",
        "progress",
        "updated"
    ]

    df_final = df_tasks.reindex(columns=required_columns).copy()

    df_final["task_id"] = df_final["task_id"].astype(str)
    df_final["project_id"] = df_final["project_id"].astype(str)

    df_final["updated"] = pd.to_datetime(df_final["updated"], errors="coerce")

    df_final = df_final.replace({pd.NaT: None})

    return df_final

