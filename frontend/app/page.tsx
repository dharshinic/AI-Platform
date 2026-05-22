import { FeatureGrid } from "@/components/home/feature-grid";
import { Footer } from "@/components/home/footer";
import { Header } from "@/components/home/header";
import { PromptSection } from "@/components/home/prompt-section";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main className="flex flex-1 flex-col items-center px-4 pt-24 pb-16 sm:px-6 sm:pt-28">
        <section className="flex w-full max-w-3xl flex-col items-center text-center">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            AI-powered UPSC preparation
          </p>

          <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl sm:leading-tight">
            Your syllabus coach,
            <br />
            <span className="text-muted">one question away.</span>
          </h1>

          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            Practice smarter with an AI tutor, custom quizzes, study plans, and
            daily current affairs — all aligned to the UPSC syllabus.
          </p>

          <div className="mt-10 w-full flex justify-center">
            <PromptSection />
          </div>

          <p className="mt-6 text-xs text-muted">
            Free to try · No credit card ·{" "}
            <Link
              href="/signup"
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              Create an account
            </Link>
          </p>
        </section>

        <div className="mt-20 w-full flex justify-center">
          <FeatureGrid />
        </div>

        <section
          id="pricing"
          className="mt-20 w-full max-w-2xl rounded-2xl border border-border bg-surface px-6 py-10 text-center sm:px-10"
        >
          <h2 className="text-lg font-medium text-foreground">
            Start preparing today
          </h2>
          <p className="mt-2 text-sm text-muted">
            Join thousands of aspirants using AI to revise faster and stay
            consistent.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Get started for free
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
