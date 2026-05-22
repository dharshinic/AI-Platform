import { ButtonLink } from "@/components/ui/button";
import Link from "next/link";

const progressCards = [
  {
    label: "Overall progress",
    value: "42%",
    sub: "Prelims syllabus",
    trend: "+8% this week",
  },
  {
    label: "Topics covered",
    value: "28",
    sub: "of 64 units",
    trend: "4 completed today",
  },
  {
    label: "Study hours",
    value: "12.5h",
    sub: "This week",
    trend: "Goal: 20h",
  },
  {
    label: "Quiz accuracy",
    value: "76%",
    sub: "Last 10 quizzes",
    trend: "+3% vs last week",
  },
];

const streakDays = [
  { day: "M", done: true },
  { day: "T", done: true },
  { day: "W", done: true },
  { day: "T", done: true },
  { day: "F", done: true },
  { day: "S", done: false },
  { day: "S", done: false },
];

const recentQuizzes = [
  {
    title: "Indian Polity — Fundamental Rights",
    subject: "Polity",
    score: 82,
    total: 25,
    date: "Today",
  },
  {
    title: "Indian Economy — Fiscal Policy",
    subject: "Economy",
    score: 68,
    total: 20,
    date: "Yesterday",
  },
  {
    title: "Modern History — Freedom Movement",
    subject: "History",
    score: 91,
    total: 15,
    date: "2 days ago",
  },
  {
    title: "Geography — Climate & Vegetation",
    subject: "Geography",
    score: 74,
    total: 20,
    date: "3 days ago",
  },
];

function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 80
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : score >= 60
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
        : "bg-red-500/10 text-red-700 dark:text-red-400";

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone}`}
    >
      {score}%
    </span>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-accent sm:text-sm">
            Good morning
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Welcome back, Aspirant
          </h1>
          <p className="mt-1 text-sm text-muted sm:text-base">
            UPSC Prelims · Target: June 2026
          </p>
        </div>
        <ButtonLink href="/login" className="w-full shrink-0 sm:w-auto">
          New quiz
        </ButtonLink>
      </div>

      {/* Progress cards */}
      <div className="mt-6 grid min-w-0 grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4 sm:mt-8 sm:gap-4">
        {progressCards.map((card) => (
          <div
            key={card.label}
            className="min-w-0 rounded-2xl border border-border bg-surface p-4 sm:p-5"
          >
            <p className="text-xs text-muted sm:text-sm">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {card.value}
            </p>
            <p className="mt-0.5 text-xs text-muted">{card.sub}</p>
            <p className="mt-2 text-[11px] font-medium text-accent sm:text-xs">
              {card.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6 sm:mt-8">
        {/* Study streak */}
        <section className="min-w-0 rounded-2xl border border-border bg-surface p-5 sm:p-6 lg:col-span-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground sm:text-lg">
                Study streak
              </h2>
              <p className="mt-1 text-sm text-muted">Keep the momentum going</p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-lg" aria-hidden>
              🔥
            </span>
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
            5{" "}
            <span className="text-lg font-medium text-muted">days</span>
          </p>
          <div className="mt-5 flex justify-between gap-1">
            {streakDays.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={`flex h-9 w-full max-w-10 items-center justify-center rounded-lg text-xs font-medium sm:h-10 ${
                    d.done
                      ? "bg-accent text-background"
                      : "border border-dashed border-border bg-background text-muted"
                  }`}
                >
                  {d.done ? "✓" : ""}
                </div>
                <span className="text-[10px] text-muted sm:text-xs">{d.day}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">
            Study today to extend your streak to 6 days.
          </p>
        </section>

        {/* Recent quizzes */}
        <section className="min-w-0 rounded-2xl border border-border bg-surface lg:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-base font-semibold text-foreground sm:text-lg">
                Recent quizzes
              </h2>
              <p className="text-sm text-muted">Your latest practice sessions</p>
            </div>
            <Link
              href="/login"
              className="shrink-0 text-sm font-medium text-accent hover:opacity-80"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recentQuizzes.map((quiz) => (
              <li key={quiz.title}>
                <Link
                  href="/login"
                  className="flex min-w-0 flex-col gap-2 px-5 py-4 transition-colors hover:bg-background sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground sm:text-base">
                      {quiz.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {quiz.subject} · {quiz.score}/{quiz.total} correct ·{" "}
                      {quiz.date}
                    </p>
                  </div>
                  <ScoreBadge score={quiz.score} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Quick actions */}
      <section className="mt-6 rounded-2xl border border-dashed border-border bg-background/50 p-5 sm:mt-8 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground sm:text-base">
          Continue learning
        </h2>
        <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "AI Mentor", href: "/login" },
            { title: "Daily affairs", href: "/login" },
            { title: "Study plan", href: "/login" },
            { title: "PYQ analysis", href: "/login" },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/30"
            >
              {item.title} →
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
