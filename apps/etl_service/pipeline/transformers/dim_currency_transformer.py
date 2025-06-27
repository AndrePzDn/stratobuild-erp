import pandas as pd

def transform_dim_currency(data: dict):

    currencies = data.get("currencies", [])
    if not currencies:
        return pd.DataFrame()

    df_currencies = pd.DataFrame(currencies)
    df_currencies.drop(columns=['dollar_value'], inplace=True, errors='ignore')

    df_currencies.rename(columns={
        '_id': 'currency_id',
        'dollarValue': 'dollar_value'
    }, inplace=True)

    df_currencies['dollar_value'] = df_currencies['dollar_value'].fillna(1)

    df_final = df_currencies[[
        "currency_id",
        "name",
        "symbol",
        "dollar_value",
        "updated"
    ]].copy()

    df_final['currency_id'] = df_final['currency_id'].astype(str)
    df_final['updated'] = pd.to_datetime(df_final['updated'])

    return df_final
