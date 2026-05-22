"use client";

import { useState } from "react";

const suggestions = [
  "Explain basic structure doctrine",
  "10 MCQs on Geography",
  "Today's current affairs",
  "30-day Prelims plan",
  "GDP vs GNP",
  "Key Constitution articles",
];

export function PromptSection() {
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/chat?prompt=${encodeURIComponent(query)}`;
  }

  return (
    <div className="w-full min-w-0 max-w-2xl">
      <form onSubmit={handleSubmit} className="w-full min-w-0">
        <div className="rounded-xl border border-border bg-surface shadow-sm transition-shadow focus-within:border-zinc-300 focus-within:shadow-md sm:rounded-2xl dark:focus-within:border-zinc-600">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about UPSC — polity, economy, history..."
            rows={3}
            className="w-full min-w-0 resize-none rounded-xl bg-transparent px-3 py-3 text-base leading-relaxed text-foreground placeholder:text-muted focus:outline-none sm:rounded-2xl sm:px-5 sm:py-4 sm:text-[15px]"
          />
          <div className="flex min-w-0 items-center justify-between gap-2 border-t border-border px-3 py-2 sm:px-4">
            <span className="truncate text-[11px] text-muted sm:text-xs">
              Powered by Gemini
            </span>
            <button
              type="submit"
              disabled={!query.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition-opacity enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30 sm:h-11 sm:w-11"
              aria-label="Send message"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 sm:h-5 sm:w-5"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path
                  d="M12 19V5M5 12l7-7 7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap justify-center gap-1.5 sm:mt-5 sm:gap-2">
        {suggestions.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => setQuery(text)}
            className="max-w-full rounded-full border border-border bg-surface px-3 py-2 text-left text-[11px] leading-snug text-muted transition-colors hover:border-zinc-300 hover:text-foreground sm:px-3.5 sm:py-1.5 sm:text-xs sm:text-center dark:hover:border-zinc-600"
          >
            <span className="line-clamp-2 sm:line-clamp-none">{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
