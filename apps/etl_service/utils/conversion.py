from typing import Any, Sequence

def get_sequence_of_sequences_from_dict(data: Sequence[dict]) -> Sequence[Sequence[Any]]:
    return [list(item.values()) for item in data] if data else []
