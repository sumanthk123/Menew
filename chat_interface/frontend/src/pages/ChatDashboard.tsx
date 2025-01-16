// App.tsx
import React, { useEffect, useState } from "react";
import { Brain, Trash2, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import ChatInput from "../components/ChatInput";
import Suggestions from "../components/Suggestions";
import ChatResponse from "../components/ChatResponse";
import LoadingResponse from "../components/LoadingResponse";

import {
  sendChatMessage,
  listConversations,
  deleteConversation,
  getConversation,
} from "../components/chatService";

// If you're using a custom AuthProvider / useAuth, you can do:
// import { useAuth } from "../contexts/AuthContext";
// and skip the local user state below.

export default function App() {
  // Optional: local state for user if you're not using a context
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get the current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
      }
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Chat UI state
  const [chatHistory, setChatHistory] = useState<
    Array<{ query: string; response: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // If we have a conversationId => user is in a chat. If undefined => user is on front page.
  const [conversationId, setConversationId] = useState<string | undefined>();

  // For listing old convos
  const [showHistory, setShowHistory] = useState(false);
  const [oldConversationIds, setOldConversationIds] = useState<string[]>([]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserId(null);
  };

  // ============ Chat Submission ============
  const handleSubmitQuery = async (query: string) => {
    if (!userId) {
      alert("You must be signed in to send messages.");
      return;
    }
    setIsLoading(true);
    try {
      // Pass userId to the chat service
      const data = await sendChatMessage(query, conversationId, userId);
      // data = { conversation_id, response }

      // If we had no conversationId, we just started a new one
      if (!conversationId) {
        setConversationId(data.conversation_id);
      }

      // Append to local chatHistory
      setChatHistory((prev) => [...prev, { query, response: data.response }]);
    } catch (err) {
      console.error("Failed to request LLM:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear conversation => back to landing page
  const handleBack = () => {
    setChatHistory([]);
    setConversationId(undefined);
  };

  // ============ Show/Hide History Panel ============
  const toggleHistory = async () => {
    if (!userId) {
      alert("You must be signed in to view conversations.");
      return;
    }
    // Only fetch the list when opening (not closing)
    if (!showHistory) {
      try {
        const ids = await listConversations(userId); // pass userId
        setOldConversationIds(ids);
      } catch (error) {
        console.error("Failed to list conversations:", error);
      }
    }
    setShowHistory(!showHistory);
  };

  // Delete a conversation
  const handleDeleteConversation = async (id: string) => {
    if (!userId) return;
    if (window.confirm(`Are you sure you want to delete '${id}'?`)) {
      try {
        await deleteConversation(id, userId);
        setOldConversationIds((prev) => prev.filter((x) => x !== id));
      } catch (err) {
        console.error("Failed to delete conversation", err);
      }
    }
  };

  // Load an existing conversation
  const handleLoadConversation = async (id: string) => {
    if (!userId) return;
    try {
      const { content } = await getConversation(id, userId);
      // parse "User: ...\nAssistant: ...\n\n"
      const lines = content.split(/\r?\n/).filter(Boolean);
      const parsed: Array<{ query: string; response: string }> = [];
      let userQ = "";
      let asstA = "";

      lines.forEach((line) => {
        if (line.startsWith("User:")) {
          // if we had a user+asst stored, push it
          if (userQ && asstA) {
            parsed.push({ query: userQ, response: asstA });
            userQ = "";
            asstA = "";
          }
          userQ = line.replace("User:", "").trim();
        } else if (line.startsWith("Assistant:")) {
          asstA = line.replace("Assistant:", "").trim();
        }
      });

      // push last turn
      if (userQ && asstA) {
        parsed.push({ query: userQ, response: asstA });
      }

      setChatHistory(parsed);
      setConversationId(id);
      setShowHistory(false);
    } catch (err) {
      console.error("Failed to load conversation", err);
    }
  };

  // ============ Render Logic ============
  const renderContent = () => {
    // If we have messages in chatHistory, show ChatResponse
    if (chatHistory.length > 0) {
      return (
        <ChatResponse
          chatHistory={chatHistory}
          onBack={handleBack}
          isLoading={isLoading}
          setChatHistory={setChatHistory}
          setIsLoading={setIsLoading}
          conversationId={conversationId}
          userId={userId} // <-- pass the user ID here
        />
      );
    }

    // Otherwise, show landing page
    return (
      <main className="flex flex-col items-center">
        {/* Hero Section */}
        <div className="min-h-screen flex flex-col items-center justify-center relative px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-violet-100 mb-6 animate-float">
              <Brain size={40} className="text-violet-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">
              ScholarSync
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Find the best science, faster with AI-powered research assistance
            </p>
          </div>

          {/* Chat input for the first question */}
          <div
            className="w-full max-w-2xl mb-12 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <ChatInput onSubmit={handleSubmitQuery} />
            {isLoading && <LoadingResponse />}
          </div>

          <div
            className="w-full max-w-4xl px-4 mb-16 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Suggestions onSubmit={handleSubmitQuery} />
          </div>
        </div>
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Conditionally show the "Show History" button only if the panel is NOT open */}
      {!showHistory && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={toggleHistory}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            Show History
          </button>
        </div>
      )}

      {/* Top-right sign out button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleSignOut}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          Sign out
        </button>
      </div>

      {/* Sliding side panel for conversation history */}
      <div
        className={`fixed inset-0 z-40 flex transition-all duration-500 ease-in-out ${
          showHistory ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        {showHistory && (
          <div
            onClick={toggleHistory}
            className="fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-500 ease-in-out"
          />
        )}

        {/* Panel (slides in/out with opacity change) */}
        <div
          className={`relative top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-lg
          transform transition-transform transition-opacity duration-500 ease-in-out 
          ${
            showHistory
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          }
        `}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-700">Conversations</h2>
            <button
              onClick={toggleHistory}
              className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>

          <div className="p-4 h-full overflow-y-auto space-y-2">
            {oldConversationIds.length === 0 && (
              <p className="text-sm text-gray-500">No conversations found.</p>
            )}
            {oldConversationIds.map((id) => (
              <div
                key={id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100"
              >
                <button
                  className="flex-1 text-left text-sm text-violet-600 font-medium truncate"
                  onClick={() => handleLoadConversation(id)}
                >
                  {id}
                </button>
                <button
                  className="ml-2 text-red-600 hover:text-red-800"
                  onClick={() => handleDeleteConversation(id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}
