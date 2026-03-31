'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Loader2, Sparkles } from 'lucide-react';
import apiClient from '@/api/client';
import { useAuth } from '@/context/AuthContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, login } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Load Razorpay script dynamically
  useEffect(() => {
    if (!document.getElementById('razorpay-script')) {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // ─── RAZORPAY PAYMENT HANDLER ──────────────────────────────────────
  const handlePayment = (paymentData: any) => {
    if (!window.Razorpay) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Payment system is loading. Please try again in a moment."
      }]);
      return;
    }

    const options = {
      key: paymentData.keyId,
      amount: paymentData.amount * 100,
      currency: paymentData.currency,
      name: 'ATHLiON',
      description: `Registration: ${paymentData.eventName}`,
      order_id: paymentData.orderId,
      handler: async (response: any) => {
        // Payment successful — verify it
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "💳 Payment received! Verifying your registration..."
        }]);

        try {
          const verifyRes = await apiClient.post('registrations/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `🎉 You're officially registered for ${paymentData.eventName}! Check your email and WhatsApp for confirmation details. See you at the race! 🏃‍♂️🔥`
            }]);
          } else {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: "⚠️ Payment was received but verification had an issue. Please contact support or check your dashboard."
            }]);
          }
        } catch (err) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "⚠️ Payment went through but we couldn't verify immediately. Don't worry — check your dashboard or contact support if needed."
          }]);
        }
      },
      modal: {
        ondismiss: () => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "Payment was cancelled. No worries — you can try again anytime! Just say 'register for [event name]'."
          }]);
        }
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      theme: {
        color: '#f82506',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ─── SEND MESSAGE HANDLER ──────────────────────────────────────────
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('ai/chat', {
        message: input,
        history: updatedMessages.slice(-10),
      });

      const botMessage: ChatMessage = { 
        role: 'assistant', 
        content: response.data.reply 
      };
      setMessages((prev) => [...prev, botMessage]);

      // Auto-login if the bot created an account
      if (response.data.authData?.token && response.data.authData?.user) {
        const { token, user: userData } = response.data.authData;
        login(token, userData);
      }

      // Open Razorpay if payment data is returned
      if (response.data.paymentData) {
        setTimeout(() => {
          handlePayment(response.data.paymentData);
        }, 800); // Small delay so user can read the message first
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', content: "I'm having a quick rest 💪 Please try again in a moment!" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "What is ATHLiON?",
    "Show upcoming races",
    "Register for a race",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mb-4 w-[350px] sm:w-[400px] h-[520px] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#f82506] to-[#d41f05] flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <span className="font-black italic uppercase tracking-wider text-sm block leading-none">ATHLiON AI</span>
                  <span className="text-[10px] text-white/60 uppercase tracking-widest">
                    {user ? `Hi, ${user.name}` : 'Always Ready'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="Close Chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                  <div className="w-16 h-16 bg-[#f82506]/10 rounded-full flex items-center justify-center mb-4">
                    <Bot size={32} className="text-[#f82506]" />
                  </div>
                  <p className="text-sm text-gray-400 mb-6">
                    Hey{user ? ` ${user.name}` : ''}! I can help you find races, register for events, and even complete payments — all right here!
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setInput(action);
                          setTimeout(() => {
                            const form = document.getElementById('chat-form');
                            if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
                          }, 100);
                        }}
                        className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-[#f82506]/50 transition-all"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((msg, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#f82506] text-white rounded-br-sm' 
                      : 'bg-[#1a1a1a] border border-white/5 text-gray-300 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-[#1a1a1a] border border-white/5 p-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-[#f82506]" />
                    <span className="text-xs text-gray-500">Thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form id="chat-form" onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-black/50">
              <div className="relative flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about ATHLiON..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full py-2.5 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f82506]/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 bg-[#f82506] rounded-full text-white disabled:opacity-30 hover:scale-105 active:scale-95 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-[#f82506] to-[#c41e04] rounded-full flex items-center justify-center text-white shadow-xl shadow-[#f82506]/25 relative z-[10000]"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageSquare size={22} />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && messages.length === 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
             <span className="w-2 h-2 bg-[#f82506] rounded-full animate-ping" />
          </span>
        )}
      </motion.button>
    </div>
  );
}
