"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !message) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement Supabase save logic
      // For now, just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.");
      setName("");
      setPhone("");
      setMessage("");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
      alert("문의 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 z-40",
          isOpen
            ? "bg-primary/90 hover:bg-primary"
            : "bg-primary hover:bg-primary/90 hover:scale-110"
        )}
        aria-label="챗봇 열기"
      >
        {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 w-96 h-[500px] bg-background border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 z-40 flex flex-col",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-primary/10 rounded-t-2xl">
          <h3 className="text-white font-bold text-lg">문의하기</h3>
          <p className="text-white/60 text-sm mt-1">무엇을 도와드릴까요?</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="chatbot-name" className="block text-white/70 text-sm mb-2">
              이름 *
            </label>
            <input
              id="chatbot-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div>
            <label htmlFor="chatbot-phone" className="block text-white/70 text-sm mb-2">
              연락처 *
            </label>
            <input
              id="chatbot-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary"
              placeholder="010-1234-5678"
              required
            />
          </div>

          <div className="flex-1">
            <label htmlFor="chatbot-message" className="block text-white/70 text-sm mb-2">
              문의 내용 *
            </label>
            <textarea
              id="chatbot-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-32 bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary resize-none"
              placeholder="문의 내용을 입력하세요"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>전송 중...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>전송하기</span>
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
