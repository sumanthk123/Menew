import React from "react";
import {
  Brain,
  Sparkles,
  Share2,
  Search,
  Clock,
  TrendingUp,
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "Smart Analysis",
    desc: "AI-powered research insights",
  },
  {
    icon: Sparkles,
    title: "Auto Citations",
    desc: "Instant citation formatting",
  },
  { icon: Share2, title: "Real-time Sync", desc: "Seamless collaboration" },
  { icon: Search, title: "Deep Search", desc: "Advanced paper discovery" },
  { icon: Clock, title: "Time Saving", desc: "75% faster research process" },
  { icon: TrendingUp, title: "Analytics", desc: "Research impact tracking" },
];

export const Features = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-lavender relative overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold mb-4 tracking-tight text-gunmetal">
            Cutting-Edge <span className="gradient-text">Features</span>
          </h2>
          <p className="text-xl text-gunmetal/70 max-w-2xl mx-auto font-light">
            Experience the future of academic research with our advanced
            technology
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex space-x-6 animate-scroll">
            {[...FEATURES, ...FEATURES].map((item, i) => (
              <div key={i} className="flex-none w-80">
                <div className="bg-white/50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-gunmetal/5 hover:scale-105">
                  <item.icon className="h-8 w-8 text-gunmetal mb-4 animate-bounce-slow" />
                  <h3 className="text-xl font-semibold text-gunmetal mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gunmetal/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
