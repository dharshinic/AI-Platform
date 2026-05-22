"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatSidebar, type ChatSession } from "./chat-sidebar";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const INITIAL_SESSIONS: ChatSession[] = [
  { id: "1", title: "Fundamental Rights — Article 14" },
  { id: "2", title: "GDP vs GNP explained" },
  { id: "3", title: "30-day Prelims revision plan" },
];

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Namaste! I'm your ExamAI mentor for UPSC and Indian competitive exams. Ask me about polity, economy, history, geography, or today's current affairs — I'll keep answers syllabus-focused and exam-ready.",
};

const SUGGESTIONS = [
  "Explain Article 14 with examples",
  "10 MCQs on Indian Geography",
  "Summarize today's current affairs",
  "Difference between GDP and GNP",
];

function mockAssistantReply(userText: string): string {
  const lower = userText.toLowerCase();
  if (lower.includes("article 14") || lower.includes("fundamental"))
    return "Article 14 guarantees equality before the law and equal protection of laws to all persons within India. For UPSC Prelims, remember: it's a **negative concept** (state shall not deny) while Article 15 is a specific application regarding discrimination. Key cases: *Maneka Gandhi v. Union of India* expanded its scope by linking it to Articles 19 and 21.";
  if (lower.includes("gdp") || lower.includes("gnp"))
    return "**GDP** measures the total value of goods and services produced **within India's borders** in a year. **GNP** includes income earned by Indian nationals **abroad** and excludes income of foreigners in India. For exams: GDP is preferred for domestic output analysis; GNP reflects national income.";
  if (lower.includes("mcq") || lower.includes("quiz"))
    return "I can generate a quiz for you. Which subject should we start with — Polity, Economy, Geography, or History? Mention difficulty (easy / medium / hard) and number of questions.";
  if (lower.includes("current affairs"))
    return "For today's brief, focus on: (1) government schemes in the news, (2) bilateral visits & agreements, (3) reports/index rankings, and (4) science & environment. Tell me your exam (UPSC Prelims/Mains) and I'll tailor the summary.";
  return "That's a great question for exam prep. I can break this down by syllabus topics, link it to previous year questions, or create a short revision note. Would you like a detailed explanation or a quick Prelims-ready summary?";
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full min-w-0 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-[min(100%,42rem)] min-w-0 gap-2.5 sm:gap-3 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold sm:h-9 sm:w-9 ${
            isUser
              ? "bg-zinc-700 text-zinc-200"
              : "bg-gradient-to-br from-teal-500/90 to-cyan-600/90 text-white"
          }`}
          aria-hidden
        >
          {isUser ? "You" : "AI"}
        </div>
        <div
          className={`min-w-0 rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed sm:px-4 sm:py-3 sm:text-[15px] ${
            isUser
              ? "bg-teal-600/20 text-zinc-100 ring-1 ring-teal-500/25"
              : "bg-zinc-800/80 text-zinc-200 ring-1 ring-zinc-700/50"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex gap-2.5 sm:gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500/90 to-cyan-600/90 text-xs font-semibold text-white sm:h-9 sm:w-9">
          AI
        </div>
        <div className="flex items-center gap-1 rounded-2xl bg-zinc-800/80 px-4 py-3 ring-1 ring-zinc-700/50">
          <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400" />
        </div>
      </div>
    </div>
  );
}

export function ChatInterface() {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState("1");
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    const prompt = new URLSearchParams(window.location.search).get("prompt");
    if (prompt?.trim()) {
      handleSend(prompt.trim());
      window.history.replaceState(null, "", "/chat");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  function handleNewChat() {
    const id = crypto.randomUUID();
    setSessions((prev) => [
      { id, title: "New conversation" },
      ...prev.slice(0, 9),
    ]);
    setActiveSessionId(id);
    setMessages([WELCOME_MESSAGE]);
    setInput("");
  }

  async function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content || isTyping) return;

    setInput("");
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeSessionId) return s;
        if (s.title === "New conversation" || messages.length <= 1) {
          return {
            ...s,
            title: content.slice(0, 40) + (content.length > 40 ? "…" : ""),
          };
        }
        return s;
      })
    );

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: mockAssistantReply(content),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const showEmptySuggestions = messages.length <= 1;

  return (
    <div className="relative flex h-full min-h-0 w-full min-w-0">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-[min(300px,88vw)] transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-72 lg:shrink-0 lg:translate-x-0 xl:w-80 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <ChatSidebar
          sessions={sessions}
          activeId={activeSessionId}
          onSelect={setActiveSessionId}
          onNewChat={handleNewChat}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <header className="relative z-10 flex shrink-0 items-center gap-3 border-b border-zinc-800/80 bg-zinc-950/80 px-3 py-2.5 backdrop-blur-md sm:px-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 lg:hidden"
            aria-label="Open sidebar"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold text-zinc-100 sm:text-base">
              AI Mentor
            </h1>
            <p className="truncate text-xs text-zinc-500">
              UPSC · SSC · Banking — syllabus-aligned answers
            </p>
          </div>
          <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-2.5 py-1 text-[11px] font-medium text-teal-400 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Online
          </span>
        </header>

        <div
          ref={scrollRef}
          className="relative z-10 min-h-0 flex-1 overflow-y-auto scroll-smooth px-3 py-4 sm:px-4 md:px-6"
        >
          <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-5 sm:gap-6">
            {showEmptySuggestions && (
              <div className="flex flex-col items-center py-6 text-center sm:py-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 ring-1 ring-teal-500/30">
                  <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-teal-400" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <path d="M12 3L4 9v12h16V9l-8-6z" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="mt-4 text-sm text-zinc-400">
                  Ask anything for your exam prep
                </p>
                <div className="mt-4 flex w-full max-w-lg flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSend(s)}
                      className="rounded-full border border-zinc-700/80 bg-zinc-800/50 px-3 py-2 text-left text-xs text-zinc-300 transition-colors hover:border-teal-500/40 hover:text-zinc-100 sm:text-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} className="h-px shrink-0" aria-hidden />
          </div>
        </div>

        <div className="relative z-10 shrink-0 border-t border-zinc-800/80 bg-zinc-950/90 px-3 py-3 backdrop-blur-md sm:px-4 sm:py-4 md:px-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="mx-auto flex w-full max-w-3xl min-w-0 items-end gap-2 sm:gap-3"
          >
            <div className="min-w-0 flex-1 rounded-2xl border border-zinc-700/80 bg-zinc-900/80 shadow-lg shadow-black/20 ring-1 ring-zinc-800 focus-within:border-teal-500/50 focus-within:ring-teal-500/20">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about polity, economy, history, current affairs..."
                rows={1}
                className="max-h-32 w-full resize-none rounded-2xl bg-transparent px-3 py-3 text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none sm:px-4 sm:py-3.5 sm:text-[15px]"
                style={{ minHeight: "2.75rem" }}
                onInput={(e) => {
                  const t = e.currentTarget;
                  t.style.height = "auto";
                  t.style.height = `${Math.min(t.scrollHeight, 128)}px`;
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white transition-opacity enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:w-12"
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
          <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-zinc-600 sm:text-[11px]">
            ExamAI can make mistakes. Verify important facts from standard sources.
          </p>
        </div>
      </div>
    </div>
  );
}
