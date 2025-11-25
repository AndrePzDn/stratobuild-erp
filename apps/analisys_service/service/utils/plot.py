import json
import plotly.express as px
from plotly.graph_objs import Figure
from typing import List, Dict, Any

from ..config.visuals import get_default_visuals


def fig_to_json_safe(fig: Figure):
    try:
        return json.loads(fig.to_json())
    except Exception:
        return json.loads(px.scatter(title="Sin datos").to_json())


def map_value_to_threshold_label(value: float, thresholds: List[Dict[str, Any]]) -> str:
    """Map a numeric value to a threshold label based on thresholds list.

    thresholds: list of dicts with keys: label, max, color
    """
    try:
        v = float(value)
    except Exception:
        return "unknown"

    for t in thresholds:
        if v <= t.get("max", 0):
            return t.get("label", "unknown")
    return thresholds[-1].get("label", "unknown") if thresholds else "unknown"


def make_color_map_from_thresholds(thresholds: List[Dict[str, Any]]) -> Dict[str, str]:
    """Return a mapping label -> color from thresholds list."""
    return {t.get("label"): t.get("color") for t in thresholds}


def add_progress_category_column(df, progress_col: str = "progreso", out_col: str = "progress_category", visuals: dict = None):
    """Add a categorical column to the dataframe mapping progress numeric to labels.

    Mutates the df in-place and also returns it for convenience.
    """
    if visuals is None:
        visuals = get_default_visuals()

    thresholds = visuals.get("progress_thresholds", [])

    def _map(v):
        return map_value_to_threshold_label(v, thresholds)

    df[out_col] = df[progress_col].apply(_map) if progress_col in df.columns else "unknown"
    return df


def get_visuals_defaults():
    return get_default_visuals()
