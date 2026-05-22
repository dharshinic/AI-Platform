import { ButtonLink } from "@/components/ui/button";
import { PageShell } from "@/components/ui/page-shell";

const values = [
  {
    title: "Syllabus-first",
    description:
      "Every answer and quiz is grounded in UPSC Prelims and Mains scope — not generic chatbot fluff.",
  },
  {
    title: "Built for India",
    description:
      "Current affairs, polity, and exam patterns tailored to Indian competitive examinations.",
  },
  {
    title: "AI with guardrails",
    description:
      "Gemini-powered tutoring with structured outputs you can revise, save, and revisit.",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <p className="text-xs font-medium uppercase tracking-wider text-accent sm:text-sm">
        About ExamAI
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
        Smarter prep for India&apos;s toughest exams
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        ExamAI helps UPSC and other competitive exam aspirants study with an AI
        tutor, adaptive quizzes, personalized planners, and daily current
        affairs — in one minimal workspace designed for focus.
      </p>

      <div className="mt-10 grid min-w-0 grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {values.map((item) => (
          <article
            key={item.title}
            className="min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-5"
          >
            <h2 className="text-sm font-medium text-foreground sm:text-base">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {item.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-10 flex min-w-0 flex-col gap-3 sm:mt-12 sm:flex-row sm:flex-wrap">
        <ButtonLink href="/features">Explore features</ButtonLink>
        <ButtonLink href="/contact" variant="secondary">
          Get in touch
        </ButtonLink>
      </div>
    </PageShell>
  );
}
