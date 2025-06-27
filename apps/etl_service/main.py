from config import settings
from infraestructure.mongo.generic_repository import MongoRepository
from infraestructure.clickhouse.clickhouse_writer import ClickHouseWriter
from app.use_cases.etl_use_cases import ETLUseCase

from pipeline.transformers.dim_client_transformer import transform_dim_client
from pipeline.transformers.dim_currency_transformer import transform_dim_currency
from pipeline.transformers.dim_project_transformer import transform_dim_project
from pipeline.transformers.dim_provider_transformer import transform_dim_provider
from pipeline.transformers.dim_resouce_transformer import transform_dim_resource
from pipeline.transformers.dim_task_transformer import transform_dim_task
from pipeline.transformers.fact_budget_transformer import transform_fact_budget
from pipeline.transformers.fact_cash_flow_transformer import transform_fact_cash_flow
from pipeline.transformers.fact_payment_transformer import transform_fact_payment
from pipeline.transformers.fact_project_task_transformer import transform_fact_project_task
from pipeline.transformers.fact_quote_transformer import transform_fact_quote

PIPELINE_CONFIG = [
    {
        "name": "Client Dimension",
        "sources": [
            {"key": "clients", "collection": "clients", "type": "incremental"},
            {"key": "admins", "collection": "admins", "type": "full"}
        ],
        "transformer": transform_dim_client,
        "destination_table": "dim_client"
    },
    {
        "name": "Project Dimension",
        "sources": [
            {"key": "projects", "collection": "projects", "type": "incremental"},
            {"key": "clients", "collection": "clients", "type": "full"},
            {"key": "services", "collection": "servicetypes", "type": "full"},
            {"key": "project_types", "collection": "projecttypes", "type": "full"}
        ],
        "transformer": transform_dim_project,
        "destination_table": "dim_project"
    },
    {
        "name": "Currency Dimension",
        "sources": [
            {"key": "currencies", "collection": "currencies", "type": "incremental"}
        ],
        "transformer": transform_dim_currency,
        "destination_table": "dim_currency"
    },
    {
        "name": "Provider Dimension",
        "sources": [{"key": "providers", "collection": "providers", "type": "incremental"}],
        "transformer": transform_dim_provider,
        "destination_table": "dim_provider"
    },
    {
        "name": "Resource Dimension",
        "sources": [
            {"key": "resources", "collection": "resources", "type": "incremental"},
            {"key": "unitOfMeasurements", "collection": "unitofmeasurements", "type": "full"}
        ],
        "transformer": transform_dim_resource,
        "destination_table": "dim_resource"
    },
    {
        "name": "Task Dimension",
        "sources": [{"key": "tasks", "collection": "tasks", "type": "incremental"}],
        "transformer": transform_dim_task,
        "destination_table": "dim_task"
    },
    {
        "name": "Budget Fact Table",
        "sources": [
            {"key": "budgets", "collection": "budgets", "type": "incremental"},
            {"key": "serviceTypes", "collection": "servicetypes", "type": "full"},
            {"key": "projectTypes", "collection": "projecttypes", "type": "full"}
        ],
        "transformer": transform_fact_budget,
        "destination_table": "fact_budget"
    },
    {
        "name": "Cash Flow Fact Table",
        "sources": [{"key": "cashflows", "collection": "cashflows", "type": "incremental"}],
        "transformer": transform_fact_cash_flow,
        "destination_table": "fact_cash_flow"
    },
    {
        "name": "Payment Fact Table",
        "sources": [
            {"key": "payments", "collection": "payments", "type": "incremental"},
            {"key": "cashflows", "collection": "cashflows", "type": "full"}
        ],
        "transformer": transform_fact_payment,
        "destination_table": "fact_payment"
    },
    {
        "name": "Project Task Fact Table",
        "sources": [{"key": "tasks", "collection": "tasks", "type": "incremental"}],
        "transformer": transform_fact_project_task,
        "destination_table": "fact_project_task"
    },
    {
        "name": "Quote Fact Table",
        "sources": [{"key": "quotes", "collection": "quotes", "type": "incremental"}],
        "transformer": transform_fact_quote,
        "destination_table": "fact_quote"
    }
]

def main():
    mongo_repo = None
    ch_writer = None
    try:
        mongo_repo = MongoRepository(db_name=settings.MONGO_DB)
        ch_writer = ClickHouseWriter()

        etl_use_case = ETLUseCase(mongo_repo=mongo_repo, ch_writer=ch_writer)

        for config in PIPELINE_CONFIG:
            etl_use_case.run_incremental_etl_for_table(
                pipeline_name=config["name"],
                sources=config["sources"],
                transformer=config["transformer"],
                destination_table=config["destination_table"]
            )

    except Exception as e:
        print(f"A error occurred in the main execution block: {e}")
    finally:
        if mongo_repo:
            mongo_repo.close()
            print("MongoDB connection closed.")
        if ch_writer:
            ch_writer.close()
            print("ClickHouse connection closed.")

if __name__ == "__main__":
    main()
