import { type ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  /** Center content (home hero). Default: left-aligned page content. */
  centered?: boolean;
  narrow?: boolean;
};

export function PageShell({
  children,
  className = "",
  centered = false,
  narrow = false,
}: PageShellProps) {
  const maxWidth = narrow ? "max-w-3xl" : "max-w-6xl";

  return (
    <div
      className={`mx-auto w-full min-w-0 ${maxWidth} px-4 py-10 sm:px-6 sm:py-12 md:py-14 lg:px-8 lg:py-16 ${
        centered ? "flex flex-col items-center text-center" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
