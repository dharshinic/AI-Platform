"use client";

import { useEffect, useRef, useState } from "react";

export type MessageRole = "user" | "ai";

export interface ChatMessageProps {
  role: MessageRole;
  content: string;
  timestamp?: string;
  isStreaming?: boolean;
  avatarLabel?: string;
}

/* ─── Minimal markdown renderer ─────────────────────────────────────────── */
function renderMarkdown(text: string): string {
  return text
    // Code blocks
    .replace(
      /```(\w+)?\n?([\s\S]*?)```/g,
      (_m, _lang, code) =>
        `<pre class="bg-[#0d0d1a] border border-white/[0.07] rounded-xl px-4 py-3 my-3 overflow-x-auto text-[13px] text-indigo-200 font-mono leading-relaxed"><code>${escapeHtml(code.trim())}</code></pre>`
    )
    // Inline code
    .replace(
      /`([^`]+)`/g,
      `<code class="bg-white/[0.08] text-indigo-300 rounded px-1.5 py-0.5 text-[13px] font-mono">$1</code>`
    )
    // Bold
    .replace(/\*\*(.+?)\*\*/g, `<strong class="text-slate-100 font-semibold">$1</strong>`)
    // Italic
    .replace(/\*(.+?)\*/g, `<em class="text-slate-300 italic">$1</em>`)
    // Headings
    .replace(/^### (.+)$/gm, `<h3 class="text-base font-semibold text-slate-100 mt-4 mb-1">$1</h3>`)
    .replace(/^## (.+)$/gm, `<h2 class="text-lg font-semibold text-slate-100 mt-5 mb-2">$1</h2>`)
    .replace(/^# (.+)$/gm, `<h1 class="text-xl font-bold text-white mt-5 mb-2">$1</h1>`)
    // Unordered list items
    .replace(
      /^[-*] (.+)$/gm,
      `<li class="flex gap-2 items-start my-0.5"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span><span>$1</span></li>`
    )
    // Ordered list items
    .replace(
      /^\d+\. (.+)$/gm,
      (_m, item, offset, str) => {
        const num = (str.slice(0, offset).match(/^\d+\./gm) || []).length + 1;
        return `<li class="flex gap-2 items-start my-0.5"><span class="text-indigo-400 font-mono text-xs mt-0.5 flex-shrink-0 w-4">${num}.</span><span>${item}</span></li>`;
      }
    )
    // Horizontal rule
    .replace(/^---$/gm, `<hr class="border-white/10 my-4" />`)
    // Blockquote
    .replace(
      /^> (.+)$/gm,
      `<blockquote class="border-l-2 border-indigo-500/50 pl-3 text-slate-400 italic my-2">$1</blockquote>`
    )
    // Double newline → paragraph break
    .replace(/\n\n/g, `</p><p class="mt-3">`)
    // Single newline → line break
    .replace(/\n/g, `<br />`);
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ─── Avatar ─────────────────────────────────────────────────────────────── */
function Avatar({ role, label }: { role: MessageRole; label?: string }) {
  if (role === "user") {
    return (
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
        {label ? label[0].toUpperCase() : "U"}
      </div>
    );
  }
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a2e] border border-indigo-500/30 flex items-center justify-center shadow-md shadow-indigo-900/30">
      {/* Spark icon */}
      <svg
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
      >
        <path
          d="M10 2L11.5 7.5H17L12.5 11L14 17L10 13.5L6 17L7.5 11L3 7.5H8.5L10 2Z"
          fill="url(#spark)"
        />
        <defs>
          <linearGradient id="spark" x1="3" y1="2" x2="17" y2="17" gradientUnits="userSpaceOnUse">
            <stop stopColor="#818cf8" />
            <stop offset="1" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ─── Streaming cursor ───────────────────────────────────────────────────── */
function StreamingCursor() {
  return (
    <span className="inline-block w-[2px] h-[1em] bg-indigo-400 ml-0.5 align-middle animate-pulse rounded-sm" />
  );
}

/* ─── Copy button ────────────────────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy message"
      className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 px-2 py-1 rounded-lg hover:bg-white/[0.06]"
    >
      {copied ? (
        <>
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-emerald-400">
            <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
            <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M3 11V3h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function ChatMessage({
  role,
  content,
  timestamp,
  isStreaming = false,
  avatarLabel,
}: ChatMessageProps) {
  const isUser = role === "user";
  const contentRef = useRef<HTMLDivElement>(null);

  const html = renderMarkdown(content);

  /* Scroll into view when new message arrives */
  useEffect(() => {
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [content]);

  return (
    <div
      ref={contentRef}
      className={`group w-full flex gap-3 px-4 py-5 transition-colors duration-150
        ${isUser ? "justify-end" : "justify-start"}
      `}
    >
      {/* AI avatar — left */}
      {!isUser && <Avatar role="ai" />}

      {/* Bubble */}
      <div className={`flex flex-col gap-1.5 max-w-[85%] sm:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>

        {/* Role label + timestamp */}
        <div className={`flex items-center gap-2 px-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[11px] font-medium tracking-widest uppercase text-slate-500">
            {isUser ? (avatarLabel ?? "You") : "AI Tutor"}
          </span>
          {timestamp && (
            <span className="text-[10px] text-slate-600">{timestamp}</span>
          )}
        </div>

        {/* Message bubble */}
        <div
          className={`
            relative rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed
            ${isUser
              ? "bg-indigo-600/90 text-white rounded-tr-sm shadow-lg shadow-indigo-900/30"
              : "bg-[#16162a] border border-white/[0.07] text-slate-300 rounded-tl-sm shadow-md"
            }
          `}
        >
          {/* Top glow line for AI */}
          {!isUser && (
            <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
          )}

          {isUser ? (
            /* User: plain text, preserve line breaks */
            <p className="whitespace-pre-wrap break-words">{content}</p>
          ) : (
            /* AI: rendered markdown */
            <div
              className="prose-custom break-words"
              dangerouslySetInnerHTML={{
                __html: `<p class="mt-0">${html}</p>`,
              }}
            />
          )}

          {/* Streaming cursor */}
          {isStreaming && !isUser && <StreamingCursor />}
        </div>

        {/* Actions row (AI only) */}
        {!isUser && !isStreaming && (
          <div className="flex items-center gap-1 px-1">
            <CopyButton text={content} />
          </div>
        )}
      </div>

      {/* User avatar — right */}
      {isUser && <Avatar role="user" label={avatarLabel} />}
    </div>
  );
}