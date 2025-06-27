import pandas as pd

def transform_fact_cash_flow(data: dict):

    cashflows = data.get("cashflows", [])

    if not cashflows:
        return pd.DataFrame()

    df_cashflows = pd.DataFrame(cashflows)

    df_cashflows.rename(columns={
        '_id': 'cash_flow_id',
        'project': 'project_id',
        'estimatedTotal': 'estimated_total',
        'availableBudget': 'available_budget',
    }, inplace=True)

    df_final = df_cashflows[[
        'cash_flow_id',
        'project_id',
        'available_budget',
        'estimated_total',
        'total',
        'updated'
    ]].copy()

    df_final['cash_flow_id'] = df_final['cash_flow_id'].astype(str)
    df_final['project_id'] = df_final['project_id'].astype(str)
    df_final['updated'] = pd.to_datetime(df_final['updated'])

    return df_final
