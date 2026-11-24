from app.services.llm_service import generate_with_failover

messages = [
    {
        "role": "system",
        "content": "You are a helpful AI assistant."
    },
    {
        "role": "user",
        "content": "Explain Java in one sentence."
    }
]

# Test 1: Normal execution
print("\n========== NORMAL TEST ==========")

answer, metadata = generate_with_failover(
    messages=messages
)

print("Response:", answer)
print("Metadata:", metadata)


# Test 2: Simulated primary key failure
print("\n========== FAILOVER TEST ==========")

answer, metadata = generate_with_failover(
    messages=messages,
    simulate_failure=True
)

print("Response:", answer)
print("Metadata:", metadata)