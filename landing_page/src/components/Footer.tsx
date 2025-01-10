import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gunmetal relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-french-grey/5 to-lavender/5" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,_#232C33_1px,_transparent_1px)] bg-[length:30px_30px] opacity-[0.1]" />
      
      <div className="container mx-auto px-4 py-24 relative">
        <div className="text-center">
          <h2 className="text-6xl font-bold text-lavender mb-6 tracking-tight">
            Start Researching <span className="gradient-text">Smartly</span>
          </h2>
          <p className="text-xl text-french-grey mb-12 font-light max-w-2xl mx-auto">
            Join thousands of researchers who are already using ScholarSync to revolutionize 
            their academic workflow
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
            <div className="p-6 bg-white/5 rounded-xl">
              <div className="text-4xl font-bold text-lavender mb-2">50K+</div>
              <div className="text-french-grey/70">Active Users</div>
            </div>
            <div className="p-6 bg-white/5 rounded-xl">
              <div className="text-4xl font-bold text-lavender mb-2">1M+</div>
              <div className="text-french-grey/70">Papers Analyzed</div>
            </div>
            <div className="p-6 bg-white/5 rounded-xl">
              <div className="text-4xl font-bold text-lavender mb-2">98%</div>
              <div className="text-french-grey/70">Satisfaction Rate</div>
            </div>
          </div>

          <div className="flex justify-center mb-16">
            <button className="px-12 py-4 bg-lavender text-gunmetal rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg font-medium group">
              Schedule a Demo Today
              <ArrowRight className="h-5 w-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="pt-12 border-t border-french-grey/20">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="relative w-8 h-8">
                  <BookOpen className="h-8 w-8 text-lavender absolute" />
                </div>
                <span className="text-xl font-bold text-lavender">ScholarSync</span>
              </div>
              <p className="text-french-grey/60 font-light">
                &copy; {new Date().getFullYear()} ScholarSync. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};