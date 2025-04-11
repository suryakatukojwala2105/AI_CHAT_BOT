
import React from 'react';
import { MessageSquare, Video, FileText, Image } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
      <div className="bg-indigo-100 rounded-full p-4 mb-4">
        <MessageSquare className="h-10 w-10 text-indigo-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Gemini Chat!</h2>
      <p className="text-slate-600 mb-6 max-w-md">Ask me anything or request different types of content</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-xl">
        <ExampleCard 
          icon={<Image className="h-5 w-5 text-emerald-600" />}
          title="Show images"
          description="Try: 'Show me an image of a python'"
          color="bg-emerald-50 border-emerald-100"
          iconColor="bg-emerald-100"
        />
        <ExampleCard 
          icon={<FileText className="h-5 w-5 text-amber-600" />}
          title="Get PDFs"
          description="Try: 'Give me a python tutorial PDF'"
          color="bg-amber-50 border-amber-100"
          iconColor="bg-amber-100"
        />
        <ExampleCard 
          icon={<Video className="h-5 w-5 text-rose-600" />}
          title="Find videos"
          description="Try: 'Show me a video about python'"
          color="bg-rose-50 border-rose-100"
          iconColor="bg-rose-100"
        />
      </div>
    </div>
  );
};

interface ExampleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  iconColor: string;
}

const ExampleCard: React.FC<ExampleCardProps> = ({ icon, title, description, color, iconColor }) => (
  <div className={`p-4 rounded-lg border ${color} transition-transform hover:scale-105 cursor-pointer`}>
    <div className={`${iconColor} rounded-full p-2 w-fit mb-2`}>
      {icon}
    </div>
    <h3 className="font-medium text-slate-900 mb-1">{title}</h3>
    <p className="text-sm text-slate-600">{description}</p>
  </div>
);

export default EmptyState;
