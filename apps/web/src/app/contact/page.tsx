"use client";

import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/ui/page-shell";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <PageShell narrow>
      <p className="text-xs font-medium uppercase tracking-wider text-accent sm:text-sm">
        Contact
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
        We&apos;d love to hear from you
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
        Questions about features, partnerships, or feedback — send a message and
        we&apos;ll get back to you.
      </p>

      {submitted ? (
        <div className="mt-8 rounded-xl border border-border bg-surface p-5 text-sm text-muted sm:mt-10 sm:p-6">
          Thanks for reaching out. This form is a placeholder until the backend
          is connected.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 w-full min-w-0 space-y-4 sm:mt-10 sm:space-y-5"
        >
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <label className="block min-w-0">
              <span className="text-xs font-medium text-foreground sm:text-sm">
                Name
              </span>
              <input
                type="text"
                name="name"
                required
                className="mt-1.5 w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-2.5 text-base text-foreground placeholder:text-muted focus:border-zinc-300 focus:outline-none sm:px-4 sm:py-3 sm:text-sm dark:focus:border-zinc-600"
                placeholder="Your name"
              />
            </label>
            <label className="block min-w-0">
              <span className="text-xs font-medium text-foreground sm:text-sm">
                Email
              </span>
              <input
                type="email"
                name="email"
                required
                className="mt-1.5 w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-2.5 text-base text-foreground placeholder:text-muted focus:border-zinc-300 focus:outline-none sm:px-4 sm:py-3 sm:text-sm dark:focus:border-zinc-600"
                placeholder="you@email.com"
              />
            </label>
          </div>
          <label className="block min-w-0">
            <span className="text-xs font-medium text-foreground sm:text-sm">
              Message
            </span>
            <textarea
              name="message"
              required
              rows={5}
              className="mt-1.5 w-full min-w-0 resize-y rounded-lg border border-border bg-surface px-3 py-2.5 text-base text-foreground placeholder:text-muted focus:border-zinc-300 focus:outline-none sm:px-4 sm:py-3 sm:text-sm dark:focus:border-zinc-600"
              placeholder="How can we help?"
            />
          </label>
          <Button type="submit" fullWidth>
            Send message
          </Button>
        </form>
      )}
    </PageShell>
  );
}
