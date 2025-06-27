import pandas as pd

def transform_dim_client(data: dict):

    clients = data.get("clients", [])
    admins = data.get("admins", [])

    if not all([clients, admins]):
        return pd.DataFrame()

    df_client = pd.DataFrame(clients)
    df_admin  = pd.DataFrame(admins)

    df_client.rename(columns={
        '_id': 'client_id',
        'createdBy': 'created_by_user_id',
    }, inplace=True)

    df_admin.rename(columns={
        '_id': 'admin_id',
    }, inplace=True)

    df = df_client.merge(
        df_admin[['admin_id']],
        left_on='created_by_user_id',
        right_on='admin_id',
        how='left'
    )

    df_final = df[[
        'client_id',
        'name',
        'country',
        'email',
        'created_by_user_id',
        'updated'
    ]].copy()

    df_final['client_id'] = df_final['client_id'].astype(str)
    df_final['created_by_user_id'] = df_final['created_by_user_id'].astype(str)
    df_final['updated'] = pd.to_datetime(df_final['updated'])


    return df_final
