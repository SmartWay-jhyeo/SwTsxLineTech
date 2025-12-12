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
          <h3 className="text-white font-bold text-lg">스마트로드</h3>
          <p className="text-white/60 text-sm">인천광역시 남동구 은봉로297 305호</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-1">
          <p className="text-white/60 text-sm">전화: 010-4806-9911</p>
          <p className="text-white/60 text-sm">이메일: smartroad.jhyeo@gmail.com</p>
        </div>

        {/* Registration Numbers */}
        <div className="space-y-1">
          <p className="text-white/60 text-sm">사업자등록번호: 605-44-77540</p>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-white/40 text-xs">© 2024 스마트로드. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
