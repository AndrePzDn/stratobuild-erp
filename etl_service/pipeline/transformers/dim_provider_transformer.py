import pandas as pd

def transform_dim_provider(data: dict):

    providers = data.get("providers", [])

    if not providers:
        return pd.DataFrame()

    df_providers = pd.DataFrame(providers)

    df_providers.rename(columns={
        '_id': 'provider_id',
    }, inplace=True)

    df_providers['email'] = df_providers['email'].fillna('Sin Especificar')

    df_final = df_providers[[
        'provider_id',
        'name',
        'email',
        'phone',
        'updated'
    ]].copy()

    df_final['provider_id'] = df_final['provider_id'].astype(str)
    df_final['updated'] = pd.to_datetime(df_final['updated'])

    return df_final
