const features = [
  {
    title: "AI Tutor",
    description: "Ask doubts in plain English. Get syllabus-aligned answers instantly.",
    icon: (
      <path
        d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Quiz Generator",
    description: "Practice MCQs tailored to Prelims topics and difficulty.",
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
    description: "Personalized schedules that adapt to your exam date and pace.",
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
    description: "Daily summaries linked to GS papers and probable exam angles.",
    icon: (
      <path
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="w-full max-w-4xl px-4 sm:px-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="group rounded-xl border border-border bg-surface p-5 transition-colors hover:border-zinc-300 dark:hover:border-zinc-600"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors group-hover:border-accent/30 group-hover:text-accent">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-[18px] w-[18px]"
                stroke="currentColor"
                strokeWidth="1.75"
                aria-hidden
              >
                {feature.icon}
              </svg>
            </div>
            <h3 className="text-sm font-medium text-foreground">
              {feature.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
