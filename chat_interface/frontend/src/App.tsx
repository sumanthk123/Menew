// App.tsx
import React, { useState } from "react";
import { Brain } from "lucide-react";

import Sidebar from "./components/Sidebar";
import ChatInput from "./components/ChatInput";
import Suggestions from "./components/Suggestions";
import ChatResponse from "./components/ChatResponse";
import LoadingResponse from "./components/LoadingResponse";

import {
  sendChatMessage,
  listConversations,
  deleteConversation,
  getConversation,
} from "./components/chatService";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    Array<{ query: string; response: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // If we have a conversationId => user is in a chat. If undefined => user is on front page.
  const [conversationId, setConversationId] = useState<string | undefined>();

  // For listing old convos
  const [showHistory, setShowHistory] = useState(false);
  const [oldConversationIds, setOldConversationIds] = useState<string[]>([]);

  // ============ Chat Submission ============
  const handleSubmitQuery = async (query: string) => {
    setIsLoading(true);
    try {
      const data = await sendChatMessage(query, conversationId);
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
    if (!showHistory) {
      try {
        const ids = await listConversations();
        setOldConversationIds(ids);
      } catch (error) {
        console.error("Failed to list conversations:", error);
      }
    }
    setShowHistory(!showHistory);
  };

  // Delete a conversation
  const handleDeleteConversation = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete '${id}'?`)) {
      try {
        await deleteConversation(id);
        setOldConversationIds((prev) => prev.filter((x) => x !== id));
      } catch (err) {
        console.error("Failed to delete conversation", err);
      }
    }
  };

  // Load an existing conversation
  const handleLoadConversation = async (id: string) => {
    try {
      const { content } = await getConversation(id);
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
    <div className="min-h-screen bg-white relative">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <button
        onClick={toggleHistory}
        className="absolute top-4 right-4 bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
      >
        {showHistory ? "Hide History" : "Show History"}
      </button>

      {showHistory && (
        <div className="absolute top-16 right-4 w-64 bg-white border border-gray-200 shadow-md p-4 z-50">
          <h2 className="text-lg font-bold mb-2">Conversations</h2>
          <ul className="space-y-2">
            {oldConversationIds.map((id) => (
              <li key={id} className="flex justify-between items-center">
                <button
                  className="text-violet-600 underline"
                  onClick={() => handleLoadConversation(id)}
                >
                  {id}
                </button>
                <button
                  className="text-red-600 ml-2"
                  onClick={() => handleDeleteConversation(id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {renderContent()}
    </div>
  );
}
