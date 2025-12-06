"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, LogOut, Home, FileText, DollarSign } from "lucide-react";
import { logout } from "@/features/auth/actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const sidebarItems = [
    {
      title: "대시보드",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "견적 관리",
      href: "/admin/quotes",
      icon: FileText,
    },
    {
      title: "단가 관리",
      href: "/admin/pricing",
      icon: DollarSign,
    },
    {
      title: "시공 사례 등록",
      href: "/admin/portfolio/new",
      icon: PlusCircle,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">LineTech Admin</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon size={20} />
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Home size={20} />
            홈페이지 바로가기
          </Link>
          <form action={logout}>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut size={20} />
              로그아웃
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
