import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface FeatureProps {
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
  color: string;
  reverse?: boolean;
}

export const Feature = ({
  title,
  description,
  icon: Icon,
  image,
  imageAlt,
  color,
  reverse = false
}: FeatureProps) => {
  const TextContent = () => (
    <div className={`lg:w-4/5 ${reverse ? 'lg:pl-16' : 'lg:pr-16'}`}>
      <div className="tech-card p-12 rounded-2xl">
        <Icon className={`h-16 w-16 ${color} mb-8`} />
        <h3 className="text-4xl font-bold mb-6 tracking-tight text-gunmetal">{title}</h3>
        <p className="text-lg text-gunmetal/70 leading-relaxed mb-8">
          {description}
        </p>
        <button className={`flex items-center ${color} font-medium group text-lg`}>
          Learn More
          <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  const ImageContent = () => (
    <div className={`lg:w-4/5 mt-8 lg:mt-0 feature-image`}>
      <img 
        src={image} 
        alt={imageAlt}
        className="rounded-2xl shadow-2xl w-full h-full object-cover hover:scale-105 transition-all duration-500"
      />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full mx-auto">
      {reverse ? (
        <>
          <ImageContent />
          <TextContent />
        </>
      ) : (
        <>
          <TextContent />
          <ImageContent />
        </>
      )}
    </div>
  );
};