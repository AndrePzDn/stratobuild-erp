import pandas as pd

def transform_fact_payment(data: dict):

    payments = data.get("payments", [])
    cashflows = data.get("cashflows", [])

    if not all([payments, cashflows]):
        return pd.DataFrame()

    df_payments = pd.DataFrame(payments)
    df_cashflows = pd.DataFrame(cashflows)

    df_payments.rename(columns={
        '_id': 'payment_id',
        'cashFlow': 'cash_flow_id',
        'currency': 'currency_id',
        'paymentType': 'payment_type',
    }, inplace=True)

    df_payments['currency_id'] = df_payments.get('currency_id', 'USD')

    df_cashflows.rename(columns={
        '_id': 'cash_flow_id',
        'project': 'project_id',
    }, inplace=True)
    df_cashflows.drop(columns=['updated'], inplace=True)

    df = df_payments.merge(
        df_cashflows[['cash_flow_id', 'project_id']],
        on='cash_flow_id',
        how='left'
    )

    df_final = df[[
        'payment_id',
        'cash_flow_id',
        'project_id',
        'currency_id',
        'payment_type',
        'amount',
        'date',
        'updated'
    ]].copy()

    df_final['payment_id'] = df_final['payment_id'].astype(str)
    df_final['cash_flow_id'] = df_final['cash_flow_id'].astype(str)
    df_final['project_id'] = df_final['project_id'].astype(str)
    df_final['currency_id'] = df_final['currency_id'].astype(str)
    df_final['updated'] = pd.to_datetime(df_final['updated'])

    return df_final
