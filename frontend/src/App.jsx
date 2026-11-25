import { useEffect, useRef, useState } from "react";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import ChatWindow from "./components/chat/ChatWindow";
import MetadataPanel from "./components/layout/MetadataPanel";

import useChat from "./hooks/useChat";
import { checkHealth, clearHistory } from "./services/chatService";

const STORAGE_KEY = "lyfter_sessions";
const ACTIVE_SESSION_KEY = "lyfter_active_session";

const DEFAULT_SYSTEM_PROMPT = "You are a helpful AI assistant.";

// Create a new conversation session
function createSession() {
  return {
    id: crypto.randomUUID(),
    title: "New Conversation",
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
  };
}

// Retrieve saved sessions from localStorage
function getSavedSessions() {
  try {
    const savedSessions = localStorage.getItem(STORAGE_KEY);

    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);

      if (Array.isArray(parsedSessions) && parsedSessions.length > 0) {
        return parsedSessions;
      }
    }
  } catch (error) {
    console.error("Failed to restore sessions:", error);
  }

  return [createSession()];
}

function App() {
  // Control AI Insights panel visibility
  const [showMetadata, setShowMetadata] = useState(true);

  // Backend health status
  const [backendOnline, setBackendOnline] = useState(null);

  // Initialize persistent conversation sessions
  const [sessions, setSessions] = useState(getSavedSessions);

  // Restore the active conversation
  const [activeSessionId, setActiveSessionId] = useState(() => {
    const savedId = localStorage.getItem(ACTIVE_SESSION_KEY);

    const existingSession = sessions.find((session) => session.id === savedId);

    return existingSession?.id || sessions[0].id;
  });

  // Failure simulation configuration
  const [simulateFailure, setSimulateFailure] = useState(false);

  // Conversation deletion states
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionError, setDeletionError] = useState(null);

  // Prevent overlapping session operations
  const operationLock = useRef(false);

  // Custom hook for conversation management
  const {
    messages,
    metadata,
    isLoading,
    error,
    sendMessage,
    loadHistory,
    deleteConversation,
    resetChat,
    clearError,
  } = useChat();

  // Combined loading state
  const isBusy = isLoading || isDeleting;

  // Find the currently active session
  const activeSession = sessions.find(
    (session) => session.id === activeSessionId,
  );

  // Retrieve the active session's system prompt
  const systemPrompt = activeSession?.systemPrompt ?? DEFAULT_SYSTEM_PROMPT;

  // Persist conversation sessions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // Persist the active session ID
  useEffect(() => {
    localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId);
  }, [activeSessionId]);

  // Check backend availability
  useEffect(() => {
    let cancelled = false;

    async function verifyBackend() {
      try {
        const data = await checkHealth();

        if (!cancelled) {
          setBackendOnline(data.status === "ok");
        }
      } catch {
        if (!cancelled) {
          setBackendOnline(false);
        }
      }
    }

    verifyBackend();

    const interval = setInterval(verifyBackend, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Restore conversation history when the app starts
  const initialHistoryLoaded = useRef(false);

  useEffect(() => {
    if (initialHistoryLoaded.current) {
      return;
    }

    initialHistoryLoaded.current = true;

    loadHistory(activeSessionId);
  }, [activeSessionId, loadHistory]);

  // Toggle AI Insights panel
  function toggleMetadata() {
    setShowMetadata((previous) => !previous);
  }

  // Create a new conversation
  function handleNewChat() {
    if (isBusy || operationLock.current) {
      return;
    }

    if (!resetChat()) {
      return;
    }

    const newSession = createSession();

    setSessions((previous) => [newSession, ...previous]);

    setActiveSessionId(newSession.id);

    setDeletionError(null);
    clearError();
  }

  // Select an existing conversation
  async function handleSelectSession(sessionId) {
    if (isBusy || operationLock.current || sessionId === activeSessionId) {
      return;
    }

    operationLock.current = true;

    setDeletionError(null);

    try {
      const success = await loadHistory(sessionId);

      if (success) {
        setActiveSessionId(sessionId);
      }
    } finally {
      operationLock.current = false;
    }
  }

  // Delete an existing conversation
  async function handleDeleteSession(sessionId) {
    if (isBusy || operationLock.current) {
      return;
    }

    // Find the conversation to delete
    const sessionToDelete = sessions.find(
      (session) => session.id === sessionId,
    );

    if (!sessionToDelete) {
      return;
    }

    // Ask for confirmation
    const confirmed = window.confirm(
      `Delete "${sessionToDelete.title}"?\n\n` +
        "This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    operationLock.current = true;

    setIsDeleting(true);
    setDeletionError(null);
    clearError();

    try {
      const isActiveSession = sessionId === activeSessionId;

      // Delete the active conversation
      if (isActiveSession) {
        const success = await deleteConversation(sessionId);

        if (!success) {
          return;
        }
      } else {
        // Delete an inactive conversation without
        // clearing the currently displayed messages
        await clearHistory(sessionId);
      }

      // Remove the deleted session
      const remainingSessions = sessions.filter(
        (session) => session.id !== sessionId,
      );

      // If no conversations remain, create a new one
      if (remainingSessions.length === 0) {
        const newSession = createSession();

        setSessions([newSession]);
        setActiveSessionId(newSession.id);

        resetChat();

        return;
      }

      // Update the conversation list
      setSessions(remainingSessions);

      // If an inactive session was deleted,
      // keep the current conversation unchanged
      if (!isActiveSession) {
        return;
      }

      // Select another available conversation
      const nextSession = remainingSessions[0];

      const historyLoaded = await loadHistory(nextSession.id);

      if (historyLoaded) {
        setActiveSessionId(nextSession.id);
      } else {
        // Create a fresh session if history
        // restoration fails
        const newSession = createSession();

        resetChat();

        setSessions([newSession, ...remainingSessions]);

        setActiveSessionId(newSession.id);

        setDeletionError(
          "Conversation deleted, but the next conversation could not be loaded.",
        );
      }
    } catch (err) {
      setDeletionError(err.message || "Failed to delete conversation.");
    } finally {
      setIsDeleting(false);
      operationLock.current = false;
    }
  }

  // Update the active session's system prompt
  function handleSystemPromptChange(newPrompt) {
    setSessions((previous) =>
      previous.map((session) =>
        session.id === activeSessionId
          ? {
              ...session,
              systemPrompt: newPrompt,
            }
          : session,
      ),
    );
  }

  // Send a real message to the backend
  async function handleSend(message) {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isBusy || operationLock.current) {
      return;
    }

    operationLock.current = true;

    setDeletionError(null);

    const currentSessionId = activeSessionId;

    try {
      const success = await sendMessage({
        sessionId: currentSessionId,
        message: trimmedMessage,
        systemPrompt,
        simulateFailure,
      });

      if (!success) {
        return;
      }

      // Generate a title from the first successful message
      setSessions((previous) =>
        previous.map((session) =>
          session.id === currentSessionId &&
          session.title === "New Conversation"
            ? {
                ...session,
                title: trimmedMessage.slice(0, 35),
              }
            : session,
        ),
      );
    } finally {
      operationLock.current = false;
    }
  }

  return (
    <div className="aurora-background flex h-dvh flex-col">
      {/* Application Header */}
      <Header
        backendOnline={backendOnline}
        model={metadata?.model || "gemini-3.5-flash-lite"}
        showMetadata={showMetadata}
        onToggleMetadata={toggleMetadata}
      />

      {/* Main Dashboard */}
      <main className="flex min-h-0 flex-1 gap-3 overflow-hidden p-3">
        {/* Conversation Sidebar */}
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
          systemPrompt={systemPrompt}
          onSystemPromptChange={handleSystemPromptChange}
          simulateFailure={simulateFailure}
          onToggleFailure={setSimulateFailure}
          isLoading={isBusy}
        />

        {/* Main Chat Window */}
        <ChatWindow
          messages={messages}
          isLoading={isBusy}
          error={deletionError || error}
          onSend={handleSend}
        />

        {/* AI Insights Panel */}
        {showMetadata && <MetadataPanel metadata={metadata} />}
      </main>
    </div>
  );
}

export default App;
