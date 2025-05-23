import pandas as pd
from typing import Callable, List

class TransformStep:
    """
    A class used to represent a transformation step in a data pipeline.

    Attributes
    ----------

    transformations : List[Callable[[pd.DataFrame], pd.DataFrame]]
        A list of transformation functions to be applied to the data.

    Methods
    ----------

    run(data: list[dict]) -> pd.DataFrame
        Apply a series of transformations to the input data.
    """

    def __init__(self, transformations: List[Callable[[pd.DataFrame],
                 pd.DataFrame]]):
        self.transformations = transformations or []

    def run(self, data: list[dict]) -> pd.DataFrame:
        """
        Apply a series of transformations to the input data.

        Parameters
        ----------

        data : list[dict]
            A list of dictionaries representing the data to be transformed.

        Returns
        ----------

        pd.DataFrame
            A DataFrame containing the transformed data.
        """
        df = pd.DataFrame(data)

        for transform in self.transformations:
            df = transform(df)

        return df

