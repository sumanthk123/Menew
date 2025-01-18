import React from 'react';

const LoadingResponse: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="flex space-x-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-3 w-3 bg-violet-600 rounded-full"
            style={{
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: `${i * 0.16}s`
            }}
          ></div>
        ))}
      </div>
      <p className="text-sm text-violet-600 mt-4 font-medium animate-pulse">
        Processing your query...
      </p>
    </div>
  );
};

export default LoadingResponse;