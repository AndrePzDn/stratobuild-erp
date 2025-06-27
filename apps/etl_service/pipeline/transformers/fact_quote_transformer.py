import pandas as pd

def transform_fact_quote(data: dict):

    quotes = data.get("quotes", [])

    if not quotes:
        return pd.DataFrame()

    df_quotes = pd.DataFrame(quotes)

    df_quotes.rename(columns={
        '_id': 'quote_id',
        'client': 'client_id',
        'created_by': 'created_by_user_id',
        'provider': 'provider_id',
        'expiredDate': 'expired_date',
    }, inplace=True)

    df_quotes['currency_id'] = df_quotes.get('currency', 'USD')


    df_final = df_quotes[[
        "quote_id",
        "client_id",
        "created_by_user_id",
        "currency_id",
        "date",
        "expired_date",
        "status",
        "approved",
        "converted",
        "total",
        "updated"
    ]].copy()

    df_final['quote_id'] = df_final['quote_id'].astype(str)
    df_final['client_id'] = df_final['client_id'].astype(str)
    df_final['created_by_user_id'] = df_final['created_by_user_id'].astype(str)
    df_final['currency_id'] = df_final['currency_id'].astype(str)
    df_final['updated'] = pd.to_datetime(df_final['updated'])

    return df_final
