from fastapi import APIRouter, Depends
from datetime import datetime
from ..db import get_db_client, get_data_from_clickhouse

router = APIRouter()


@router.get("/")
def root():
    return {"status": "ok", "service": "BI Dashboard API", "version": "2.0"}


@router.get("/api/health")
def health_check(client = Depends(get_db_client)):
    try:
        result = get_data_from_clickhouse(client, "SELECT 1 as test")
        return {
            "status": "healthy",
            "database": "connected" if not result.empty else "error",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
