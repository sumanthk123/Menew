import React from 'react';
import { Play, TrendingUp, Clock, Users } from 'lucide-react';

export const WhySection = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-lavender to-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,_#232C33_0%,_transparent_50%)] opacity-[0.02]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,_#B5B2C2_0%,_transparent_50%)] opacity-[0.02]"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gunmetal/5 to-transparent"></div>
          <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gunmetal/5 to-transparent"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gunmetal/5 to-transparent"></div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl relative">
        <div className="flex items-center gap-12">
          <div className="w-1/2 space-y-6">
            <h2 className="text-4xl font-bold text-gunmetal tracking-tight">
              Why Researchers Need <span className="gradient-text">ScholarSync</span>
            </h2>
            <p className="text-lg text-gunmetal/70 leading-relaxed">
              Modern research demands modern tools. ScholarSync brings cutting-edge AI technology
              to streamline your research workflow and enhance collaboration.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gunmetal/5 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-gunmetal" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gunmetal mb-1">Increased Productivity</h3>
                  <p className="text-gunmetal/70">Streamline your literature review process</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gunmetal/5 rounded-lg">
                  <Clock className="h-5 w-5 text-gunmetal" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gunmetal mb-1">Real-time Updates</h3>
                  <p className="text-gunmetal/70">Stay current with latest research</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gunmetal/5 rounded-lg">
                  <Users className="h-5 w-5 text-gunmetal" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gunmetal mb-1">Enhanced Collaboration</h3>
                  <p className="text-gunmetal/70">Work seamlessly with your team</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-gunmetal/5 to-french-grey/20 rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#232C33_0%,_transparent_70%)] opacity-[0.05]"></div>
              <div className="flex items-center justify-center group cursor-pointer">
                <div className="bg-gunmetal p-6 rounded-full shadow-2xl group-hover:scale-110 transition-all duration-500">
                  <Play className="h-8 w-8 text-lavender" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};