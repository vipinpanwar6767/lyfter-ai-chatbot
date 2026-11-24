import hashlib
import json

from datetime import datetime, timezone

from app.database import get_connection


# Generate a context-aware cache key
def generate_cache_key(
    model: str,
    messages: list[dict]
) -> str:

    payload = {
        "model": model,
        "messages": messages
    }

    serialized = json.dumps(
        payload,
        sort_keys=True,
        ensure_ascii=False
    )

    return hashlib.sha256(
        serialized.encode("utf-8")
    ).hexdigest()


# Retrieve a cached response
def get_cached_response(cache_key: str):

    with get_connection() as connection:

        row = connection.execute(
            """
            SELECT response, metadata
            FROM response_cache
            WHERE cache_key = ?
            """,
            (cache_key,)
        ).fetchone()

        if row is None:
            return None

        return {
            "response": row["response"],
            "metadata": json.loads(row["metadata"])
        }


# Store an AI response in the cache
def save_cached_response(
    cache_key: str,
    response: str,
    metadata: dict
):

    created_at = datetime.now(timezone.utc).isoformat()

    with get_connection() as connection:

        connection.execute(
            """
            INSERT INTO response_cache
            (cache_key, response, metadata, created_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(cache_key)
            DO NOTHING
            """,
            (
                cache_key,
                response,
                json.dumps(metadata),
                created_at
            )
        )