import pandas as pd

def transform_fact_inventory_assignment(data: dict):
    tasks = data.get('tasks', [])
    inventories = data.get("projectinventories", [])

    if not all([tasks, inventories]):
        return pd.DataFrame()

    df_tasks = pd.DataFrame(tasks)
    df_inventories = pd.DataFrame(inventories)

    df_tasks = df_tasks[df_tasks['assignedResources'].notna()]
    df_tasks = df_tasks[df_tasks['assignedResources'].apply(lambda x: isinstance(x, list) and len(x) > 0)]

    df_tasks = df_tasks.explode('assignedResources')

    df_tasks_explode = df_tasks['assignedResources'].apply(pd.Series).drop(columns=['_id'])
    df_tasks = df_tasks.drop(columns=['assignedResources']).join(df_tasks_explode).rename(columns={'resource': 'resource_id'})

    df_tasks.rename(
        columns={
        '_id': 'task_id',
        'project': 'project_id'
        }, inplace=True
    )

    df_inventories.rename(
        columns={
        '_id': 'inventory_id',
        'project': 'project_id'
        }, inplace=True
    )
    df_inventories.drop(columns=['removed', '__v', 'created', 'updated'], inplace=True)

    df = df_tasks.merge(df_inventories, on='project_id', how='left')
    df['assignment_id'] = df.apply(
        lambda row: f"{row['task_id']}_{row['resource_id']}_{row['inventory_id']}",
        axis=1
    )

    df_final = df[[
        'assignment_id',
        'inventory_id',
        'task_id',
        'resource_id',
        'quantity',
        'updated'
    ]].copy()

    df_final = df_final.dropna(subset=['inventory_id', 'task_id', 'resource_id'])
    df_final['quantity'] = df_final['quantity'].fillna(0).astype(float)
    df_final['quantity'] = df_final['quantity'].apply(lambda x: round(x, 2))
    df_final['inventory_id'] = df_final['inventory_id'].astype(str)
    df_final['task_id'] = df_final['task_id'].astype(str)
    df_final['resource_id'] = df_final['resource_id'].astype(str)
    df_final['updated'] = pd.to_datetime(df_final['updated'], errors='coerce')

    return df_final