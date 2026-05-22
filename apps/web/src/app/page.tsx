import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { PromptSection } from "@/components/home/prompt-section";
import { ButtonLink } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="text-lg font-medium tracking-tight text-foreground sm:text-xl">
            Ask your first question
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted sm:text-[15px]">
            Try the AI tutor — polity, economy, history, or today&apos;s affairs.
          </p>
          <div className="mt-6 w-full min-w-0 sm:mt-8">
            <PromptSection />
          </div>
          <p className="mt-5 max-w-sm text-[11px] leading-relaxed text-muted sm:text-xs">
            Free to try ·{" "}
            <Link
              href="/login"
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>

      <div className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16 md:pb-20 lg:px-8">
        <FeaturesSection />

        <section className="mx-auto mt-12 w-full min-w-0 max-w-2xl rounded-xl border border-border bg-surface px-4 py-8 text-center sm:mt-16 sm:rounded-2xl sm:px-8 sm:py-10 md:mt-20 md:px-10">
          <h2 className="text-base font-medium text-foreground sm:text-lg">
            Start preparing today
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Join aspirants using AI to revise faster and stay consistent.
          </p>
          <ButtonLink href="/login" className="mt-5 sm:mt-6" fullWidth>
            Get started for free
          </ButtonLink>
        </section>
      </div>
    </>
  );
}
