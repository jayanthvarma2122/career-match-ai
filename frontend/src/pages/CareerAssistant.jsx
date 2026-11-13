import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  Send,
  User,
  Trash2,
  Lightbulb,
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'How can I improve my resume for frontend internships?',
  'What should I include in my resume as a 2nd-year CSE student?',
  'How should I explain my full-stack projects using STAR method?',
  'What are the most common DSA interview topics for college internships?',
  'How do I answer "Tell me about a challenging bug you fixed"?',
];

export default function CareerAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  // Load chat history on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await chatAPI.getChatHistory();
        if (res.success && res.messages) {
          if (res.messages.length > 0) {
            setMessages(res.messages);
          } else {
            // Seed initial welcoming message
            setMessages([
              {
                role: 'assistant',
                content: `Hi ${
                  user?.name ? user.name.split(' ')[0] : 'there'
                }! I'm your Career Coach & Tech Mentor. I'm here to help you optimize your resume, prepare for technical interviews, and articulate your computer science projects effectively. How can I help you today?`,
                timestamp: new Date(),
              },
            ]);
          }
        }
      } catch (err) {
        console.warn('Failed to load chat history:', err.message);
        setMessages([
          {
            role: 'assistant',
            content: `Hi ${
              user?.name ? user.name.split(' ')[0] : 'there'
            }! I'm your Career Coach & Tech Mentor. Ask me any questions about tech internships, interview questions, or resume optimization!`,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setLoadingHistory(false);
      }
    }
    loadHistory();
  }, [user]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || sending) return;

    // Optimistically update UI
    const userMsg = { role: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setSending(true);

    try {
      const res = await chatAPI.sendMessage(text);
      if (res.success && res.messages) {
        setMessages(res.messages);
      } else if (res.reply) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: res.reply, timestamp: new Date() },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue connecting to the mentor service. Please try asking again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleClearChat = async () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      try {
        await chatAPI.clearChatHistory();
        setMessages([
          {
            role: 'assistant',
            content: 'Chat history cleared. What career advice can I provide for you today?',
            timestamp: new Date(),
          },
        ]);
      } catch (err) {
        console.warn('Clear chat error:', err.message);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-[#FFFFFF] rounded-xl border border-[#E5E5E5] shadow-2xs overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 py-3 sm:px-5 border-b border-[#E5E5E5] flex items-center justify-between bg-[#FFFFFF]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#111111] text-[#FFFFFF] flex items-center justify-center shadow-2xs">
            <Bot className="w-4 h-4 text-[#FFFFFF]" />
          </div>
          <div>
            <h3 className="font-semibold text-xs sm:text-sm text-[#111111] flex items-center gap-1.5">
              <span>CareerMatch Mentor</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
            </h3>
            <p className="text-[10px] text-[#777777]">
              Specialized in CS internships & tech interview coaching
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-1.5 text-[#777777] hover:text-[#111111] hover:bg-[#F3F3F3] rounded-lg transition"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Suggested Chips Bar (Horizontal scroll) */}
      <div className="px-3.5 py-2 bg-[#F3F3F3] border-b border-[#E5E5E5] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-medium text-[#777777] shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-[#111111]" />
          Suggestions:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={sending}
            className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#FFFFFF] hover:bg-[#E5E5E5] border border-[#E5E5E5] text-[#111111] font-medium shrink-0 transition whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 bg-[#FFFFFF]">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                  isUser
                    ? 'bg-[#111111] text-[#FFFFFF] shadow-2xs'
                    : 'bg-[#F3F3F3] text-[#111111] border border-[#E5E5E5]'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#111111] text-[#FFFFFF] rounded-tr-xs shadow-2xs'
                    : 'bg-[#F3F3F3] text-[#111111] rounded-tl-xs border border-[#E5E5E5] shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <span
                  className={`block text-[9px] mt-1 ${
                    isUser ? 'text-right text-[#A3A3A3]' : 'text-[#777777]'
                  }`}
                >
                  {msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : ''}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {sending && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#F3F3F3] text-[#111111] flex items-center justify-center shrink-0 border border-[#E5E5E5]">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 rounded-xl bg-[#F3F3F3] rounded-tl-xs border border-[#E5E5E5] flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#111111] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#111111] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#111111] animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-3 bg-[#FFFFFF] border-t border-[#E5E5E5]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about resume tips, interview questions, or project explanations..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={sending}
            className="flex-1 px-3.5 py-2.5 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition shadow-2xs placeholder-[#777777]"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || sending}
            className="p-2.5 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] shadow-2xs transition disabled:opacity-40"
            title="Send Message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
