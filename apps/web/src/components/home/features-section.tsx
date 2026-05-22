import Link from "next/link";
import { type ReactNode } from "react";

type Feature = {
  title: string;
  description: string;
  icon: ReactNode;
};

const features: Feature[] = [
  {
    title: "AI Mentor",
    description:
      "Get syllabus-aligned explanations in plain English. Doubts on polity, economy, or optional subjects — answered instantly.",
    icon: (
      <path
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Quiz Generator",
    description:
      "Generate Prelims-style MCQs by topic and difficulty. Practice until concepts stick with fresh questions every session.",
    icon: (
      <path
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Study Planner",
    description:
      "Personalized daily schedules based on your exam date, subjects covered, and available hours — adjusted as you progress.",
    icon: (
      <path
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Current Affairs",
    description:
      "Daily briefs mapped to GS papers with probable exam angles — so you revise news that actually matters for Prelims and Mains.",
    icon: (
      <path
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "PYQ Analysis",
    description:
      "Spot trends across previous year papers — recurring topics, difficulty shifts, and high-yield areas to prioritize in revision.",
    icon: (
      <path
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <article className="group relative flex min-w-0 flex-col rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:border-accent/30 hover:shadow-md hover:shadow-accent/5 sm:p-6">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent transition-colors group-hover:bg-accent/15 sm:h-12 sm:w-12">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 sm:h-[22px] sm:w-[22px]"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden
        >
          {feature.icon}
        </svg>
      </div>
      <h3 className="text-base font-semibold tracking-tight text-foreground">
        {feature.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {feature.description}
      </p>
      <Link
        href="/features"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition-opacity hover:opacity-80"
      >
        Learn more
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </article>
  );
}

type FeaturesSectionProps = {
  showHeader?: boolean;
  className?: string;
};

export function FeaturesSection({
  showHeader = true,
  className = "",
}: FeaturesSectionProps) {
  return (
    <section
      id="features"
      className={`w-full min-w-0 ${className}`}
      aria-labelledby={showHeader ? "features-heading" : undefined}
    >
      {showHeader && (
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10 md:mb-12">
          <p className="text-xs font-medium uppercase tracking-wider text-accent sm:text-sm">
            Platform features
          </p>
          <h2
            id="features-heading"
            className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl"
          >
            One workspace for complete exam prep
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Five AI-powered tools designed for UPSC, SSC, Banking, and other
            Indian competitive examinations.
          </p>
        </div>
      )}

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {features.slice(0, 3).map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
      <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5 lg:mx-auto lg:mt-6 lg:max-w-3xl lg:grid-cols-2 lg:gap-6">
        {features.slice(3).map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  );
}

/** @deprecated Use FeaturesSection */
export function FeatureGrid(props: FeaturesSectionProps) {
  return <FeaturesSection {...props} />;
}
