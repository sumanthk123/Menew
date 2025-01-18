import React, { useEffect, useRef } from "react";
import { ArrowLeft, MessageSquare } from "lucide-react";
import ChatInput from "./ChatInput";
import LoadingResponse from "./LoadingResponse";
import { sendChatMessage } from "./chatService";

interface ChatItem {
  query: string;
  response: string;
}

interface ChatResponseProps {
  chatHistory: ChatItem[];
  onBack: () => void;
  isLoading: boolean;
  setChatHistory: React.Dispatch<React.SetStateAction<ChatItem[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  conversationId?: number; // Updated type: number instead of string
  userId: string | null;
}

const ChatResponse: React.FC<ChatResponseProps> = ({
  chatHistory,
  onBack,
  isLoading,
  setChatHistory,
  setIsLoading,
  conversationId,
  userId,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleFollowup = async (query: string) => {
    if (!userId) {
      console.error("No userId provided; cannot send follow-up.");
      return;
    }

    setIsLoading(true);
    try {
      // Use numeric conversationId with sendChatMessage
      const data = await sendChatMessage(query, conversationId, userId);
      setChatHistory((prev) => [...prev, { query, response: data.response }]);
    } catch (error) {
      console.error("Failed to get response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={onBack}
            className="p-2 hover:bg-violet-100 rounded-full transition-colors mr-4 group"
            aria-label="Go back"
          >
            <ArrowLeft
              size={20}
              className="text-violet-600 group-hover:scale-110 transition-transform"
            />
          </button>
          <h1 className="font-display font-semibold text-violet-900">
            Research Query
          </h1>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {chatHistory.map(({ query, response }, index) => (
            <div key={index} className="mb-8 animate-slide-in">
              <div className="mb-4">
                <div className="text-sm text-violet-600 mb-2 font-medium font-display">
                  Your question
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-violet-100">
                  {query}
                </div>
              </div>

              <div className="mb-8">
                <div className="text-sm text-violet-600 mb-2 flex items-center font-medium font-display">
                  <MessageSquare size={16} className="mr-2" />
                  Response
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-violet-100 prose max-w-none whitespace-pre-wrap">
                  {response}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="mb-8">
              <LoadingResponse />
            </div>
          )}

          <div>
            <div className="text-sm text-violet-600 mb-2 font-medium font-display">
              Ask a follow-up question
            </div>
            <ChatInput onSubmit={handleFollowup} />
          </div>

          <div ref={bottomRef}></div>
        </div>
      </div>
    </div>
  );
};

export default ChatResponse;
