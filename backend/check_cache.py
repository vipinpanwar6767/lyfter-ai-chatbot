from uuid import uuid4

from app.database import init_db, get_connection

from app.services.cache_service import (
    generate_cache_key,
    get_cached_response,
    save_cached_response
)


# Initialize database
init_db()


# Prepare unique test data
model = "gemini-3.5-flash-lite"

messages = [
    {
        "role": "system",
        "content": "You are a helpful programming tutor."
    },
    {
        "role": "user",
        "content": f"Cache test {uuid4()}: What is Python?"
    }
]


# Generate cache key
cache_key = generate_cache_key(model, messages)

print("Cache key:", cache_key)


try:

    # TEST 1: Cache miss
    print("\n========== CACHE MISS TEST ==========")

    result = get_cached_response(cache_key)

    print("Result:", result)

    assert result is None

    print("Cache miss test: PASSED")


    # TEST 2: Save response
    print("\n========== CACHE STORAGE TEST ==========")

    response = "Python is a high-level programming language."

    metadata = {
        "model": model,
        "key_id": "key_1",
        "cached": False,
        "input_tokens": 15,
        "output_tokens": 10,
        "latency_ms": 1200.50
    }

    save_cached_response(
        cache_key,
        response,
        metadata
    )

    print("Response saved successfully")


    # TEST 3: Cache hit
    print("\n========== CACHE HIT TEST ==========")

    result = get_cached_response(cache_key)

    print("Result:", result)

    assert result is not None
    assert result["response"] == response
    assert result["metadata"] == metadata

    print("Cache hit test: PASSED")

    print("\nAll cache tests passed!")


finally:

    # Remove temporary test data
    with get_connection() as connection:

        connection.execute(
            "DELETE FROM response_cache WHERE cache_key = ?",
            (cache_key,)
        )