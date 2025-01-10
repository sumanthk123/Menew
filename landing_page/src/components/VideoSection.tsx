import React from 'react';
import { Play } from 'lucide-react';

export const VideoSection = () => {
  return (
    <section className="py-12 px-4 bg-lavender relative overflow-hidden">
      {/* Enhanced background patterns */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#232C33_0%,_transparent_70%)] opacity-[0.05]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_50%,_#B5B2C2_0%,_transparent_70%)] opacity-[0.05]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_50%,_#232C33_0%,_transparent_70%)] opacity-[0.05]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_#232C33_1px,_transparent_1px)] bg-[length:20px_20px] opacity-[0.03]"></div>
      </div>

      <div className="container mx-auto max-w-4xl relative">
        <div className="gradient-border">
          <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-lavender to-french-grey/20 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-center group cursor-pointer">
              <div className="bg-gunmetal p-6 rounded-full shadow-2xl group-hover:scale-110 transition-all duration-500">
                <Play className="h-8 w-8 text-lavender" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};