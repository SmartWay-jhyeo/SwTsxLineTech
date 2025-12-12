"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getChatResponse } from "@/features/chat/actions";

type Message = {
  type: "bot" | "user";
  content: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { type: "bot", content: "안녕하세요! 시공얼마입니다. 무엇을 도와드릴까요?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue("");
    
    // Add user message
    const userMessage: Message = { type: "user", content: userText };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call Server Action
      const result = await getChatResponse(userText);
      
      const botContent = result.content || result.error || "죄송합니다. 오류가 발생했습니다.";
      
      setMessages((prev) => [...prev, { type: "bot", content: botContent }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { type: "bot", content: "죄송합니다. 네트워크 오류가 발생했습니다." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 z-50",
          isOpen
            ? "bg-primary/90 hover:bg-primary"
            : "bg-primary hover:bg-primary/90 hover:scale-110"
        )}
        aria-label={isOpen ? "챗봇 닫기" : "챗봇 열기"}
      >
        {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-background border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 z-50 flex flex-col overflow-hidden",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-primary/10">
          <h3 className="text-white font-bold text-lg">AI 상담원</h3>
          <p className="text-white/60 text-sm mt-1">궁금한 점을 자유롭게 물어보세요!</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                msg.type === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  msg.type === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-white/10 text-white rounded-bl-none"
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-white rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs text-white/60">답변을 생각하고 있습니다...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-background/50 backdrop-blur-sm">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="전송"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
