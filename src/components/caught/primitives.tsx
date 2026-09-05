import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Screen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("mx-auto min-h-dvh w-full max-w-md px-5 pb-28 pt-6", className)}>
      {children}
    </main>
  );
}

export function TopBar({ back, title }: { back?: string; title?: string }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      {back ? (
        <Link
          to={back}
          className="rounded-full border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors active:bg-secondary"
        >
          ← Back
        </Link>
      ) : (
        <span />
      )}
      {title ? (
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {title}
        </span>
      ) : null}
      <span className="w-14" />
    </div>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display tracking-tight", className)}>
      CAUGHT<sup className="text-[0.45em] align-super">™</sup>
    </span>
  );
}

export function BigButton({
  children,
  onClick,
  disabled,
  variant = "primary",
  className,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full rounded-2xl px-5 py-4 font-display text-base uppercase tracking-wide transition-all duration-150 active:scale-[0.97] disabled:opacity-40",
        variant === "primary" &&
          "bg-primary text-primary-foreground shadow-[0_10px_30px_-12px_var(--guilty)]",
        variant === "outline" && "border border-border bg-card text-foreground",
        variant === "ghost" && "text-muted-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function OptionButton({
  children,
  selected,
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "min-h-14 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-150 active:scale-[0.97]",
        selected
          ? "border-primary bg-primary/15 text-foreground shadow-[0_0_0_1px_var(--guilty)]"
          : "border-border bg-card text-foreground/90",
        disabled && "opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function ToneText({
  score,
  children,
  className,
}: {
  score: number;
  children: ReactNode;
  className?: string;
}) {
  const color =
    score < 30 ? "text-innocent" : score < 50 ? "text-suspicious" : "text-guilty";
  return <span className={cn(color, className)}>{children}</span>;
}

export function SeverityBar({ score }: { score: number }) {
  const color = score < 30 ? "var(--innocent)" : score < 50 ? "var(--suspicious)" : "var(--guilty)";
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-black/10">
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${score}%`, backgroundColor: color }}
      />
    </div>
  );
}
