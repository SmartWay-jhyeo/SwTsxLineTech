"use client";

import { useState } from "react";
import { Send, Loader2, Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.message) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement Supabase save logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.");
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
      alert("문의 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">문의하기</h1>
          <p className="text-white/60">
            궁금하신 사항이 있으시면 언제든지 문의해주세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="text-primary" size={24} />
            </div>
            <h3 className="text-white font-bold mb-2">전화 문의</h3>
            <p className="text-white/60 text-sm">010-1234-5678</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-primary" size={24} />
            </div>
            <h3 className="text-white font-bold mb-2">이메일</h3>
            <p className="text-white/60 text-sm">info@linetech.co.kr</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-primary" size={24} />
            </div>
            <h3 className="text-white font-bold mb-2">위치</h3>
            <p className="text-white/60 text-sm">전국 출장 가능</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-white font-medium mb-2">
                이름 <span className="text-primary">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary"
                placeholder="이름을 입력하세요"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-white font-medium mb-2">
                연락처 <span className="text-primary">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary"
                placeholder="010-1234-5678"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-white font-medium mb-2">
              이메일 <span className="text-white/40 text-sm">(선택)</span>
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary"
              placeholder="example@email.com"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-white font-medium mb-2">
              문의 내용 <span className="text-primary">*</span>
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full h-40 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary resize-none"
              placeholder="문의 내용을 자세히 입력해주세요"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg py-4 font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>전송 중...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>문의하기</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
