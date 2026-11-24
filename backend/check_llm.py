from app.config import settings
from app.services.llm_service import generate_response


messages = [
    {
        "role": "system",
        "content": "You are a programming tutor."
    },
    {
        "role": "user",
        "content": "Explain Python in one sentence."
    }
]


answer, metadata = generate_response(
    messages=messages,
    api_key=settings.llm_api_keys[0],
    key_id="key_1"
)


print("\nAI Response:")
print(answer)

print("\nMetadata:")

for key, value in metadata.items():
    print(f"{key}: {value}")