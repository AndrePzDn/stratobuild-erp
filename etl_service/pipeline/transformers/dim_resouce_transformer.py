import pandas as pd

def transform_dim_resource(data: dict):

    resouces = data.get("resources", [])
    unit_of_measurances = data.get("unitOfMeasurements", [])

    if not all([resouces, unit_of_measurances]):
        return pd.DataFrame()

    df_resources = pd.DataFrame(resouces)
    df_uom = pd.DataFrame(unit_of_measurances)

    df_resources.rename(columns={
        '_id': 'resource_id',
        'unitOfMeasurement': 'unit_of_measure_id',
        'resourceType': 'resource_type',
    }, inplace=True)

    df_uom.rename(columns={
        '_id': 'unit_of_measure_id',
        'name': 'unit_of_measurement',
    }, inplace=True)
    df_uom.drop(columns=['updated'], inplace=True)

    df = df_resources.merge(
        df_uom[['unit_of_measure_id', 'unit_of_measurement']],
        on='unit_of_measure_id',
        how='left'
    )

    df_final = df[[
        "resource_id",
        "name",
        "resource_type",
        "unit_of_measurement",
        "updated"
    ]].copy()

    df_final['resource_id'] = df_final['resource_id'].astype(str)
    df_final['updated'] = pd.to_datetime(df_final['updated'])

    return(df_final)
