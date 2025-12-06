"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  type: "bot" | "user";
  content: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { type: "bot", content: "안녕하세요! 라인테크입니다. 무엇을 도와드릴까요?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = { type: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);

    // Process based on current step
    let nextStep = step + 1;
    let botResponse = "";

    switch (step) {
      case 0: // Collecting name
        setFormData((prev) => ({ ...prev, name: inputValue }));
        botResponse = "감사합니다. 연락처를 입력해주세요.";
        break;

      case 1: // Collecting phone
        setFormData((prev) => ({ ...prev, phone: inputValue }));
        botResponse = "문의 내용을 자세히 적어주세요.";
        break;

      case 2: // Collecting message
        setFormData((prev) => ({ ...prev, message: inputValue }));
        botResponse = "문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다!";

        // Submit to server (TODO: Implement Supabase)
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          console.log("Inquiry submitted:", {
            name: formData.name,
            phone: formData.phone,
            message: inputValue,
          });
        } catch (error) {
          console.error("Failed to submit inquiry:", error);
        }
        break;

      case 3: // Complete
        // Reset conversation
        setTimeout(() => {
          setMessages([
            { type: "bot", content: "안녕하세요! 라인테크입니다. 무엇을 도와드릴까요?" },
          ]);
          setStep(0);
          setFormData({ name: "", phone: "", message: "" });
        }, 3000);
        nextStep = 3; // Stay at step 3
        break;
    }

    // Add bot response
    if (botResponse) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { type: "bot", content: botResponse }]);
      }, 500);
    }

    setStep(nextStep);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    // Reset if previously completed
    if (step === 3) {
      setMessages([
        { type: "bot", content: "안녕하세요! 라인테크입니다. 무엇을 도와드릴까요?" },
      ]);
      setStep(0);
      setFormData({ name: "", phone: "", message: "" });
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
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
                  "max-w-[80%] rounded-lg px-4 py-2",
                  msg.type === "user"
                    ? "bg-primary text-white"
                    : "bg-white/10 text-white"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {step < 3 && (
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type={step === 1 ? "tel" : "text"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="p-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="전송"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
