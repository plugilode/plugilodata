import React, { useState, useEffect, useRef } from 'react';
import { X, Bot, Send, Sparkles, Loader2, AlertCircle, History, Terminal, Command, Filter } from 'lucide-react';
import { Record } from '../types';

interface AIPromptModalProps {
  onClose: () => void;
  onSearch: (results: Record[]) => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai' | 'error' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    resultCount?: number;
    filters?: string[];
    command?: string;
  };
}

export const AIPromptModal: React.FC<AIPromptModalProps> = ({ onClose, onSearch }) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [commandMode, setCommandMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [suggestions] = useState([
    'Find companies similar to Tesla in the EV industry',
    'Show me cybersecurity companies founded after 2020',
    'List AI companies with revenue over $10M',
    'Find sustainable energy startups in Europe'
  ]);

  // Initialize with welcome message
  useEffect(() => {
    addMessage({
      type: 'system',
      content: 'Welcome! I can help you search the database using natural language or commands. Try typing "/help" for available commands.'
    });
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !commandMode) {
        e.preventDefault();
        setCommandMode(true);
        setPrompt('/');
        inputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setCommandMode(false);
        setPrompt('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandMode]);

  const handleCommand = async (cmd: string) => {
    const command = cmd.slice(1).toLowerCase();
    switch (command) {
      case 'help':
        addMessage({
          type: 'system',
          content: 'Available commands:\n/help - Show this help\n/clear - Clear chat\n/filters - Show active filters\n/recent - Show recent searches',
          metadata: { command }
        });
        break;
      case 'clear':
        setMessages([]);
        break;
      case 'filters':
        addMessage({
          type: 'system',
          content: 'Active filters: None',
          metadata: { command, filters: [] }
        });
        break;
      default:
        return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setError(null);
    setIsProcessing(true);

    // Handle commands
    if (prompt.startsWith('/')) {
      const handled = await handleCommand(prompt);
      if (handled) {
        setPrompt('');
        setIsProcessing(false);
        return;
      }
    }

    addMessage({ type: 'user', content: prompt });

    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, commandMode })
      });
      
      if (!response.ok) {
        throw new Error('Search failed. Please try again.');
      }

      const results = await response.json();
      
      addMessage({
        type: 'ai',
        content: `Found ${results.length} matching companies.`,
        metadata: { resultCount: results.length }
      });

      onSearch(results);
      setPrompt('');
      setCommandMode(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      addMessage({
        type: 'error',
        content: errorMessage
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    }]);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-black/90 border border-green-500/30 rounded-lg shadow-xl animate-slideDown">
        {/* Header with command mode indicator */}
        <div className="flex items-center justify-between p-4 border-b border-green-500/30">
          <div className="flex items-center gap-2">
            {commandMode ? (
              <Command className="w-5 h-5 text-green-500" />
            ) : (
              <Bot className="w-5 h-5 text-green-500" />
            )}
            <h2 className="text-lg text-green-500 font-semibold">
              {commandMode ? 'Command Mode' : 'AI Search Assistant'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCommandMode(!commandMode)}
              className="p-1.5 rounded-full hover:bg-green-500/10 transition-colors"
              title="Toggle Command Mode (Press '/')"
            >
              <Terminal className="w-4 h-4 text-green-500/70" />
            </button>
            <button
              onClick={onClose}
              className="text-green-500/70 hover:text-green-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[300px] overflow-y-auto p-4 border-b border-green-500/30">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-3 ${
                message.type === 'user' ? 'text-right' : ''
              }`}
            >
              <div
                className={`inline-block px-3 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-green-500/10 text-green-500'
                    : message.type === 'error'
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-green-500/20 text-green-500'
                }`}
              >
                {message.type === 'ai' && (
                  <Terminal className="w-4 h-4 inline-block mr-2" />
                )}
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Describe what you're looking for..."
                className="w-full h-20 bg-black/30 border border-green-500/30 rounded-lg px-4 py-2 text-green-500 placeholder-green-500/30 focus:outline-none focus:border-green-500 resize-none text-sm"
                disabled={isProcessing}
                ref={inputRef}
              />
              <button
                type="submit"
                disabled={isProcessing || !prompt.trim()}
                className="absolute bottom-2 right-2 p-2 rounded-full bg-green-500/20 hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-green-500" />
                )}
              </button>
            </div>
          </form>

          {/* Suggestions */}
          <div className="mt-4">
            <h3 className="text-green-500/70 text-xs mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Suggested Prompts
            </h3>
            <div className="grid grid-cols-1 gap-1">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setPrompt(suggestion)}
                  className="text-left text-green-500/70 hover:text-green-500 p-1.5 rounded hover:bg-green-500/10 transition-colors text-xs"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 