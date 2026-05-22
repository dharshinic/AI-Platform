"use client";

import { useState } from "react";

const suggestions = [
  "Explain the basic structure doctrine",
  "10 MCQs on Indian Geography",
  "Summarize today's current affairs",
  "Create a 30-day Prelims study plan",
  "Difference between GDP and GNP",
  "Key articles in the Constitution",
];

export function PromptSection() {
  const [query, setQuery] = useState("");

  function handleSuggestion(text: string) {
    setQuery(text);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    // Placeholder until AI tutor route exists
    window.location.href = `/signup?prompt=${encodeURIComponent(query)}`;
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="rounded-2xl border border-border bg-surface shadow-sm transition-shadow focus-within:border-zinc-300 focus-within:shadow-md dark:focus-within:border-zinc-600">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about UPSC — polity, economy, history..."
            rows={3}
            className="w-full resize-none rounded-2xl bg-transparent px-4 py-4 text-[15px] leading-relaxed text-foreground placeholder:text-muted focus:outline-none sm:px-5"
          />
          <div className="flex items-center justify-between border-t border-border px-3 py-2 sm:px-4">
            <span className="text-xs text-muted">Powered by Gemini</span>
            <button
              type="submit"
              disabled={!query.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background transition-opacity enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Send message"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
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

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {suggestions.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => handleSuggestion(text)}
            className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs text-muted transition-colors hover:border-zinc-300 hover:text-foreground dark:hover:border-zinc-600"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
