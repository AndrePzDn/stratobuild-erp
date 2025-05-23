import pandas as pd

def transform_dim_task(data: dict):

    tasks = data.get("tasks", [])

    if not all([tasks]):
        return pd.DataFrame()

    df_tasks = pd.DataFrame(tasks)

    df_tasks.rename(columns={
        '_id': 'task_id',
        'project': 'project_id',
        'startDate': 'start_date',
        'endDate': 'end_date',
    }, inplace=True)

    df_final = df_tasks[[
        "task_id",
        "name",
        "category",
        "status",
        "project_id",
        "start_date",
        "end_date",
        "updated"
    ]].copy()

    df_final['task_id'] = df_final['task_id'].astype(str)
    df_final['project_id'] = df_final['project_id'].astype(str)
    df_final['updated'] = pd.to_datetime(df_final['updated'])

    return df_final
