"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, Home, FileText, MessageCircle, MessageSquare, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const services = [
  {
    name: "차선/주차선",
    links: [
      { label: "시공사례보기", href: "/portfolio?category=lane" },
      { label: "견적내기", href: "/quote/lane" },
    ],
  },
  {
    name: "에폭시",
    links: [
      { label: "시공사례보기", href: "/portfolio?category=epoxy" },
      { label: "견적내기", href: "/quote/epoxy" },
    ],
  },
  {
    name: "도장",
    links: [
      { label: "시공사례보기", href: "/portfolio?category=paint" },
      { label: "견적내기", href: "/quote/paint" },
    ],
  },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  // Client-side mounting check
  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[min(320px,85vw)] bg-background border-l border-white/10 z-50 transition-transform duration-300 ease-out overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white text-lg font-bold">메뉴</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white transition-colors"
            aria-label="메뉴 닫기"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-6 space-y-6">
          {/* 홈 */}
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 text-white hover:text-primary transition-colors"
          >
            <Home size={20} />
            <span className="font-medium">홈</span>
          </Link>

          {/* 서비스 - 토글 */}
          <div>
            <button
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className="flex items-center justify-between w-full text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText size={18} />
                <span>서비스</span>
              </div>
              {isServicesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isServicesOpen && (
              <div className="space-y-4 mt-4">
                {services.map((service) => (
                  <div key={service.name} className="pl-6 space-y-2">
                    <p className="text-white font-medium text-sm">{service.name}</p>
                    <div className="pl-4 space-y-2">
                      {service.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={onClose}
                          className="flex items-center gap-2 text-white/60 hover:text-primary text-sm transition-colors group"
                        >
                          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          <span>{link.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 기타 문의하기 */}
          <Link
            href="/contact"
            onClick={onClose}
            className="flex items-center gap-3 text-white hover:text-primary transition-colors"
          >
            <MessageCircle size={20} />
            <span className="font-medium">기타 문의하기</span>
          </Link>

          {/* 후기보기 */}
          <Link
            href="/reviews"
            onClick={onClose}
            className="flex items-center gap-3 text-white hover:text-primary transition-colors"
          >
            <MessageSquare size={20} />
            <span className="font-medium">후기보기</span>
          </Link>
        </nav>
      </div>
    </>,
    document.body
  );
}
