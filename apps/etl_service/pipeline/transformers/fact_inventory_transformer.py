import pandas as pd

def transform_fact_inventory(data: dict):
    inventories = data.get("projectinventories", [])

    if not inventories:
        return pd.DataFrame()

    df_inventories = pd.DataFrame(inventories)

    df_inventories.rename(
        columns={
            '_id': 'inventory_id',
            'project': 'project_id'
        }, inplace=True
    )

    df_exploded = df_inventories.explode('items', ignore_index=True)

    df_exploded = df_exploded[df_exploded['items'].apply(lambda x: isinstance(x, dict))]

    if df_exploded.empty:
        return pd.DataFrame()

    df_items_normalized = pd.json_normalize(df_exploded['items'])

    df_merged = df_exploded.drop(columns=['items']).reset_index(drop=True).join(df_items_normalized)

    # Check required columns
    required_cols = {'resource', 'quantity'}
    missing_cols = required_cols - set(df_merged.columns)
    if missing_cols:
        raise ValueError(f"Missing expected columns in items: {missing_cols}")

    df_merged.rename(columns={'resource': 'resource_id'}, inplace=True)

    df_final = df_merged[[
        'inventory_id',
        'project_id',
        'resource_id',
        'quantity',
        'updated'
    ]].copy()

    df_final['inventory_id'] = df_final['inventory_id'].astype(str)
    df_final['project_id'] = df_final['project_id'].astype(str)
    df_final['resource_id'] = df_final['resource_id'].astype(str)
    df_final['quantity'] = pd.to_numeric(df_final['quantity'], errors='coerce')
    df_final['updated'] = pd.to_datetime(df_final['updated'], errors='coerce')

    return df_final

