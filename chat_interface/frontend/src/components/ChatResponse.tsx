import React from 'react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import ChatInput from './ChatInput';
import LoadingResponse from './LoadingResponse';

interface ChatResponseProps {
  chatHistory: Array<{ query: string; response: string }>;
  onSubmit: (query: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const ChatResponse: React.FC<ChatResponseProps> = ({ chatHistory, onSubmit, onBack, isLoading }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={onBack}
            className="p-2 hover:bg-violet-100 rounded-full transition-colors mr-4 group"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-violet-600 group-hover:scale-110 transition-transform" />
          </button>
          <h1 className="font-display font-semibold text-violet-900">Research Query</h1>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Chat History */}
          {chatHistory.map(({ query, response }, index) => (
            <div key={index} className="mb-8 animate-slide-in">
              {/* Query */}
              <div className="mb-4">
                <div className="text-sm text-violet-600 mb-2 font-medium font-display">Your question</div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-violet-100 transform hover:scale-[1.01] transition-transform">
                  {query}
                </div>
              </div>

              {/* Response */}
              <div className="mb-8">
                <div className="text-sm text-violet-600 mb-2 flex items-center font-medium font-display">
                  <MessageSquare size={16} className="mr-2" />
                  Response
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-violet-100 prose max-w-none transform hover:scale-[1.01] transition-transform">
                  {response.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Loading State */}
          {isLoading && (
            <div className="mb-8 animate-fade-in">
              <LoadingResponse />
            </div>
          )}

          {/* Follow-up question */}
          <div className="animate-fade-in">
            <div className="text-sm text-violet-600 mb-2 font-medium font-display">Ask a follow-up question</div>
            <ChatInput onSubmit={onSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatResponse;