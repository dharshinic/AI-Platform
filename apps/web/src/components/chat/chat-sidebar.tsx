"use client";

import Link from "next/link";

export type ChatSession = {
  id: string;
  title: string;
};

type ChatSidebarProps = {
  sessions: ChatSession[];
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onClose?: () => void;
};

const quickTopics = [
  "Indian Polity",
  "Economy",
  "Modern History",
  "Geography",
  "Current Affairs",
];

export function ChatSidebar({
  sessions,
  activeId,
  onSelect,
  onNewChat,
  onClose,
}: ChatSidebarProps) {
  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-zinc-800/80 bg-zinc-900/50">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 px-3 py-3 sm:px-4">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex min-w-0 items-center gap-2 text-sm font-semibold text-zinc-100"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-xs font-bold text-white">
            E
          </span>
          <span className="truncate">
            Exam<span className="text-teal-400">AI</span>
          </span>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <button
          type="button"
          onClick={() => {
            onNewChat();
            onClose?.();
          }}
          className="flex w-full min-h-10 items-center justify-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-800/50 px-4 py-2.5 text-sm font-medium text-zinc-100 transition-colors hover:border-teal-500/40 hover:bg-zinc-800"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          New chat
        </button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-2 sm:px-3" aria-label="Chat history">
        <p className="px-2 pb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-500 sm:text-xs">
          Recent
        </p>
        <ul className="space-y-0.5">
          {sessions.map((session) => (
            <li key={session.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(session.id);
                  onClose?.();
                }}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  activeId === session.id
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                }`}
              >
                <span className="line-clamp-2">{session.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-zinc-800/80 p-3 sm:p-4">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-500 sm:text-xs">
          Topics
        </p>
        <div className="flex flex-wrap gap-1.5">
          {quickTopics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-zinc-700/60 bg-zinc-800/40 px-2.5 py-1 text-[11px] text-zinc-400"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
