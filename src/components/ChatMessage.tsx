
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ImageIcon, FileText, Youtube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    mediaType?: 'image' | 'pdf' | 'video';
    mediaUrl?: string;
    mediaTitle?: string;
    mediaThumbnail?: string;
  };
  isLastMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLastMessage }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const isUser = message.role === 'user';

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderMedia = () => {
    if (!message.mediaType) return null;

    switch (message.mediaType) {
      case 'image':
        return (
          <div className="mt-3 rounded-lg overflow-hidden relative">
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <ImageIcon className="h-8 w-8 text-slate-400 animate-pulse" />
              </div>
            )}
            <img 
              src={message.mediaUrl} 
              alt="Shared image" 
              className={cn(
                "w-full max-h-[300px] object-cover transition-opacity duration-300",
                !isImageLoaded && "opacity-0"
              )}
              onLoad={() => setIsImageLoaded(true)}
              onClick={() => message.mediaUrl && openExternalLink(message.mediaUrl)}
              style={{ cursor: message.mediaUrl ? 'pointer' : 'default' }}
            />
          </div>
        );
      
      case 'pdf':
        return (
          <div className="mt-3">
            <Card className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors border-indigo-100">
              <div className="bg-red-100 p-2 rounded-lg">
                <FileText className="h-8 w-8 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-900 truncate">{message.mediaTitle || 'PDF Document'}</h4>
                <p className="text-sm text-slate-500 truncate">Click to open PDF</p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                className="flex-shrink-0"
                onClick={() => message.mediaUrl && openExternalLink(message.mediaUrl)}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open
              </Button>
            </Card>
          </div>
        );
      
      case 'video':
        return (
          <div className="mt-3">
            <Card 
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => message.mediaUrl && openExternalLink(message.mediaUrl)}
            >
              <div className="relative">
                <img 
                  src={message.mediaThumbnail} 
                  alt={message.mediaTitle || 'Video thumbnail'} 
                  className="w-full h-[200px] object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="rounded-full bg-white/90 p-3 shadow-lg transform transition-transform hover:scale-110">
                    <Youtube className="h-7 w-7 text-red-600" />
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-50">
                <h4 className="font-medium text-slate-900">{message.mediaTitle || 'YouTube Video'}</h4>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <Youtube className="h-4 w-4 text-red-600" />
                  Click to watch on YouTube
                </p>
              </div>
            </Card>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        "max-w-3xl mx-auto transition-all",
        isUser ? "ml-auto" : "mr-auto",
        isLastMessage && "animate-fade-in"
      )}
      style={{ maxWidth: '85%' }}
    >
      <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
        <div 
          className={cn(
            "rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-white font-medium",
            isUser ? "bg-indigo-600" : "bg-purple-600"
          )}
        >
          {isUser ? 'U' : 'G'}
        </div>
        <div 
          className={cn(
            "rounded-2xl p-4 shadow-sm",
            isUser 
              ? "bg-indigo-600 text-white rounded-tr-none" 
              : "bg-white text-slate-800 border rounded-tl-none"
          )}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
          {renderMedia()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
