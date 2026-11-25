const SESSIONS_KEY = "lyfter_ai_sessions";
const ACTIVE_SESSION_KEY = "lyfter_ai_active_session";

// Create a new conversation session
export function createSession() {
  return {
    id: crypto.randomUUID(),
    title: "New Conversation",
    createdAt: new Date().toISOString(),
  };
}

// Retrieve saved sessions
export function getStoredSessions() {
  try {
    const storedSessions = localStorage.getItem(SESSIONS_KEY);

    if (!storedSessions) {
      return [];
    }

    const sessions = JSON.parse(storedSessions);

    return Array.isArray(sessions) ? sessions : [];
  } catch (error) {
    console.error("Failed to load sessions:", error);

    return [];
  }
}

// Save conversation sessions
export function saveSessions(sessions) {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to save sessions:", error);
  }
}

// Retrieve the last active session ID
export function getActiveSessionId() {
  return localStorage.getItem(ACTIVE_SESSION_KEY);
}

// Save the currently active session ID
export function saveActiveSessionId(sessionId) {
  if (!sessionId) {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    return;
  }

  localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
}

// Generate a conversation title from the first message
export function generateSessionTitle(message) {
  const cleanMessage = message.trim().replace(/\s+/g, " ");

  const maxLength = 35;

  if (!cleanMessage) {
    return "New Conversation";
  }

  if (cleanMessage.length <= maxLength) {
    return cleanMessage;
  }

  return cleanMessage.slice(0, maxLength).trimEnd() + "...";
}
