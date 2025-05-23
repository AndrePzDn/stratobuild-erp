import pandas as pd

def transform_fact_project_task(data: dict):

    tasks = data.get("tasks", [])

    if not all([tasks]):
        return pd.DataFrame()

    df_tasks = pd.DataFrame(tasks)

    df_tasks.rename(columns={
        '_id': 'task_id',
        'project': 'project_id',
        'startDate': 'estimated_start_date',
        'endDate': 'estimated_end_date',
        'estimatedStartDate': 'actual_start_date',
        'estimatedEndDate': 'actual_end_date',
        'status': 'status',
        'progress': 'progress'
    }, inplace=True)

    df_final = df_tasks[[
        "task_id",
        "project_id",
        "estimated_start_date",
        "estimated_end_date",
        "actual_start_date",
        "actual_end_date",
        "status",
        "progress",
        "updated"
    ]].copy()

    df_final['task_id'] = df_final['task_id'].astype(str)
    df_final['project_id'] = df_final['project_id'].astype(str)
    df_final = df_final.replace({pd.NaT: None})
    df_final['updated'] = pd.to_datetime(df_final['updated'])

    return df_final
