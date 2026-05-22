import { FeaturesSection } from "@/components/home/features-section";
import { ButtonLink } from "@/components/ui/button";
import { PageShell } from "@/components/ui/page-shell";

const upcoming = [
  "Answer writing feedback for Mains",
  "Optional subject deep dives",
  "Hindi + English bilingual mode",
  "Offline notes sync",
];

export default function FeaturesPage() {
  return (
    <PageShell>
      <p className="text-xs font-medium uppercase tracking-wider text-accent sm:text-sm">
        Features
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
        Everything you need to prepare
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        From instant doubt-solving to structured revision — ExamAI combines core
        prep tools in a clean, distraction-free interface.
      </p>

      <div className="mt-10 min-w-0 sm:mt-12">
        <FeaturesSection showHeader={false} />
      </div>

      <section className="mt-10 min-w-0 rounded-xl border border-border bg-surface p-4 sm:mt-12 sm:rounded-2xl sm:p-6 md:p-8">
        <h2 className="text-base font-medium text-foreground sm:text-lg">
          Coming soon
        </h2>
        <ul className="mt-4 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          {upcoming.map((item) => (
            <li
              key={item}
              className="flex min-w-0 items-start gap-2 text-sm text-muted"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="min-w-0 break-words">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <ButtonLink href="/login" className="mt-8 sm:mt-10" fullWidth>
        Start free
      </ButtonLink>
    </PageShell>
  );
}
