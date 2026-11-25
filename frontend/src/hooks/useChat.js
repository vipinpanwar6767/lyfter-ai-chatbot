import { useState, useRef } from "react";

import {
  sendMessage as sendChatRequest,
  getHistory,
  clearHistory,
} from "../services/chatService";

export default function useChat() {
  // Conversation state
  const [messages, setMessages] = useState([]);

  // Latest AI response metadata
  const [metadata, setMetadata] = useState(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Error state
  const [error, setError] = useState(null);

  // Prevent overlapping operations
  const isBusy = useRef(false);

  // Send a message to the backend
  async function sendMessage({
    sessionId,
    message,
    systemPrompt = null,
    simulateFailure = false,
  }) {
    const trimmedMessage = message.trim();

    // Prevent empty messages and duplicate requests
    if (!trimmedMessage || !sessionId || isBusy.current) {
      return false;
    }

    isBusy.current = true;

    setIsLoading(true);
    setError(null);

    // Create the user message
    const userMessage = {
      role: "user",
      content: trimmedMessage,
      created_at: new Date().toISOString(),
    };

    // Immediately display the user message
    setMessages((previous) => [...previous, userMessage]);

    try {
      // Send request to FastAPI
      const data = await sendChatRequest({
        sessionId,
        message: trimmedMessage,
        systemPrompt,
        simulateFailure,
      });

      // Create the assistant message
      const assistantMessage = {
        role: "assistant",
        content: data.response,
        metadata: data.metadata,
        created_at: new Date().toISOString(),
      };

      // Add assistant response to the conversation
      setMessages((previous) => [...previous, assistantMessage]);

      // Update AI Insights
      setMetadata(data.metadata);

      return true;
    } catch (err) {
      // Remove the unsuccessful user message
      setMessages((previous) =>
        previous.filter((item) => item !== userMessage),
      );

      // Store the error message
      setError(err.message || "Failed to generate a response.");

      return false;
    } finally {
      // Stop loading regardless of success or failure
      isBusy.current = false;
      setIsLoading(false);
    }
  }

  // Retrieve conversation history
  async function loadHistory(sessionId) {
    if (!sessionId || isBusy.current) {
      return false;
    }

    isBusy.current = true;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getHistory(sessionId);

      const history = data.messages || [];

      setMessages(history);

      // Find the latest assistant message
      const lastAssistantMessage = [...history]
        .reverse()
        .find((message) => message.role === "assistant");

      // Restore the latest response metadata
      setMetadata(lastAssistantMessage?.metadata || null);

      return true;
    } catch (err) {
      setError(err.message || "Failed to load conversation.");

      return false;
    } finally {
      isBusy.current = false;
      setIsLoading(false);
    }
  }

  // Delete conversation history
  async function deleteConversation(sessionId) {
    if (!sessionId || isBusy.current) {
      return false;
    }

    isBusy.current = true;

    setIsLoading(true);
    setError(null);

    try {
      await clearHistory(sessionId);

      setMessages([]);
      setMetadata(null);

      return true;
    } catch (err) {
      setError(err.message || "Failed to clear conversation.");

      return false;
    } finally {
      isBusy.current = false;
      setIsLoading(false);
    }
  }

  // Reset local conversation state
  function resetChat() {
    if (isBusy.current) {
      return false;
    }

    setMessages([]);
    setMetadata(null);
    setError(null);

    return true;
  }

  // Clear the current error
  function clearError() {
    setError(null);
  }

  // Expose state and functions to React components
  return {
    messages,
    metadata,
    isLoading,
    error,
    sendMessage,
    loadHistory,
    deleteConversation,
    resetChat,
    clearError,
  };
}
