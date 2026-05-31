"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, Code2, BarChart3 } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/checkin", label: "Check-in", icon: CheckSquare },
    { href: "/dsa", label: "DSA", icon: Code2 },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-gray-950 border-t border-gray-800 min-h-[64px] flex items-center justify-around z-50 pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (pathname === '/' && item.href === '/checkin');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] flex-1 gap-1 transition-colors ${
              isActive ? "text-[#6c63ff]" : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <Icon size={24} />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
