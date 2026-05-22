"use client";

import { useState, useRef, useCallback, KeyboardEvent, ChangeEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  isLoading = false,
  placeholder = "Ask anything about UPSC, Current Affairs, History…",
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    resizeTextarea();
  };

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isLoading, disabled, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = value.trim().length === 0;

  return (
    <div className="w-full px-4 pb-6 pt-2">
      {/* Outer glow wrapper */}
      <div
        className={`
          relative mx-auto max-w-3xl rounded-2xl
          bg-[#1a1a2e]/80 backdrop-blur-xl
          border border-white/[0.08]
          shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_40px_rgba(0,0,0,0.5)]
          transition-all duration-300
          ${!isEmpty && !disabled ? "shadow-[0_0_0_1px_rgba(99,102,241,0.3),0_8px_48px_rgba(99,102,241,0.12)]" : ""}
        `}
      >
        {/* Top accent line */}
        <div
          className={`
            absolute inset-x-0 top-0 h-px rounded-t-2xl
            bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent
            transition-opacity duration-300
            ${!isEmpty ? "opacity-100" : "opacity-0"}
          `}
        />

        <div className="flex items-end gap-3 p-3">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            rows={1}
            className={`
              flex-1 resize-none bg-transparent
              text-[15px] leading-relaxed tracking-wide
              text-slate-100 placeholder-slate-500
              outline-none border-none
              py-2.5 px-2
              min-h-[44px] max-h-[200px]
              scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent
              transition-colors duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              font-[family-name:var(--font-sans,ui-sans-serif)]
            `}
            style={{ fontFamily: "'DM Sans', 'Inter', ui-sans-serif" }}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={isEmpty || isLoading || disabled}
            aria-label="Send message"
            className={`
              flex-shrink-0 flex items-center justify-center
              w-10 h-10 rounded-xl
              transition-all duration-200 ease-out
              focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60
              ${
                !isEmpty && !isLoading && !disabled
                  ? "bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-[0_2px_16px_rgba(99,102,241,0.45)] cursor-pointer"
                  : "bg-white/[0.06] cursor-not-allowed opacity-40"
              }
            `}
          >
            {isLoading ? (
              /* Spinner */
              <span className="flex items-center justify-center w-5 h-5">
                <span
                  className="block w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"
                  style={{ animationDuration: "0.7s" }}
                />
              </span>
            ) : (
              /* Arrow up icon */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-[18px] h-[18px] text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between px-5 pb-3 pt-0">
          <p className="text-[11px] text-slate-600 tracking-wide">
            <span className="text-slate-500">↵</span> to send &nbsp;·&nbsp;{" "}
            <span className="text-slate-500">⇧ ↵</span> for new line
          </p>
          <p className="text-[11px] text-slate-600 tracking-wide">
            UPSC AI Assistant
          </p>
        </div>
      </div>
    </div>
  );
}