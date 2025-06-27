from typing import Any, List
from datetime import datetime

from domain.repositories.base_repository import BaseRepository

class ExtractStep:
    """
    A class used to represent an extraction step in a data pipeline.

    Attributes
    ----------
    repository : BaseRepository
        The repository from which to extract data.

    Methods
    ----------

    run(from_date: datetime, to_date: datetime) -> List[Dict]
        Extracts data from the repository between the specified dates.
    """

    def __init__(self, repository: BaseRepository):
        self.repository = repository


    def run(
        self,
        collection: str,
        from_date: datetime,
        to_date: datetime
    ) -> List[Any]:
        """
        Extracts data from the repository between the specified dates.

        Parameters
        ----------

        collection : str
            The name of the collection to extract data from.

        from_date : datetime
            The start date for the extraction.

        to_date : datetime
            The end date for the extraction.

        Returns
        ----------

        List[Dict]
            A list of dictionaries representing the extracted data.
        """
        return self.repository.extract_incremental(
            collection=collection,
            from_date=from_date,
            to_date=to_date,
            updated_field="updated",
            projection=None
        )

