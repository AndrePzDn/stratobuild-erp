import pandas as pd 

def transform_fact_budget(data: dict):

    budgets = data.get("budgets", [])
    service_types = data.get("serviceTypes", [])
    project_types = data.get("projectTypes", [])

    if not all([budgets, service_types, project_types]):
        return pd.DataFrame()

    df_budgets = pd.DataFrame(budgets)
    df_service_types = pd.DataFrame(service_types)
    df_project_types = pd.DataFrame(project_types)

    df_budgets.rename(columns={
        '_id': 'budget_id',
        'quote': 'quote_id',
        'created_by': 'created_by_user_id',
        'projectType': 'project_type_id',
        'serviceType': 'service_type_id',
        'amountPaid': 'paid',
    }, inplace=True)

    df_budgets['currency_id'] = 'USD'

    df_service_types.rename(columns={
        '_id': 'service_type_id',
        'name': 'service_type_name'
    }, inplace=True)
    df_service_types.drop(columns=['updated'], inplace=True)

    df_project_types.rename(columns={
        '_id': 'project_type_id',
        'name': 'project_type_name'
    }, inplace=True)
    df_project_types.drop(columns=['updated'], inplace=True)

    df = df_budgets.merge(
        df_service_types[['service_type_id', 'service_type_name']],
        on='service_type_id',
        how='left'
    ).drop(columns=['service_type_id'])

    df = df.merge(
        df_project_types[['project_type_id', 'project_type_name']],
        on='project_type_id',
        how='left'
    ).drop(columns=['project_type_id'])

    df_final = df[[
        "budget_id",
        "quote_id",
        "created_by_user_id",
        "currency_id",
        "project_type_name",
        "service_type_name",
        "paid",
        "total",
        "updated"
    ]].copy()

    df_final['budget_id'] = df_final['budget_id'].astype(str)
    df_final['quote_id'] = df_final['quote_id'].astype(str)
    df_final['created_by_user_id'] = df_final['created_by_user_id'].astype(str)
    df_final['updated'] = pd.to_datetime(df_final['updated'])

    return df_final
