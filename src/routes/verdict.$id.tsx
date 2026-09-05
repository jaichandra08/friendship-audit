import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BigButton,
  Screen,
  SeverityBar,
  TopBar,
  Wordmark,
} from "@/components/caught/primitives";
import { shareText } from "@/lib/caught/share";
import { getAudit } from "@/lib/caught/storage";
import type { Audit } from "@/lib/caught/types";

export const Route = createFileRoute("/verdict/$id")({
  head: () => ({
    meta: [
      { title: "Final verdict — CAUGHT™" },
      {
        name: "description",
        content:
          "The defence has been reviewed. See the final guilty percentage and the official sentence.",
      },
      { property: "og:title", content: "Final verdict — CAUGHT™" },
      {
        property: "og:description",
        content: "The defence has been reviewed. Here is the official sentence.",
      },
    ],
  }),
  component: VerdictPage,
});

function VerdictPage() {
  const { id } = useParams({ from: "/verdict/$id" });
  const navigate = useNavigate();
  const [audit, setAudit] = useState<Audit | null | undefined>(undefined);

  useEffect(() => {
    setAudit(getAudit(id) ?? null);
  }, [id]);

  if (audit === undefined) {
    return (
      <Screen className="flex items-center justify-center">
        <p className="animate-blink font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Delivering verdict…
        </p>
      </Screen>
    );
  }

  if (audit === null || audit.finalScore === undefined) {
    return (
      <Screen className="flex flex-col items-center justify-center text-center">
        <p className="font-display text-2xl">No final verdict yet</p>
        <div className="mt-6 w-full">
          <BigButton onClick={() => navigate({ to: "/home" })}>Back to home</BigButton>
        </div>
      </Screen>
    );
  }

  const delta = audit.initialScore - audit.finalScore;
  const explanation =
    delta > 0
      ? `The defendant successfully reduced the charge by ${delta}%.`
      : delta < 0
        ? `The defence made things worse. The charge increased by ${Math.abs(delta)}%.`
        : "The defence changed absolutely nothing.";

  const onShare = async () => {
    const text = `⚖️ AUDIT COMPLETE\n\n${audit.accuserName} vs ${audit.subjectName}\n\nINITIAL VERDICT: ${audit.initialScore}% GUILTY\nDEFENCE: ${audit.defence?.option}\nFINAL VERDICT: ${audit.finalScore}% GUILTY\n\n${explanation}\n\nOFFICIAL SENTENCE:\n${audit.finalSentence}\n\nCAUGHT™ · Case #${audit.caseNumber}`;
    const res = await shareText("CAUGHT™ Final Verdict", text);
    if (res === "copied") toast.success("Final verdict copied to clipboard.");
    if (res === "failed") toast.error("Couldn't share. Screenshot this instead.");
  };

  return (
    <Screen>
      <TopBar back="/home" title="Case closed" />
      <div className="animate-rise text-center">
        <p className="font-display text-4xl leading-tight">⚖️ AUDIT COMPLETE</p>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {audit.accuserName} vs {audit.subjectName}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Initial verdict
          </p>
          <p className="font-display text-3xl text-muted-foreground line-through">
            {audit.initialScore}% GUILTY
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Defence
          </p>
          <p className="font-display text-xl">{audit.defence?.option}</p>
          {audit.defence?.note ? (
            <p className="mt-1 text-sm text-muted-foreground">“{audit.defence.note}”</p>
          ) : null}
          {audit.defence?.screenshot ? (
            <img
              src={audit.defence.screenshot}
              alt="Counter-evidence submitted by the defendant"
              className="mt-3 w-full rounded-xl border border-border"
            />
          ) : null}
        </div>

        <div className="animate-pop rounded-2xl border border-guilty/60 bg-guilty/10 p-5 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Final verdict
          </p>
          <p className="font-display text-5xl text-guilty">{audit.finalScore}% GUILTY</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em]">
            {audit.finalVerdict}
          </p>
          <div className="mt-4">
            <SeverityBar score={audit.finalScore} />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{explanation}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Official sentence
          </p>
          <p className="font-display text-2xl uppercase leading-snug">
            {audit.finalSentence}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <BigButton onClick={onShare}>Share final verdict</BigButton>
        <BigButton variant="outline" onClick={() => navigate({ to: "/new" })}>
          New audit
        </BigButton>
        <BigButton
          variant="ghost"
          onClick={() => navigate({ to: "/receipt/$id", params: { id: audit.id } })}
        >
          View receipt
        </BigButton>
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Wordmark /> · Case #{audit.caseNumber}
      </p>
    </Screen>
  );
}
