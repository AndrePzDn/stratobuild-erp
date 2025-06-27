import pandas as pd
from datetime import datetime, timezone
from typing import Callable, Dict, List

from infraestructure.mongo.generic_repository import MongoRepository
from infraestructure.clickhouse.clickhouse_writer import ClickHouseWriter

class ETLUseCase:
    def __init__(self, mongo_repo: MongoRepository, ch_writer: ClickHouseWriter):
        self.mongo_repo = mongo_repo
        self.ch_writer = ch_writer

    def run_incremental_etl_for_table(
        self, 
        pipeline_name: str,
        sources: List[Dict], # Recibe la nueva lista de fuentes
        transformer: Callable[[Dict[str, List[dict]]], pd.DataFrame], 
        destination_table: str
    ):
        print("--------------------------------------------------")
        print(f"--- Starting ETL for: {pipeline_name} ---")

        run_timestamp = datetime.now(timezone.utc)
        last_load = self.ch_writer.get_last_load_timestamp(destination_table)

        from_date = last_load or datetime(2000, 1, 1)

        print(f"Extraction window for '{destination_table}': {from_date} -> {run_timestamp}")

        extracted_data = {}
        incremental_docs_count = 0

        for source in sources:
            source_key = source['key']
            collection_name = source['collection']
            extract_type = source['type']
            data = []

            print(f"Extracting from '{collection_name}' with mode: '{extract_type}'...")

            if extract_type == 'incremental':
                data = self.mongo_repo.extract_incremental(
                    collection=collection_name,
                    from_date=from_date,
                    to_date=run_timestamp,
                    updated_field="updated"
                )
                incremental_docs_count = len(data)
            elif extract_type == 'full':
                data = self.mongo_repo.extract_all(collection=collection_name)
            else:
                print(f"Warning: Unknown extraction type '{extract_type}' for collection '{collection_name}'. Skipping.")

            extracted_data[source_key] = data
            print(f"Extracted {len(data)} documents from MongoDB collection '{collection_name}'.")

        if incremental_docs_count == 0:
            print(f"No new incremental data found for '{pipeline_name}'. Process finished.")
            print("--------------------------------------------------\n")
            return

        print("Transforming data...")
        transformed_df = transformer(extracted_data)

        if transformed_df.empty:
            print("Transformation resulted in empty data. Nothing to load.")
            print("--------------------------------------------------\n")
            return

        print(f"Transformation complete. {len(transformed_df)} rows ready to be loaded.")

        print(f"Loading data into ClickHouse table '{destination_table}'...")
        try:
            self.ch_writer.insert_dataframe(destination_table, transformed_df)

            self.ch_writer.update_last_load_timestamp(destination_table, run_timestamp)

            print(f"--- ETL for: {pipeline_name} completed successfully ---")
            print("--------------------------------------------------\n")

        except Exception as e:
            print(f"ETL FAILED for {pipeline_name}: {e}")
            print(f"No new data found for '{pipeline_name}'")
            print("--------------------------------------------------\n")
