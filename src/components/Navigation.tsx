"use client";

import { Bell, Home, PlusSquare, Search, User } from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, label: "Trang chủ" },
  { icon: Search, label: "Khám phá" },
  { icon: PlusSquare, label: "Đăng" },
  { icon: Bell, label: "Thông báo" },
  { icon: User, label: "Hồ sơ" },
] as const;

export default function Navigation() {
  return (
    <>
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-50
                   bg-black/90 backdrop-blur-md
                   border-t border-white/10"
      >
        <ul className="flex items-center justify-around">
          {NAV_ITEMS.map(({ icon: Icon, label }, index) => (
            <li key={label}>
              <button
                aria-label={label}
                className={`flex flex-col items-center gap-1 py-3 px-4
                            transition-colors duration-150
                            ${index === 0 ? "text-white" : "text-white/50 hover:text-white"}`}
              >
                <Icon size={22} strokeWidth={index === 0 ? 2.2 : 1.75} />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <aside
        aria-label="Desktop navigation"
        className="hidden md:flex flex-col
                   fixed left-0 top-0 h-screen w-64 z-50
                   bg-black border-r border-white/10"
      >
        <div className="px-6 py-6 border-b border-white/10 flex-shrink-0">
          <h1 className="text-2xl font-bold tracking-tight">
            Video<span className="text-red-500">Feed</span>
          </h1>
        </div>

        <nav className="flex flex-col gap-1 px-3 pt-4 flex-1">
          {NAV_ITEMS.map(({ icon: Icon, label }, index) => (
            <button
              key={label}
              aria-label={label}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl
                          text-sm transition-all duration-150
                          ${
                            index === 0
                              ? "bg-white/10 text-white font-semibold"
                              : "text-white/60 hover:bg-white/5 hover:text-white font-medium"
                          }`}
            >
              <Icon size={24} strokeWidth={index === 0 ? 2.2 : 1.75} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
