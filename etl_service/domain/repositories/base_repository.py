from abc import ABC, abstractmethod
from datetime import datetime
from typing import Dict, List, Optional, Generic, TypeVar

T = TypeVar("T")

class BaseRepository(ABC, Generic[T]):
    """
    Base class for repositories.

    Attributes
    ----------
    db_name : str
        Name of the database.

    Methods
    ----------
    extract_all(projection: Optional[Dict] = None) -> List[T]
        Extract all documents from the collection.

    extract_incremental(from_date: datetime, to_date: Optional[datetime] = None,
        updated_field: str = "updated", projection: Optional[Dict] = None) -> List[T]
            Extract documents modified after a specific timestamp.
    """

    @abstractmethod
    def extract_all(self, collection, projection: Optional[Dict] = None) -> List[T]:
        pass

    @abstractmethod
    def extract_incremental(self, collection, from_date: datetime, 
                            to_date: Optional[datetime] = None,
                            updated_field: str = "updated",
                            projection: Optional[Dict] = None) -> List[T]:
        pass

    @abstractmethod
    def close(self):
        pass
