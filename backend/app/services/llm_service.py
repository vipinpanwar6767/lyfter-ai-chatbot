import time
import logging

from litellm import completion

from litellm.exceptions import (
    RateLimitError,
    AuthenticationError,
    ServiceUnavailableError,
    Timeout,
    InternalServerError,
    APIConnectionError
)

from app.config import settings


# Logger for recording API failures
logger = logging.getLogger(__name__)


# Custom exception when all API keys fail
class AllKeysFailedError(Exception):
    pass


# Generate AI response using a specific API key
def generate_response(
    messages: list[dict],
    api_key: str,
    key_id: str
):

    # Record starting time
    start_time = time.perf_counter()

    # Send request to Gemini through LiteLLM
    response = completion(
        model=settings.llm_model,
        api_key=api_key,
        api_base=settings.llm_api_base,
        messages=messages,
        caching=False,
        num_retries=0,
        timeout=30
    )

    # Calculate response latency in milliseconds
    latency_ms = round(
        (time.perf_counter() - start_time) * 1000,
        2
    )

    # Extract AI-generated response
    assistant_message = response.choices[0].message.content

    # Validate the generated response
    if not assistant_message:
        raise ValueError("LLM returned an empty response")

    # Extract token usage
    usage = response.usage

    # Prepare response metadata
    metadata = {
        "model": response.model or settings.llm_model,
        "key_id": key_id,
        "cached": False,
        "input_tokens": usage.prompt_tokens or 0,
        "output_tokens": usage.completion_tokens or 0,
        "latency_ms": latency_ms
    }

    return assistant_message, metadata


# Generate response with automatic API key failover
def generate_with_failover(
    messages: list[dict],
    simulate_failure: bool = False
):

    # Record total request starting time
    start_time = time.perf_counter()

    # Iterate over all configured API keys
    for index, api_key in enumerate(settings.llm_api_keys):

        # Generate a safe key identifier
        key_id = f"key_{index + 1}"

        try:

            # Simulate primary key failure for demonstration
            if (
                settings.enable_failure_simulation
                and simulate_failure
                and index == 0
            ):
                logger.warning(
                    "Simulated failure for %s", key_id
                )

                continue

            # Attempt response generation
            answer, metadata = generate_response(
                messages=messages,
                api_key=api_key,
                key_id=key_id
            )

            # Calculate total latency including failover
            metadata["latency_ms"] = round(
                (time.perf_counter() - start_time) * 1000,
                2
            )

            # Return immediately if successful
            return answer, metadata

        except (
            RateLimitError,
            AuthenticationError,
            ServiceUnavailableError,
            Timeout,
            InternalServerError,
            APIConnectionError
        ) as error:

            # Log failure without exposing API credentials
            logger.warning(
                "%s failed with %s",
                key_id,
                type(error).__name__
            )

            # Move to the next available API key
            continue

    # Raise an exception if all API keys fail
    raise AllKeysFailedError(
        "All configured API keys failed."
    )