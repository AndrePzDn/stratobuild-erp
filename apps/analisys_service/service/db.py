import os
from typing import Generator

import clickhouse_connect
import pandas as pd
from dotenv import load_dotenv


# Load environment variables from .env (if present)
load_dotenv()

CLICKHOUSE_HOST = os.getenv("CLICKHOUSE_HOST", "localhost")
CLICKHOUSE_PORT = int(os.getenv("CLICKHOUSE_PORT", "8123"))
CLICKHOUSE_USER = os.getenv("CLICKHOUSE_USER", "default")
CLICKHOUSE_PASSWORD = os.getenv("CLICKHOUSE_PASSWORD", "admin")
CLICKHOUSE_DB = os.getenv("CLICKHOUSE_DB", "default")


def get_db_client() -> Generator:
    """Yield a ClickHouse client configured via environment variables.

    Environment variables supported:
    - CLICKHOUSE_HOST
    - CLICKHOUSE_PORT
    - CLICKHOUSE_USER
    - CLICKHOUSE_PASSWORD
    - CLICKHOUSE_DB
    """
    try:
        client = clickhouse_connect.get_client(
            host=CLICKHOUSE_HOST,
            port=CLICKHOUSE_PORT,
            username=CLICKHOUSE_USER,
            password=CLICKHOUSE_PASSWORD,
            database=CLICKHOUSE_DB,
        )
        yield client
    finally:
        try:
            client.close()
        except Exception:
            pass


def get_data_from_clickhouse(client, query: str, parameters: dict = None) -> pd.DataFrame:
    try:
        result = client.query_df(query, parameters=parameters)
        return result
    except Exception:
        return pd.DataFrame()
