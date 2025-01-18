import React, { useEffect, useState } from "react";
import { Brain, Trash2, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import ChatInput from "../components/ChatInput";
import Suggestions from "../components/Suggestions";
import ChatResponse from "../components/ChatResponse";
import LoadingResponse from "../components/LoadingResponse";
import KeywordMatches from "../components/KeywordMatches";

import {
  sendChatMessage,
  listConversations,
  deleteConversation,
  getConversation,
  ConversationMeta,
  fetchKeywordMatches,
} from "../components/chatService";

export default function App() {
  // Assuming you retrieve the authenticated user as before.
  const [userId, setUserId] = useState<string | null>(null);
  const [keywordMatches, setKeywordMatches] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchMatches() {
      if (userId) {
        try {
          const matches = await fetchKeywordMatches(userId);
          setKeywordMatches(matches);
        } catch (error) {
          console.error('Failed to fetch keyword matches:', error);
        }
      }
    }
    fetchMatches();
  }, [userId]);

  const [chatHistory, setChatHistory] = useState<
    Array<{ query: string; response: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | undefined>();

  // Store conversation metadata objects {id, title}
  const [oldConversations, setOldConversations] = useState<ConversationMeta[]>(
    []
  );
  const [showHistory, setShowHistory] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserId(null);
  };

  const handleSubmitQuery = async (query: string) => {
    if (!userId) {
      alert("You must be signed in to send messages.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await sendChatMessage(query, conversationId, userId);
      if (!conversationId) {
        setConversationId(data.conversation_id);
      }
      setChatHistory((prev) => [...prev, { query, response: data.response }]);
    } catch (err) {
      console.error("Failed to request LLM:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setChatHistory([]);
    setConversationId(undefined);
  };

  const toggleHistory = async () => {
    if (!userId) {
      alert("You must be signed in to view conversations.");
      return;
    }
    if (!showHistory) {
      try {
        const convos = await listConversations(userId);
        setOldConversations(convos);
      } catch (error) {
        console.error("Failed to list conversations:", error);
      }
    }
    setShowHistory(!showHistory);
  };

  const handleDeleteConversation = async (id: number) => {
    if (!userId) return;
    if (window.confirm(`Are you sure you want to delete conversation ${id}?`)) {
      try {
        await deleteConversation(id, userId);
        setOldConversations((prev) => prev.filter((convo) => convo.id !== id));
      } catch (err) {
        console.error("Failed to delete conversation", err);
      }
    }
  };

  const handleLoadConversation = async (id: number) => {
    if (!userId) return;
    try {
      const { content } = await getConversation(id, userId);
      const lines = content.split(/\r?\n/).filter(Boolean);
      const parsed: Array<{ query: string; response: string }> = [];
      let userQ = "";
      let asstA = "";

      lines.forEach((line) => {
        if (line.startsWith("User:")) {
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

  const renderContent = () => {
    if (chatHistory.length > 0) {
      return (
        <ChatResponse
          chatHistory={chatHistory}
          onBack={handleBack}
          isLoading={isLoading}
          setChatHistory={setChatHistory}
          setIsLoading={setIsLoading}
          conversationId={conversationId}
          userId={userId}
        />
      );
    }
    return (
      <main className="flex flex-col items-center">
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

          <KeywordMatches papers={keywordMatches} />
        </div>
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-white">
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
        {showHistory && (
          <div
            onClick={toggleHistory}
            className="fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-500 ease-in-out"
          />
        )}

        <div
          className={`relative top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-lg transform transition-transform transition-opacity duration-500 ease-in-out ${
            showHistory
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          }`}
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
            {oldConversations.length === 0 && (
              <p className="text-sm text-gray-500">No conversations found.</p>
            )}
            {oldConversations.map(({ id, title }) => (
              <div
                key={id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100"
              >
                <button
                  className="flex-1 text-left text-sm text-violet-600 font-medium truncate"
                  onClick={() => handleLoadConversation(id)}
                >
                  {title}
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
