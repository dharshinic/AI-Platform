import { ButtonLink } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative isolate w-full min-w-0 overflow-hidden">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute left-1/2 top-0 h-[min(480px,70vw)] w-[min(720px,120vw)] -translate-x-1/2 -translate-y-1/4 rounded-full bg-accent/[0.07] blur-3xl dark:bg-accent/[0.12]" />
        <div className="absolute -right-16 top-1/3 h-48 w-48 rounded-full bg-teal-400/10 blur-3xl dark:bg-teal-400/15 sm:h-64 sm:w-64" />
        <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/15 sm:h-56 sm:w-56" />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
          style={{
            backgroundImage: `
              linear-gradient(to right, color-mix(in srgb, var(--border) 40%, transparent) 1px, transparent 1px),
              linear-gradient(to bottom, color-mix(in srgb, var(--border) 40%, transparent) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 0%, black 20%, transparent 75%)",
          }}
        />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-10 pt-10 text-center sm:px-6 sm:pb-14 sm:pt-14 md:pb-16 md:pt-16 lg:px-8 lg:pt-20">
        <p className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-border/80 bg-surface/80 px-3 py-1.5 text-[11px] font-medium text-muted shadow-sm backdrop-blur-sm sm:gap-2.5 sm:px-4 sm:text-xs">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          AI tutor · UPSC · SSC · Banking & more
        </p>

        <h1 className="mt-6 max-w-4xl text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-foreground min-[375px]:text-3xl sm:mt-8 sm:text-4xl sm:leading-[1.12] md:text-5xl lg:text-6xl lg:leading-[1.08]">
          Crack India&apos;s toughest exams with{" "}
          <span className="bg-gradient-to-r from-foreground via-accent to-teal-600 bg-clip-text text-transparent dark:from-foreground dark:via-accent dark:to-teal-400">
            intelligent prep
          </span>
        </h1>

        <p className="mt-5 max-w-xl px-1 text-sm leading-relaxed text-muted sm:mt-6 sm:text-base md:max-w-2xl md:text-lg md:leading-relaxed">
          ExamAI combines syllabus-aware tutoring, adaptive quizzes, and daily
          current affairs — so you revise faster and stay exam-ready.
        </p>

        <div className="mt-8 flex w-full min-w-0 max-w-md flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <ButtonLink
            href="/login"
            fullWidth
            className="shadow-sm shadow-accent/10 ring-1 ring-accent/20"
          >
            Start preparing free
          </ButtonLink>
          <ButtonLink href="/features" variant="secondary" fullWidth>
            Explore features
          </ButtonLink>
        </div>

        <p className="mt-6 text-[11px] text-muted sm:text-xs">
          No credit card · Syllabus-aligned ·{" "}
          <Link
            href="/about"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            Learn more
          </Link>
        </p>

        {/* Futuristic accent line */}
        <div
          className="mt-10 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-accent/50 to-transparent sm:mt-12 sm:max-w-md"
          aria-hidden
        />
      </div>
    </section>
  );
}
