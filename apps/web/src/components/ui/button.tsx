import Link from "next/link";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";

const base =
  "inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:min-h-12 sm:px-6";

const variants = {
  primary: `${base} bg-foreground text-background hover:opacity-90`,
  secondary: `${base} border border-border bg-surface text-foreground hover:border-zinc-300 dark:hover:border-zinc-600`,
  ghost: `${base} bg-transparent text-muted hover:text-foreground`,
} as const;

type ButtonVariant = keyof typeof variants;

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
};

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  fullWidth,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variants[variant]} ${fullWidth ? "w-full sm:w-auto" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  fullWidth,
  className = "",
  children,
  href,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`${variants[variant]} ${fullWidth ? "w-full sm:w-auto" : ""} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
