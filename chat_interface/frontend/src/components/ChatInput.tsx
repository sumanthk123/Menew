// ChatInput.tsx
import React, { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSubmit: (query: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit }) => {
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isSubmitting) {
      setIsSubmitting(true);
      onSubmit(input.trim());
      setInput("");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your query..."
          className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all duration-200"
          aria-label="Chat input"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors duration-200 ${
            isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-violet-100"
          }`}
          aria-label="Send message"
          disabled={isSubmitting}
        >
          <Send size={20} className="text-violet-600" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
