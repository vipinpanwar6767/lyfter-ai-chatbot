from pydantic import BaseModel, Field


# Incoming chat request
class ChatRequest(BaseModel):

    session_id: str = Field(min_length=1)

    message: str = Field(min_length=1)

    system_prompt: str | None = None


# Metadata associated with an AI response
class ResponseMetadata(BaseModel):

    model: str

    key_id: str

    cached: bool

    input_tokens: int = Field(ge=0)

    output_tokens: int = Field(ge=0)

    latency_ms: float = Field(ge=0)


# Outgoing chat response
class ChatResponse(BaseModel):

    session_id: str

    response: str

    metadata: ResponseMetadata


# Individual message stored in history
class MessageResponse(BaseModel):

    role: str

    content: str

    metadata: ResponseMetadata | None = None

    created_at: str


# Conversation history response
class HistoryResponse(BaseModel):

    session_id: str

    messages: list[MessageResponse]