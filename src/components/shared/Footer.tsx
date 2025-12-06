"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // 관리자 페이지에서는 Footer 숨김
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-background border-t border-white/10 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        {/* Company Name & Address */}
        <div className="space-y-1">
          <h3 className="text-white font-bold text-lg">라인테크</h3>
          <p className="text-white/60 text-sm">경기도 남양주시 별내중앙로26, 506호</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-1">
          <p className="text-white/60 text-sm">전화: 031-575-1012</p>
          <p className="text-white/60 text-sm">이메일: linetech2012@naver.com</p>
        </div>

        {/* Registration Numbers */}
        <div className="space-y-1">
          <p className="text-white/60 text-sm">사업자등록번호: 132-86-03287</p>
          <p className="text-white/60 text-sm">법인등록번호: 284111-0101653</p>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-white/40 text-xs">© 2024 라인테크. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
