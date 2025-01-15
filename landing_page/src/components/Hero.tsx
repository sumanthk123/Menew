import React from 'react';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="pt-32 pb-24 px-4 bg-lavender relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-lavender/50 to-lavender"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#232C33_0%,_transparent_50%)] opacity-[0.03] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,_#B5B2C2_0%,_transparent_50%)] opacity-[0.03] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#232C33_0%,_transparent_40%)] opacity-[0.03] animate-pulse-slow"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-gunmetal/5 to-transparent animate-slide-right"></div>
          <div className="absolute top-40 left-0 w-full h-px bg-gradient-to-r from-transparent via-gunmetal/5 to-transparent animate-slide-left"></div>
          <div className="absolute top-60 left-0 w-full h-px bg-gradient-to-r from-transparent via-gunmetal/5 to-transparent animate-slide-right"></div>
        </div>
      </div>

      <div className="container mx-auto text-center max-w-4xl relative animate-fade-in">
        <h1 className="text-8xl font-bold text-gunmetal mb-6 tracking-tight">
          Scholar<span className="gradient-text">Sync</span>
        </h1>
        <p className="text-2xl text-gunmetal/80 mb-6 tracking-wide font-light max-w-3xl mx-auto leading-relaxed">
          Transform your research workflow with AI-powered insights and seamless collaboration. 
          Experience intelligent paper analysis that saves you hours of manual work.
        </p>
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
          <div className="flex items-center space-x-2 text-gunmetal/70">
            <CheckCircle className="h-5 w-5 text-gunmetal" />
            <span>AI Analysis</span>
          </div>
          <div className="flex items-center space-x-2 text-gunmetal/70">
            <CheckCircle className="h-5 w-5 text-gunmetal" />
            <span>Collaboration</span>
          </div>
          <div className="flex items-center space-x-2 text-gunmetal/70">
            <CheckCircle className="h-5 w-5 text-gunmetal" />
            <span>Smart Citations</span>
          </div>
        </div>
        <div className="flex justify-center space-x-6">
          <button className="px-10 py-4 bg-gunmetal text-lavender rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center text-lg font-medium group">
            Book a Demo
            <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-10 py-4 bg-french-grey/20 text-gunmetal rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center text-lg font-medium border border-french-grey/30 group">
            Watch Demo
            <Play className="h-5 w-5 ml-3 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};