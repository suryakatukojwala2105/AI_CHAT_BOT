
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ImageIcon, FileText, Youtube, ExternalLink, Download, MaximizeIcon, MinimizeIcon } from "lucide-react";
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
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const isUser = message.role === 'user';

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleImageSize = () => {
    setIsImageExpanded(!isImageExpanded);
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
            <div className="relative group">
              <img 
                src={message.mediaUrl} 
                alt="Shared image" 
                className={cn(
                  "w-full object-cover transition-all duration-300 hover:brightness-95",
                  isImageExpanded ? "max-h-[600px]" : "max-h-[300px]",
                  !isImageLoaded && "opacity-0"
                )}
                onLoad={() => setIsImageLoaded(true)}
                onClick={() => message.mediaUrl && openExternalLink(message.mediaUrl)}
                style={{ cursor: message.mediaUrl ? 'pointer' : 'default' }}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8 bg-white/80 hover:bg-white shadow-md" 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleImageSize();
                  }}
                >
                  {isImageExpanded ? (
                    <MinimizeIcon className="h-4 w-4 text-slate-700" />
                  ) : (
                    <MaximizeIcon className="h-4 w-4 text-slate-700" />
                  )}
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8 bg-white/80 hover:bg-white shadow-md" 
                  onClick={(e) => {
                    e.stopPropagation();
                    message.mediaUrl && openExternalLink(message.mediaUrl);
                  }}
                >
                  <ExternalLink className="h-4 w-4 text-slate-700" />
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'pdf':
        return (
          <div className="mt-3">
            <Card className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors border-indigo-100 group">
              <div className="bg-red-100 p-2 rounded-lg group-hover:scale-105 transition-transform">
                <FileText className="h-8 w-8 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-900 truncate">{message.mediaTitle || 'PDF Document'}</h4>
                <p className="text-sm text-slate-500 truncate">Click to open PDF</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-shrink-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  onClick={() => message.mediaUrl && openExternalLink(message.mediaUrl)}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="flex-shrink-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onClick={() => message.mediaUrl && openExternalLink(message.mediaUrl)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </Card>
          </div>
        );
      
      case 'video':
        return (
          <div className="mt-3">
            <Card 
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => message.mediaUrl && openExternalLink(message.mediaUrl)}
            >
              <div className="relative">
                <img 
                  src={message.mediaThumbnail} 
                  alt={message.mediaTitle || 'Video thumbnail'} 
                  className="w-full h-[200px] object-cover transition-transform group-hover:scale-105 duration-300"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <div className="rounded-full bg-red-600 p-3 shadow-lg transform transition-transform group-hover:scale-110 duration-300">
                    <Youtube className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-50">
                <h4 className="font-medium text-slate-900">{message.mediaTitle || 'YouTube Video'}</h4>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Youtube className="h-4 w-4 text-red-600" />
                    Watch on YouTube
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-600 hover:text-red-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      message.mediaUrl && openExternalLink(message.mediaUrl);
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open
                  </Button>
                </div>
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
            "rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-white font-medium shadow-sm",
            isUser ? "bg-indigo-600" : "bg-purple-600"
          )}
        >
          {isUser ? 'U' : 'G'}
        </div>
        <div 
          className={cn(
            "rounded-2xl p-4 shadow-sm transition-shadow hover:shadow-md",
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
