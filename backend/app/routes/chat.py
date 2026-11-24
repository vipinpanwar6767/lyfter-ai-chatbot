from fastapi import APIRouter, HTTPException, Query

from app.schemas import (
    ChatRequest,
    ChatResponse,
    HistoryResponse
)

from app.database import (
    get_messages,
    get_system_prompt,
    save_conversation,
    clear_session
)

from app.services.llm_service import (
    generate_with_failover,
    AllKeysFailedError
)


# Create a router
router = APIRouter(tags=["Chat"])


# Generate an AI response
@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    simulate_failure: bool = Query(False)
):

    # Retrieve previous conversation history
    history = get_messages(request.session_id)

    # Determine the system prompt
    system_prompt = (
        request.system_prompt
        if request.system_prompt is not None
        else get_system_prompt(request.session_id)
    )

    # Prepare messages for the LLM
    messages = [
        {
            "role": "system",
            "content": system_prompt
        }
    ]

    # Add previous conversation messages
    for message in history:
        messages.append({
            "role": message["role"],
            "content": message["content"]
        })

    # Add the current user message
    messages.append({
        "role": "user",
        "content": request.message
    })

    try:

        # Generate response with automatic failover
        answer, metadata = generate_with_failover(
            messages=messages,
            simulate_failure=simulate_failure
        )

    except AllKeysFailedError:

        raise HTTPException(
            status_code=503,
            detail="AI service is temporarily unavailable. Please try again."
        )

    # Save the successful conversation
    save_conversation(
        session_id=request.session_id,
        user_message=request.message,
        assistant_message=answer,
        metadata=metadata,
        system_prompt=system_prompt
    )

    # Return the response
    return ChatResponse(
        session_id=request.session_id,
        response=answer,
        metadata=metadata
    )


# Retrieve conversation history
@router.get(
    "/history/{session_id}",
    response_model=HistoryResponse
)
def history(session_id: str):

    messages = get_messages(session_id)

    return HistoryResponse(
        session_id=session_id,
        messages=messages
    )


# Clear conversation history
@router.delete("/history/{session_id}")
def delete_history(session_id: str):

    clear_session(session_id)

    return {
        "session_id": session_id,
        "message": "Conversation history cleared successfully."
    }