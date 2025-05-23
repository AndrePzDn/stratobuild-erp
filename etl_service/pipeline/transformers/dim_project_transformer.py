import pandas as pd

def transform_dim_project(data: dict):

    projects = data.get("projects", [])
    clients = data.get("clients", [])
    services = data.get("services", [])
    project_types = data.get("project_types", [])

    if not all([projects, clients, services, project_types]):
        return pd.DataFrame()

    df_projects = pd.DataFrame(projects)
    df_clients = pd.DataFrame(clients)
    df_services = pd.DataFrame(services)
    df_project_types = pd.DataFrame(project_types)

    df_projects.rename(columns={
        '_id': 'project_id',
        'name': 'project_name',
        'client': 'client_id',
        'startDate': 'start_date',
        'endDate': 'end_date',
        'projectType': 'project_type_id',
        'serviceType': 'service_type_id',
    }, inplace=True)

    df_clients.rename(columns={'_id': 'client_id'}, inplace=True)

    df_project_types.rename(columns={
        '_id': 'project_type_id',
        'name': 'project_type_name'
    }, inplace=True)
    df_project_types.drop(columns=['updated'], inplace=True)

    df_services.rename(columns={
        '_id': 'service_type_id',
        'name': 'service_type_name'
    }, inplace=True)
    df_services.drop(columns=['updated'], inplace=True)

    df = df_projects.merge(
        df_clients[['client_id']],
        on='client_id',
        how='left'
    )

    df = df.merge(
        df_project_types[['project_type_id', 'project_type_name']],
        on='project_type_id',
        how='left'
    ).drop(columns=['project_type_id'])

    df = df.merge(
        df_services[['service_type_id', 'service_type_name']],
        on='service_type_id',
        how='left'
    ).drop(columns=['service_type_id'])

    df['location'] = 'Sin Especificar'


    df_final = df[[
        "project_id" ,
        "project_name",
        "client_id",
        "location",
        "status",
        "start_date",
        "end_date",
        "project_type_name",
        "service_type_name",
        "updated"
    ]].copy()

    df_final['project_id'] = df_final['project_id'].astype(str)
    df_final['client_id'] = df_final['client_id'].astype(str)
    df_final = df_final.replace({pd.NaT: None})
    df_final['updated'] = pd.to_datetime(df_final['updated'])

    return df_final
