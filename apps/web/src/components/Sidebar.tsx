"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface RecentChat {
  id: string;
  title: string;
  exam: string;
  time: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

/* ─── Mock recent chats ──────────────────────────────────────────────────── */
const RECENT_CHATS: RecentChat[] = [
  { id: "1", title: "Preamble & Fundamental Rights", exam: "UPSC", time: "2m ago" },
  { id: "2", title: "Mauryan Empire — Ashoka's Edicts", exam: "UPSC", time: "1h ago" },
  { id: "3", title: "Indian Geography: River Systems", exam: "UPSC", time: "3h ago" },
  { id: "4", title: "Polity — DPSP vs Fundamental Rights", exam: "UPSC", time: "Yesterday" },
  { id: "5", title: "Economy: Monetary Policy Tools", exam: "UPSC", time: "Yesterday" },
  { id: "6", title: "Environment & Ecology MCQs", exam: "UPSC", time: "2 days ago" },
];

const EXAM_BADGE_COLORS: Record<string, string> = {
  UPSC: "text-indigo-400 bg-indigo-500/10",
  NEET: "text-emerald-400 bg-emerald-500/10",
  JEE: "text-amber-400 bg-amber-500/10",
  SSC: "text-sky-400 bg-sky-500/10",
};

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const Icons = {
  dashboard: (
    <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]">
      <rect x="2" y="2" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  quiz: (
    <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]">
      <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 11V9.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="13.5" r="0.75" fill="currentColor" />
    </svg>
  ),
  affairs: (
    <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]">
      <path d="M2 5h16M2 10h10M2 15h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="13.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 16l1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  planner: (
    <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]">
      <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 2v4M13 2v4M3 9h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 13h2M11 13h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  pyq: (
    <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]">
      <path d="M4 3h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7h6M7 10h4M7 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.1 4.1l1.1 1.1M14.8 14.8l1.1 1.1M4.1 15.9l1.1-1.1M14.8 5.2l1.1-1.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]">
      <path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7l-4 3V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 20 20" fill="none" className="w-[16px] h-[16px]">
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <path d="M10 2L11.5 7.5H17L12.5 11L14 17L10 13.5L6 17L7.5 11L3 7.5H8.5L10 2Z"
        fill="url(#sb-spark)" />
      <defs>
        <linearGradient id="sb-spark" x1="3" y1="2" x2="17" y2="17" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a5b4fc" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
      <path d="M4 6h12M8 6V4h4v2M7 6v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/* ─── Nav items ──────────────────────────────────────────────────────────── */
const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard",      href: "/dashboard",      icon: Icons.dashboard },
  { label: "Quizzes",        href: "/quizzes",        icon: Icons.quiz,    badge: "New" },
  { label: "Current Affairs",href: "/current-affairs",icon: Icons.affairs },
  { label: "Study Planner",  href: "/planner",        icon: Icons.planner },
  { label: "PYQ Analysis",   href: "/pyq",            icon: Icons.pyq },
];

/* ─── NavLink ────────────────────────────────────────────────────────────── */
function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const pathname = usePathname();
  const active = pathname === item.href;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`
        group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium
        transition-all duration-150 relative
        ${active
          ? "bg-indigo-600/20 text-indigo-300 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]"
          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
        }
      `}
    >
      <span className={`flex-shrink-0 transition-colors ${active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`}>
        {item.icon}
      </span>
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
          {item.badge}
        </span>
      )}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-500 rounded-full" />
      )}
    </Link>
  );
}

/* ─── Sidebar inner content ──────────────────────────────────────────────── */
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full">

      {/* Logo + close (mobile) */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4">
        <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            {Icons.spark}
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[14px] font-bold text-white tracking-tight">PrepAI</span>
            <span className="text-[10px] text-indigo-400/80 tracking-widest uppercase font-medium">UPSC</span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
            aria-label="Close sidebar"
          >
            {Icons.close}
          </button>
        )}
      </div>

      {/* New Chat button */}
      <div className="px-3 pb-4">
        <Link
          href="/chat/new"
          onClick={onClose}
          className="
            flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl
            bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98]
            text-white text-[13.5px] font-semibold
            shadow-[0_2px_16px_rgba(99,102,241,0.35)]
            transition-all duration-150
          "
        >
          {Icons.plus}
          New Chat
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/[0.06] mb-3" />

      {/* Primary nav */}
      <nav className="px-3 flex flex-col gap-0.5">
        {PRIMARY_NAV.map((item) => (
          <NavLink key={item.href} item={item} onClick={onClose} />
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/[0.06] my-4" />

      {/* Recent chats */}
      <div className="flex-1 overflow-y-auto px-3 min-h-0">
        <p className="text-[10.5px] font-semibold tracking-widest uppercase text-slate-600 px-2 mb-2">
          Recent Chats
        </p>
        <div className="flex flex-col gap-0.5">
          {RECENT_CHATS.map((chat) => (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              onClick={onClose}
              onMouseEnter={() => setHoveredChat(chat.id)}
              onMouseLeave={() => setHoveredChat(null)}
              className="
                group flex items-start gap-2.5 px-2.5 py-2 rounded-xl
                text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]
                transition-all duration-150 relative
              "
            >
              <span className="flex-shrink-0 mt-0.5 text-slate-600 group-hover:text-slate-500 transition-colors">
                {Icons.chat}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-medium truncate leading-snug">{chat.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] font-semibold px-1 py-0.5 rounded ${EXAM_BADGE_COLORS[chat.exam] ?? "text-slate-500 bg-white/5"}`}>
                    {chat.exam}
                  </span>
                  <span className="text-[10px] text-slate-600">{chat.time}</span>
                </div>
              </div>
              {/* Delete on hover */}
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                aria-label="Delete chat"
                className={`
                  flex-shrink-0 p-1 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10
                  transition-all duration-150
                  ${hoveredChat === chat.id ? "opacity-100" : "opacity-0"}
                `}
              >
                {Icons.trash}
              </button>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom: Settings + user */}
      <div className="px-3 pt-3 pb-5 border-t border-white/[0.06] mt-2 flex flex-col gap-1">
        <NavLink
          item={{ label: "Settings", href: "/settings", icon: Icons.settings }}
          onClick={onClose}
        />

        {/* User pill */}
        <div className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-semibold text-slate-300 truncate">Arjun Sharma</p>
            <p className="text-[10.5px] text-slate-600 truncate">Free Plan</p>
          </div>
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-slate-600 flex-shrink-0">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Sidebar export ────────────────────────────────────────────────── */
export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center gap-3 px-4 h-14 bg-[#0d0d1a]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open sidebar"
          className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
        >
          {Icons.menu}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            {Icons.spark}
          </div>
          <span className="text-[14px] font-bold text-white tracking-tight">PrepAI</span>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-[#0d0d1a] border-r border-white/[0.07]"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-[#0d0d1a] border-r border-white/[0.07] z-30">
        <SidebarContent />
      </aside>

      {/* Desktop spacer */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
}