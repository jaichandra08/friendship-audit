import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BigButton, Screen, Wordmark } from "@/components/caught/primitives";
import { loadAudits } from "@/lib/caught/storage";
import type { Audit } from "@/lib/caught/types";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Your audits — CAUGHT™" },
      {
        name: "description",
        content: "Start a new friendship audit or reopen your recent verdicts.",
      },
      { property: "og:title", content: "Your audits — CAUGHT™" },
      {
        property: "og:description",
        content: "Start a new friendship audit or reopen your recent verdicts.",
      },
    ],
  }),
  component: Home,
});

function badge(score: number) {
  if (score >= 70) return { dot: "🔴", label: "GUILTY", cls: "text-guilty" };
  if (score >= 30) return { dot: "🟡", label: "REPEAT OFFENDER", cls: "text-suspicious" };
  return { dot: "🟢", label: "INNOCENT", cls: "text-innocent" };
}

function Home() {
  const navigate = useNavigate();
  const [audits, setAudits] = useState<Audit[]>([]);

  useEffect(() => {
    setAudits(loadAudits());
  }, []);

  return (
    <Screen>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl">
          <Wordmark />
        </h1>
        <Link
          to="/new"
          className="rounded-full bg-primary px-4 py-2 font-display text-xs uppercase tracking-wide text-primary-foreground active:scale-95"
        >
          + New Audit
        </Link>
      </div>

      <section className="animate-rise rounded-3xl border border-border bg-card p-6">
        <p className="font-display text-2xl leading-tight">🧾 WHO ARE WE AUDITING?</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Create an audit about someone who has committed suspicious friendship
          behaviour.
        </p>
        <div className="mt-5">
          <BigButton onClick={() => navigate({ to: "/new" })}>Create an audit</BigButton>
        </div>
      </section>

      <h2 className="mb-3 mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Recent audits
      </h2>
      <div className="space-y-3">
        {audits.map((a) => {
          const b = badge(a.finalScore ?? a.initialScore);
          return (
            <Link
              key={a.id}
              to="/receipt/$id"
              params={{ id: a.id }}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 transition-transform active:scale-[0.98]"
            >
              <div className="min-w-0">
                <p className="font-display text-lg">{a.subjectName}</p>
                <p className="truncate text-sm text-muted-foreground">
                  “{a.offenceLabel}”
                </p>
              </div>
              <span
                className={`shrink-0 font-mono text-[10px] uppercase tracking-widest ${b.cls}`}
              >
                {b.dot} {b.label}
              </span>
            </Link>
          );
        })}
        {audits.length === 0 ? (
          <p className="text-sm text-muted-foreground">No audits yet. Someone is safe.</p>
        ) : null}
      </div>
    </Screen>
  );
}
