import React from 'react';
import { Brain, DollarSign, Sparkles } from 'lucide-react';

const suggestions = [
  {
    text: 'How can I get started?',
    icon: Brain,
    description: 'Learn about our platform basics'
  },
  {
    text: 'What features are available?',
    icon: Sparkles,
    description: 'Discover our powerful capabilities'
  },
  {
    text: 'Tell me about pricing',
    icon: DollarSign,
    description: 'View our pricing plans'
  }
];

interface SuggestionsProps {
  onSubmit?: (query: string) => void;
}

const Suggestions: React.FC<SuggestionsProps> = ({ onSubmit }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon;
        return (
          <button
            key={index}
            onClick={() => onSubmit?.(suggestion.text)}
            className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-violet-100 
                     hover:shadow-lg hover:border-violet-200 hover:bg-violet-50 transition-all duration-300
                     transform hover:-translate-y-1"
          >
            <Icon size={24} className="text-violet-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-violet-900 mb-2 text-center">{suggestion.text}</h3>
            <p className="text-sm text-gray-500 text-center">{suggestion.description}</p>
          </button>
        );
      })}
    </div>
  );
};

export default Suggestions;