import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  ChevronRight,
  Plus,
  Calendar,
  FileJson,
  User,
  Zap,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  action?: {
    type: 'form' | 'schedule' | 'vehicle';
    label: string;
  };
}

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your Command Center Assistant. I can help you build forms, schedule campaigns, or manage your fleet. What would you like to do today?',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiContent = "I understand. I can help with that. Would you like me to draft a proposal or execute the task directly?";
      let action: Message['action'];

      if (input.toLowerCase().includes('form')) {
        aiContent = "I've analyzed your requirements. I can create a new 'Weekend Special' form schema with 4 steps and 12 fields. Should I proceed?";
        action = { type: 'form', label: 'Build Form Schema' };
      } else if (input.toLowerCase().includes('schedule') || input.toLowerCase().includes('email')) {
        aiContent = "I can schedule a follow-up email campaign for all pending applications. I'll set it for tomorrow at 9:00 AM. Confirm?";
        action = { type: 'schedule', label: 'Schedule Campaign' };
      } else if (input.toLowerCase().includes('vehicle')) {
        aiContent = "I see the Kia Sportage is back from maintenance. Should I update its status to 'Available' in the fleet manager?";
        action = { type: 'vehicle', label: 'Update Fleet' };
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
        action
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-600/40 flex items-center justify-center hover:bg-blue-500 transition-all z-[100] group"
      >
        <Sparkles className="w-8 h-8 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-[100]"
          >
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI Command Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active & Ready</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-all"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-auto p-6 space-y-6 bg-slate-50/50"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                    {msg.action && (
                      <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg">
                        {msg.action.type === 'form' && <FileJson className="w-3.5 h-3.5" />}
                        {msg.action.type === 'schedule' && <Calendar className="w-3.5 h-3.5" />}
                        {msg.action.type === 'vehicle' && <Zap className="w-3.5 h-3.5" />}
                        {msg.action.label} <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <p className="text-[10px] text-slate-400 font-medium px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-xs text-slate-400 font-medium italic">AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-blue-500 transition-all">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me to build a form or schedule a blast..."
                  className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-slate-700 placeholder:text-slate-400"
                />
                <button 
                  onClick={handleSend}
                  className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2 mt-4">
                <QuickAction label="Build Form" onClick={() => setInput('Build a new rental form')} />
                <QuickAction label="Schedule SMS" onClick={() => setInput('Schedule an SMS blast')} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const QuickAction = ({ label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-blue-50 hover:text-blue-600 transition-all"
  >
    {label}
  </button>
);
