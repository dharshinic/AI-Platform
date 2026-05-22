"use client";

import { useState, useRef, useEffect } from "react";
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

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function getTime() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

/* ─── Seed messages ──────────────────────────────────────────────────────── */
const SEED_MESSAGES: Message[] = [
  {
    id: "1",
    role: "user",
    content: "What are the Directive Principles of State Policy in the Indian Constitution?",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    role: "ai",
    content: `The **Directive Principles of State Policy (DPSP)** are enshrined in **Part IV (Articles 36–51)** of the Indian Constitution. They are non-justiciable guidelines for the state to achieve a **socio-economic democracy**.

## Key Features

- Borrowed from the **Irish Constitution**
- Not enforceable by courts, but **fundamental in governance**
- Supplement Fundamental Rights by promoting **positive obligations** on the State

## Classification of DPSPs

**Socialistic Principles**
- Equal pay for equal work (Art. 39d)
- Right to adequate means of livelihood
- Prevention of concentration of wealth

**Gandhian Principles**
- Village panchayat organisation (Art. 40)
- Promotion of cottage industries
- Prohibition of cow slaughter (Art. 48)

**Liberal-Intellectual Principles**
- Uniform Civil Code (Art. 44)
- Separation of judiciary from executive (Art. 50)
- Participation in international peace (Art. 51)

> **UPSC Tip:** The 42nd Amendment (1976) gave DPSPs precedence over Fundamental Rights in certain cases — a highly tested topic in Prelims.`,
    timestamp: "10:30 AM",
  },
  {
    id: "3",
    role: "user",
    content: "How are DPSPs different from Fundamental Rights?",
    timestamp: "10:32 AM",
  },
  {
    id: "4",
    role: "ai",
    content: `Great question! Here's a crisp comparison for your revision:

## DPSP vs Fundamental Rights

| Aspect | Fundamental Rights | DPSPs |
|---|---|---|
| **Part** | Part III (Art. 12–35) | Part IV (Art. 36–51) |
| **Nature** | Justiciable | Non-justiciable |
| **Obligation** | Negative (State shall not) | Positive (State shall) |
| **Focus** | Individual liberty | Social & economic justice |
| **Suspension** | Possible (during Emergency) | Cannot be suspended |

## The Conflict & Resolution

- **Champakam Dorairajan (1951)** — FRs prevail over DPSPs
- **Golaknath (1967)** — Parliament cannot amend FRs to implement DPSPs
- **Kesavananda Bharati (1973)** — Basic Structure doctrine established
- **Minerva Mills (1980)** — Balance between FRs and DPSPs is part of Basic Structure

> Both together form the **"conscience of the Constitution"** — a phrase often quoted in UPSC Mains answers.`,
    timestamp: "10:33 AM",
  },
];

/* ─── Empty state ────────────────────────────────────────────────────────── */
function EmptyState({ onPrompt }: { onPrompt: (p: string) => void }) {
  const suggestions = [
    "Explain the Basic Structure doctrine",
    "What is the difference between Lok Sabha and Rajya Sabha?",
    "Summarise the Non-Cooperation Movement",
    "Key facts about India's Five-Year Plans",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-5 shadow-lg shadow-indigo-900/20">
        <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
          <path
            d="M14 3L16.2 10.5H24L17.9 15L20.1 22.5L14 18L7.9 22.5L10.1 15L4 10.5H11.8L14 3Z"
            fill="url(#es-spark)"
          />
          <defs>
            <linearGradient id="es-spark" x1="4" y1="3" x2="24" y2="22.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a5b4fc" />
              <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
        PrepAI — UPSC Assistant
      </h2>
      <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-10">
        Ask anything — Polity, History, Economy, Geography, Current Affairs, or generate a quiz.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {suggestions.map((s) => (
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
            <span className="text-indigo-400 mr-2">✦</span>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Chat header ────────────────────────────────────────────────────────── */
function ChatHeader() {
  return (
    <div className="
      flex-shrink-0
      flex items-center justify-between
      px-5 h-[53px]
      border-b border-white/[0.06]
      bg-[#0d0d1a]/90 backdrop-blur-xl
    ">
      <div className="flex flex-col justify-center">
        <span className="text-[14px] font-semibold text-slate-200 leading-tight">
          UPSC General Studies
        </span>
        <span className="text-[11px] text-slate-600">
          Polity · History · Economy · Geography
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          PrepAI · Gemini
        </span>
        <button
          className="text-slate-600 hover:text-slate-300 p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
          aria-label="More options"
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]">
            <circle cx="10" cy="4"  r="1.2" fill="currentColor" />
            <circle cx="10" cy="10" r="1.2" fill="currentColor" />
            <circle cx="10" cy="16" r="1.2" fill="currentColor" />
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
          <path
            d="M10 2L11.5 7.5H17L12.5 11L14 17L10 13.5L6 17L7.5 11L3 7.5H8.5L10 2Z"
            fill="url(#ti-spark)"
          />
          <defs>
            <linearGradient id="ti-spark" x1="3" y1="2" x2="17" y2="17" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818cf8" />
              <stop offset="1" stopColor="#6366f1" />
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
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `That's a great UPSC question! Here's a structured answer:\n\n**${text}**\n\nThis topic is covered under **General Studies Paper II** (Polity & Governance). Key points to remember:\n\n- Always link your answer to constitutional provisions\n- Use landmark Supreme Court judgments where relevant\n- Keep Mains answers within **150–200 words** per question\n\n> Connect to the Gemini API to get real AI-powered answers for your UPSC prep.`,
        timestamp: getTime(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1800);
  };

  return (
    /*
     * LAYOUT EXPLANATION
     * ------------------
     * The three-layer flex trick that makes ChatGPT-style layout work:
     *
     * Layer 1 — Root div: h-screen + overflow-hidden
     *   Locks the entire viewport. Nothing outside this scrolls.
     *
     * Layer 2 — Main column: flex-col + overflow-hidden
     *   Children stack vertically. This column itself must NOT scroll.
     *
     * Layer 3 — Messages div: flex-1 + min-h-0 + overflow-y-auto
     *   flex-1  → takes all remaining space between header and input
     *   min-h-0 → overrides flexbox default min-height so it CAN shrink
     *   overflow-y-auto → ONLY this region scrolls
     *
     * Header and Input footer both use flex-shrink-0 so they never compress.
     */
    <div className="flex h-screen overflow-hidden bg-[#0d0d1a]">

      {/* Sidebar (internally uses fixed positioning) */}
      <Sidebar />

      {/*
        Main content column.
        lg:pl-64 offsets the fixed sidebar width on desktop.
        On mobile the sidebar becomes a drawer, so no offset needed.
      */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden lg:pl-64">

        {/* Mobile top-bar spacer (Sidebar renders the actual bar at h-14) */}
        <div className="lg:hidden h-14 flex-shrink-0" />

        {/* Header — never scrolls */}
        <ChatHeader />

        {/* ── SCROLL REGION ── only this div scrolls ── */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {messages.length === 0 ? (
            <EmptyState onPrompt={handleSend} />
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

        {/* Input footer — never scrolls, always visible */}
        <div className="flex-shrink-0 border-t border-white/[0.05] bg-[#0d0d1a]/90 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto w-full">
            <ChatInput
              onSend={handleSend}
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