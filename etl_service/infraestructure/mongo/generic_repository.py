from config import settings
from datetime import datetime
from pymongo import MongoClient
from domain.repositories.base_repository import BaseRepository

from typing import Generic, Optional, TypeVar

T = TypeVar("T")

class MongoRepository(BaseRepository[T], Generic[T]):
    """
    A class used to represent a MongoDB repository.
    Inherits from BaseRepository.

    Attributes
    ----------
    db_name : str
        Name of the database.

    Methods
    ----------
    extract_all(projection: Optional[dict] = None) -> list[T]
        Extract all documents from the collection.

    extract_incremental(from_date: datetime, to_date: Optional[datetime] = None,
        updated_field: str = "updated", projection: Optional[dict] = None)
        -> list[T]
            Extract documents modified after a specific timestamp.
    """

    def __init__(self, db_name: str):
        self.client = MongoClient(settings.MONGO_URI)
        self.db = self.client[db_name]

    def extract_all(
        self,
        collection: str,
        projection: Optional[dict] = None
    ) -> list[T]:
        """
        Extract all documents from the collection.

        Parameters
        ----------
        projection : Optional[dict]
            Optional projection to filter fields.

        Returns
        ----------
        list[T]
            List of all documents in the collection.
        """
        results = self.db[collection].find({}, projection or {})

        return list(results)

    def extract_incremental(self, collection: str,
                            from_date: datetime,
                            to_date: Optional[datetime] = None,
                            updated_field: str = "updated",
                            projection: Optional[dict] = None) -> list[T]:
        """
        Extracts documents modified after a specific timestamp.

        Parameters
        ----------
        from_date : datetime
            Timestamp to filter documents.
        to_date : Optional[datetime]
            Optional timestamp to filter documents.
        updated_field : str
            Field of the document that indicates the last modification.
        projection : Optional[dict]
            Optional projection to filter fields.

        Returns
        ----------
        list[T]
            List of documents modified after the specified timestamp.
        """
        if to_date is None:
            query = {updated_field: {"$gt": from_date}}
        else:
            query = {updated_field: {"$gt": from_date, "$lt": to_date}}

        results = list(self.db[collection].find(query, projection or {}))

        return results

    def close(self):
        """
        Closes the MongoDB connection.
        """
        self.client.close()
