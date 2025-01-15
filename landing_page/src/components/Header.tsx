import React from "react";
import { BookOpen, Play } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed w-full bg-gradient-to-r from-lavender/80 to-white/80 backdrop-blur-md shadow-lg z-50">
      <div className="container mx-auto py-3 px-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <BookOpen className="h-8 w-8 text-gunmetal absolute" />
            </div>
            <span className="text-2xl font-bold gradient-text tracking-tight">
              ScholarSync
            </span>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <button className="px-6 py-2 bg-gunmetal text-lavender rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center font-medium text-sm">
              Book a Demo
            </button>
            <button className="px-6 py-2 bg-french-grey/20 text-gunmetal rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center font-medium text-sm">
              Watch Demo
              <Play className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
