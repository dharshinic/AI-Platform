"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import ChatMessage, { MessageRole } from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}
 
interface GeminiTurn {
  role: "user" | "model";
  parts: { text: string }[];
}
 
/* ─── Error codes → user-friendly UI config ──────────────────────────────── */
interface ErrorConfig {
  title: string;
  detail: string;
  icon: "warning" | "clock" | "wifi" | "shield";
  canRetry: boolean;
}
 
const ERROR_CONFIG: Record<string, ErrorConfig> = {
  RATE_LIMIT: {
    title:    "Too many requests",
    detail:   "PrepAI is under heavy load. Wait a moment and try again.",
    icon:     "clock",
    canRetry: true,
  },
  AUTH_ERROR: {
    title:    "Authentication error",
    detail:   "API key issue on the server. Contact support if this persists.",
    icon:     "shield",
    canRetry: false,
  },
  NO_CANDIDATES: {
    title:    "Message blocked",
    detail:   "Your message was flagged by safety filters. Please rephrase it.",
    icon:     "shield",
    canRetry: false,
  },
  NETWORK: {
    title:    "Connection lost",
    detail:   "Check your internet connection and try again.",
    icon:     "wifi",
    canRetry: true,
  },
  DEFAULT: {
    title:    "Something went wrong",
    detail:   "PrepAI couldn't respond. Please try again.",
    icon:     "warning",
    canRetry: true,
  },
};
 
function getErrorConfig(code?: string): ErrorConfig {
  if (!code) return ERROR_CONFIG.DEFAULT;
  return ERROR_CONFIG[code] ?? ERROR_CONFIG.DEFAULT;
}
 
/* ─── Helpers ────────────────────────────────────────────────────────────── */
function getTime(): string {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}
function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
function buildHistory(messages: Message[]): GeminiTurn[] {
  return messages.map((m) => ({
    role:  m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));
}
 
/* ─── Error icon ─────────────────────────────────────────────────────────── */
function ErrorIcon({ type }: { type: ErrorConfig["icon"] }) {
  if (type === "clock") return (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 flex-shrink-0">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
  if (type === "wifi") return (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 flex-shrink-0">
      <path d="M2 7c4.4-4 11.6-4 16 0M5.5 10.5c2.5-2.3 6.5-2.3 9 0M9 14l1 1 1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
  if (type === "shield") return (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 flex-shrink-0">
      <path d="M10 2L4 5v5c0 3.5 2.5 6.7 6 7.5 3.5-.8 6-4 6-7.5V5l-6-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 8v2M10 12.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 flex-shrink-0">
      <path d="M10 3L2 17h16L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 9v3M10 14.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
 
/* ─── Error banner ───────────────────────────────────────────────────────── */
function ErrorBanner({
  code,
  rawMessage,
  onDismiss,
  onRetry,
  retryMessage,
}: {
  code?: string;
  rawMessage?: string;
  onDismiss: () => void;
  onRetry?: () => void;
  retryMessage?: string;
}) {
  const cfg = getErrorConfig(code);
 
  return (
    <div className="mx-3 mb-2 rounded-2xl border border-rose-500/20 bg-rose-500/[0.07] backdrop-blur-sm overflow-hidden">
      {/* Top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-rose-500/40 to-transparent" />
 
      <div className="flex items-start gap-3 px-4 py-3">
        <span className="mt-0.5 text-rose-400">
          <ErrorIcon type={cfg.icon} />
        </span>
 
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-rose-300 leading-tight">{cfg.title}</p>
          <p className="text-[12px] text-rose-400/70 mt-0.5 leading-snug">
            {rawMessage ?? cfg.detail}
          </p>
        </div>
 
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="flex-shrink-0 text-rose-500/60 hover:text-rose-400 transition-colors p-0.5"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
 
      {cfg.canRetry && onRetry && (
        <div className="px-4 pb-3 flex gap-2">
          <button
            onClick={onRetry}
            className="
              flex items-center gap-1.5 text-[12px] font-medium
              text-rose-300 hover:text-white
              bg-rose-500/10 hover:bg-rose-500/20
              border border-rose-500/20 hover:border-rose-500/40
              px-3 py-1.5 rounded-lg transition-all duration-150
            "
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
              <path d="M2 8a6 6 0 1 0 1.5-3.9L2 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 2v3.5h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Retry{retryMessage ? ` "${retryMessage.slice(0, 28)}${retryMessage.length > 28 ? "…" : ""}"` : ""}
          </button>
          <button
            onClick={onDismiss}
            className="text-[12px] text-slate-600 hover:text-slate-400 px-2 py-1.5 rounded-lg transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
 
/* ─── Empty state ────────────────────────────────────────────────────────── */
const SUGGESTIONS = [
  "Explain the Basic Structure doctrine",
  "Difference between Lok Sabha and Rajya Sabha?",
  "Summarise the Non-Cooperation Movement",
  "India's Five-Year Plans — key facts",
];
 
function EmptyState({ onPrompt }: { onPrompt: (p: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-5 shadow-lg shadow-indigo-900/20">
        <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
          <path d="M14 3L16.2 10.5H24L17.9 15L20.1 22.5L14 18L7.9 22.5L10.1 15L4 10.5H11.8L14 3Z" fill="url(#es-spark)" />
          <defs>
            <linearGradient id="es-spark" x1="4" y1="3" x2="24" y2="22.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a5b4fc" /><stop offset="1" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white tracking-tight mb-2">PrepAI — UPSC Mentor</h2>
      <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-10">
        Ask me anything — Polity, History, Economy, Geography, Current Affairs, or generate a quiz.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onPrompt(s)}
            className="
              text-left px-4 py-3.5 rounded-xl text-[13px] text-slate-400
              bg-[#16162a] border border-white/[0.07]
              hover:border-indigo-500/30 hover:text-slate-200 hover:bg-[#1a1a35]
              transition-all duration-150 leading-snug shadow-sm
            "
          >
            <span className="text-indigo-400 mr-2">✦</span>{s}
          </button>
        ))}
      </div>
    </div>
  );
}
 
/* ─── Chat header ────────────────────────────────────────────────────────── */
function ChatHeader({ onClear }: { onClear: () => void }) {
  return (
    <div className="
      flex-shrink-0 flex items-center justify-between
      px-5 h-[53px]
      border-b border-white/[0.06]
      bg-[#0d0d1a]/90 backdrop-blur-xl
    ">
      <div className="flex flex-col justify-center">
        <span className="text-[14px] font-semibold text-slate-200 leading-tight">UPSC General Studies</span>
        <span className="text-[11px] text-slate-600">Polity · History · Economy · Geography</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          PrepAI · Gemini
        </span>
        <button
          onClick={onClear}
          title="Clear chat"
          className="text-slate-600 hover:text-slate-300 p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]">
            <path d="M6 4h8M5 4l1 12h8l1-12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 8v5M12 8v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
 
/* ─── Typing indicator ───────────────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-5">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a2e] border border-indigo-500/30 flex items-center justify-center">
        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
          <path d="M10 2L11.5 7.5H17L12.5 11L14 17L10 13.5L6 17L7.5 11L3 7.5H8.5L10 2Z" fill="url(#ti-spark)" />
          <defs>
            <linearGradient id="ti-spark" x1="3" y1="2" x2="17" y2="17" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818cf8" /><stop offset="1" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="bg-[#16162a] border border-white/[0.07] rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5 shadow-md">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
          />
        ))}
      </div>
    </div>
  );
}
 
/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function ChatPage() {
  const [messages,   setMessages]   = useState<Message[]>([]);
  const [isLoading,  setIsLoading]  = useState(false);
  const [errorCode,  setErrorCode]  = useState<string | undefined>();
  const [errorMsg,   setErrorMsg]   = useState<string | undefined>();
  const [lastPrompt, setLastPrompt] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef  = useRef<AbortController | null>(null);
 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);
 
  useEffect(() => () => { abortRef.current?.abort(); }, []);
 
  /* ── Core send function ── */
  const sendMessage = useCallback(async (text: string) => {
    if (isLoading) return;
 
    setErrorCode(undefined);
    setErrorMsg(undefined);
    setLastPrompt(text);
 
    const userMsg: Message = { id: uid(), role: "user", content: text.trim(), timestamp: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
 
    const history = buildHistory(messages); // snapshot before new user turn
    abortRef.current = new AbortController();
 
    try {
      const res = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message: text.trim(), history }),
        signal:  abortRef.current.signal,
      });
 
      const data = await res.json();
 
      if (!res.ok) {
        // Remove the optimistic user message so they can retry cleanly
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
        setErrorCode(data?.code ?? "DEFAULT");
        setErrorMsg(data?.error);
        return;
      }
 
      if (!data.reply || typeof data.reply !== "string") {
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
        setErrorCode("EMPTY_RESPONSE");
        return;
      }
 
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "ai", content: data.reply, timestamp: getTime() },
      ]);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      setErrorCode("NETWORK");
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [isLoading, messages]);
 
  /* ── Retry last failed prompt ── */
  const handleRetry = useCallback(() => {
    if (!lastPrompt) return;
    setErrorCode(undefined);
    setErrorMsg(undefined);
    sendMessage(lastPrompt);
  }, [lastPrompt, sendMessage]);
 
  /* ── Clear chat ── */
  const handleClear = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setErrorCode(undefined);
    setErrorMsg(undefined);
    setIsLoading(false);
    setLastPrompt("");
  }, []);
 
  const hasError = Boolean(errorCode);
 
  return (
    <div className="flex h-screen overflow-hidden bg-[#0d0d1a]">
      <Sidebar />
 
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden lg:pl-64">
        {/* Mobile spacer */}
        <div className="lg:hidden h-14 flex-shrink-0" />
 
        <ChatHeader onClear={handleClear} />
 
        {/* Scrollable messages */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {messages.length === 0 && !isLoading && !hasError ? (
            <EmptyState onPrompt={sendMessage} />
          ) : (
            <div className="max-w-3xl mx-auto w-full pt-2 pb-6">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  timestamp={msg.timestamp}
                  avatarLabel="A"
                />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
 
        {/* Error banner — between scroll area and input */}
        {hasError && (
          <ErrorBanner
            code={errorCode}
            rawMessage={errorMsg}
            onDismiss={() => { setErrorCode(undefined); setErrorMsg(undefined); }}
            onRetry={handleRetry}
            retryMessage={lastPrompt}
          />
        )}
 
        {/* Sticky input footer */}
        <div className="flex-shrink-0 border-t border-white/[0.05] bg-[#0d0d1a]/90 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto w-full">
            <ChatInput
              onSend={sendMessage}
              isLoading={isLoading}
              placeholder="Ask about Polity, History, Economy, Current Affairs…"
            />
          </div>
          <p className="text-center text-[11px] text-slate-700 pb-3 -mt-2">
            PrepAI can make mistakes. Verify important facts from official sources.
          </p>
        </div>
      </div>
    </div>
  );
}
 