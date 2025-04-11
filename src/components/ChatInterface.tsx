
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatMessage from "./ChatMessage";
import EmptyState from "./EmptyState";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  mediaType?: 'image' | 'pdf' | 'video';
  mediaUrl?: string;
  mediaTitle?: string;
  mediaThumbnail?: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // For demonstration, we'll use a mock API endpoint
      // In a real app, replace with your actual server URL
      const backendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://your-production-server.com/api/chat'
        : 'http://localhost:5000/api/chat';
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const botResponse = await response.json();
      setMessages(prev => [...prev, botResponse]);
      setIsMockMode(false);
    } catch (error) {
      console.error('Error fetching from server:', error);
      toast({
        title: "Server Unavailable",
        description: "Switched to mock mode. Connect to the server for full functionality.",
        variant: "destructive"
      });
      
      setIsMockMode(true);
      
      // Fallback to mock data if server is unavailable
      setTimeout(() => {
        let botResponse: ChatMessage = {
          role: 'assistant',
          content: 'This is a test response. The server appears to be offline, so this is a mock response.'
        };

        // Simulate media responses based on user input
        if (inputValue.toLowerCase().includes('image') || inputValue.toLowerCase().includes('picture')) {
          botResponse = {
            ...botResponse,
            mediaType: 'image',
            mediaUrl: 'https://picsum.photos/800/500',
            content: 'Here is the image you requested!'
          };
        } else if (inputValue.toLowerCase().includes('pdf')) {
          botResponse = {
            ...botResponse,
            mediaType: 'pdf',
            mediaUrl: 'https://www.africau.edu/images/default/sample.pdf',
            mediaTitle: 'Sample PDF Document',
            content: 'Here is the PDF document you requested. You can view it below or click to open in a new tab.'
          };
        } else if (inputValue.toLowerCase().includes('video')) {
          botResponse = {
            ...botResponse,
            mediaType: 'video',
            mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            mediaTitle: 'Sample YouTube Video',
            mediaThumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            content: 'Here is the YouTube video you requested. Click on the thumbnail to watch it.'
          };
        }

        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b px-6 py-3 flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg shadow-md">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
          <h2 className="text-xl font-semibold">Gemini Chatbot</h2>
        </div>
        <div className="flex items-center gap-2">
          {isMockMode && (
            <div className="bg-yellow-500 text-xs px-2 py-1 rounded-full text-white animate-pulse">
              Mock Mode
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearChat}
            className="text-white hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      <div ref={contentRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-slate-50">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              isLastMessage={index === messages.length - 1}
            />
          ))
        )}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-4 gap-2">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-slate-500 animate-pulse">Gemini is thinking...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <Card className="m-3 border-t p-3 shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Textarea
            ref={inputRef}
            placeholder="Ask: python roadmap / give python pdf / show python video / show me an image"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="focus-visible:ring-indigo-500 min-h-[60px] max-h-[120px] rounded-2xl"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500">Press Enter to send, Shift+Enter for new line</p>
            <Button 
              type="submit" 
              disabled={isLoading || !inputValue.trim()} 
              className={cn(
                "px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-all",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ChatInterface;
