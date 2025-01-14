import React, { useState } from "react";
import {
  Brain,
  Search,
  Zap,
  Users,
  BookOpen,
  Globe,
  Award,
  ArrowDown,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import ChatInput from "./components/ChatInput";
import Suggestions from "./components/Suggestions";
import ChatResponse from "./components/ChatResponse";
import LoadingResponse from "./components/LoadingResponse";

// 1) Import your new sendChatMessage function:
import { sendChatMessage } from "./components/chatService";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // 2) Keep an array of chat items
  const [chatHistory, setChatHistory] = useState<
    Array<{ query: string; response: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // 3) Remove simulateResponse, and call the real LLM:
  const handleSubmitQuery = async (query: string) => {
    setIsLoading(true);
    try {
      // Call your Flask endpoint
      const response = await sendChatMessage(query);

      // Append new message to chat history
      setChatHistory((prevHistory) => [...prevHistory, { query, response }]);
    } catch (error) {
      console.error("Error requesting LLM:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // "Back" button in ChatResponse to clear the conversation
  const handleBack = () => {
    setChatHistory([]);
  };

  const renderContent = () => {
    // If we have at least one conversation item, show ChatResponse
    if (chatHistory.length > 0) {
      return (
        <ChatResponse
          chatHistory={chatHistory}
          onSubmit={handleSubmitQuery}
          onBack={handleBack}
          isLoading={isLoading}
          // Don’t forget to pass setChatHistory if ChatResponse also needs it
          setChatHistory={setChatHistory}
          setIsLoading={setIsLoading}
        />
      );
    }

    // Otherwise, show your landing/hero page
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

          {/* Chat Input */}
          <div
            className="w-full max-w-2xl mb-12 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <ChatInput onSubmit={handleSubmitQuery} />
            {isLoading && <LoadingResponse />}
          </div>

          {/* Suggestions */}
          <div
            className="w-full max-w-4xl px-4 mb-16 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Suggestions onSubmit={handleSubmitQuery} />
          </div>

          <ArrowDown
            size={24}
            className="text-violet-600 animate-bounce absolute bottom-8"
          />
        </div>

        {/* Features Section */}
        <section className="w-full bg-gradient-to-b from-white to-violet-50 py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 heading-gradient">
              Powerful Features for Modern Research
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <Search className="w-12 h-12 text-violet-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Smart Search</h3>
                <p className="text-gray-600">
                  AI-powered search that understands context and finds relevant
                  papers instantly.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <Zap className="w-12 h-12 text-violet-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Real-time Updates
                </h3>
                <p className="text-gray-600">
                  Stay current with instant notifications about new papers in
                  your field.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <Users className="w-12 h-12 text-violet-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
                <p className="text-gray-600">
                  Work seamlessly with your team, share insights, and manage
                  projects together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full bg-gradient-purple text-white py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">1M+</div>
                <div className="text-violet-200">Research Papers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-violet-200">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100+</div>
                <div className="text-violet-200">Universities</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-violet-200">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full bg-white py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 heading-gradient">
              Why Choose ScholarSync?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center">
                <BookOpen className="w-12 h-12 text-violet-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Comprehensive Library
                </h3>
                <p className="text-gray-600">
                  Access millions of research papers across all academic
                  disciplines.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Globe className="w-12 h-12 text-violet-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Global Network</h3>
                <p className="text-gray-600">
                  Connect with researchers worldwide and expand your academic
                  network.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Award className="w-12 h-12 text-violet-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Research Excellence
                </h3>
                <p className="text-gray-600">
                  Enhance your research quality with AI-powered insights and
                  recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-12 bg-gray-50 border-t">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-violet-600">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-violet-600">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-violet-600">
                      API
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-violet-600">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-violet-600">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-violet-600">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-violet-600">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-violet-600">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-violet-600">
                      Community
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-violet-600">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-violet-600">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-violet-600">
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t text-center text-gray-600">
              © {new Date().getFullYear()} ScholarSync. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      {renderContent()}
    </div>
  );
}
