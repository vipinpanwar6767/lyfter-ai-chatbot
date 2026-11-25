const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

// Common function for making API requests
async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  // Handle unsuccessful HTTP responses
  if (!response.ok) {
    const errorMessage =
      typeof data?.detail === "string"
        ? data.detail
        : `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  return data;
}

// Send a message to the AI backend
export async function sendMessage({
  sessionId,
  message,
  systemPrompt = null,
  simulateFailure = false,
}) {
  return apiRequest(`/chat?simulate_failure=${simulateFailure}`, {
    method: "POST",
    body: JSON.stringify({
      session_id: sessionId,
      message: message,
      system_prompt: systemPrompt,
    }),
  });
}

// Retrieve conversation history
export async function getHistory(sessionId) {
  return apiRequest(`/history/${encodeURIComponent(sessionId)}`, {
    method: "GET",
  });
}

// Clear conversation history
export async function clearHistory(sessionId) {
  return apiRequest(`/history/${encodeURIComponent(sessionId)}`, {
    method: "DELETE",
  });
}

// Check backend availability
export async function checkHealth() {
  return apiRequest("/health", {
    method: "GET",
  });
}
