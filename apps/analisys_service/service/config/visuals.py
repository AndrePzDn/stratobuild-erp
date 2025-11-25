DEFAULT_VISUALS = {
    "color_discrete_map": {
        "income": "#10b981",
        "expense": "#ef4444",
    },

    "progress_thresholds": [
        {"label": "0", "max": 0, "color": "#6b7280"},
        {"label": "0-20", "max": 20, "color": "#d1d5db"},
        {"label": "20-40", "max": 40, "color": "#9ca3af"},
        {"label": "40-60", "max": 60, "color": "#fbbf24"},
        {"label": "60-80", "max": 80, "color": "#84cc16"},
        {"label": "80-100", "max": 100, "color": "#10b981"},
    ],

    "progress_gradient": ["#9ca3af", "#10b981"],
    "not_started_color": "#9ca3af",

    "color_continuous_scale": "RdYlGn",
}

def get_default_visuals():
    return DEFAULT_VISUALS
