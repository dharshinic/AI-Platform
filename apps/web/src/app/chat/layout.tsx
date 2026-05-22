import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Mentor — ExamAI",
  description: "Chat with your AI exam preparation mentor",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark relative flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col overflow-hidden bg-zinc-950 text-zinc-100 sm:h-[calc(100dvh-4rem)]">
      {children}
    </div>
  );
}
