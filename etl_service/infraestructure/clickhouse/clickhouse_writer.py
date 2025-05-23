from datetime import datetime, timezone
from typing import Optional
import pandas as pd
from clickhouse_connect import get_client
from clickhouse_connect.driver.client import Client

from config import settings

class ClickHouseWriter:
    def __init__(self) -> None:
        try:
            self.client: Client = get_client(
                host=settings.CLICKHOUSE_HOST,
                user=settings.CLICKHOUSE_USER,
                password=settings.CLICKHOUSE_PASSWORD or '',
                settings={'session_timezone': 'UTC'}
            )
            print("ClickHouse connection successful.")
        except Exception as e:
            print(f"Failed to connect to ClickHouse: {e}")
            raise

    def get_last_load_timestamp(self, table_name: str) -> Optional[datetime]:
        query = f"""
        SELECT max(last_load_timestamp) 
        FROM {settings.CLICKHOUSE_CONTROL_TABLE} 
        WHERE table_name = %(name)s
        """
        result = self.client.query(query, parameters={'name': table_name})
        
        if result.row_count > 0 and result.first_row and result.first_row[0] is not None:
            naive_utc_timestamp: datetime = result.first_row[0]
            
            aware_utc_timestamp = naive_utc_timestamp.replace(tzinfo=timezone.utc)
            
            print(f"Found last load timestamp for '{table_name}': {aware_utc_timestamp.isoformat()}")
            return aware_utc_timestamp
        
        print(f"No previous load timestamp found for '{table_name}'.")
        return None

    def update_last_load_timestamp(self, table_name: str, new_timestamp: datetime) -> None:
        if new_timestamp.tzinfo is None:
             raise ValueError("Timestamp to be saved must be timezone-aware.")

        control_data = [[table_name, new_timestamp]]
        self.client.insert(
            settings.CLICKHOUSE_CONTROL_TABLE,
            control_data,
            column_names=['table_name', 'last_load_timestamp']
        )
        print(f"Updated checkpoint for '{table_name}' to {new_timestamp.isoformat()}.")
        
    def insert_dataframe(self, table: str, df: pd.DataFrame) -> None:
        if df.empty:
            print(f"No data to insert into {table}.")
            return
        
        try:
            self.client.insert_df(table, df)
            print(f"Successfully inserted {len(df)} rows into {table}.")
            self.client.command(f"OPTIMIZE TABLE {table} FINAL")
            print(f"Optimization completed for {table}.")
        except Exception as e:
            print(f"An error occurred during insertion or optimization for table {table}: {e}")
            raise

    def close(self):
        self.client.close()
