"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

type HeaderProps = {
  className?: string;
};

export function Header({ className }: HeaderProps) {
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const threshold = 10;

      // 배경색 적용 여부 (20px 이상 스크롤 시)
      setIsScrolled(currentScrollY > 20);

      // 숨김 여부 (내리면 숨기고, 올리면 표시)
      if (Math.abs(currentScrollY - lastScrollY.current) > threshold) {
        // 80px 이상 스크롤하고 아래로 내릴 때만 숨김
        setIsHidden(currentScrollY > lastScrollY.current && currentScrollY > 80);
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-center px-6",
        "transition-all duration-300 ease-in-out",
        isHidden ? "-translate-y-full" : "translate-y-0",
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-lg" : "bg-transparent",
        "pointer-events-none",
        className
      )}
    >
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-10 w-40">
              <Image
                src="/images/logo3.png"
                alt="라인테크"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

      <button
        type="button"
        onClick={() => setIsMenuOpen(true)}
        className="absolute right-6 p-1 text-white hover:opacity-80 transition-opacity pointer-events-auto"
        aria-label="메뉴 열기"
      >
        <Menu size={28} strokeWidth={2} />
      </button>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
