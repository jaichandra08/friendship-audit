import { SeverityBar } from "./primitives";
import { getPersonality } from "@/lib/caught/personalities";
import { minutesLost } from "@/lib/caught/scoring";
import type { Audit } from "@/lib/caught/types";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="font-mono text-[11px] uppercase tracking-widest text-paper-muted">
        {label}
      </span>
      <span className="text-right font-mono text-sm font-semibold">{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="my-4 border-t border-dashed border-black/25" />;
}

function SectionTitle({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-paper-muted">
      {children}
    </p>
  );
}

export function Receipt({ audit, final = false }: { audit: Audit; final?: boolean }) {
  const p = getPersonality(audit.personality);
  const score = final ? (audit.finalScore ?? audit.initialScore) : audit.initialScore;
  const verdict = final ? (audit.finalVerdict ?? audit.initialVerdict) : audit.initialVerdict;
  const sentence = final ? (audit.finalSentence ?? audit.sentence) : audit.sentence;
  const minutes = minutesLost(audit.evidence) || 47;
  const late = audit.evidence.howLate ?? "a while";
  const priors = audit.evidence.priors ?? "0";

  return (
    <div className="receipt-paper zigzag-bottom relative overflow-hidden rounded-t-2xl pb-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
      <div className="px-6 pt-7">
        <div className="text-center">
          <p className="font-display text-3xl tracking-tight">
            CAUGHT<sup className="align-super text-[0.4em]">™</sup>
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-paper-muted">
            Official Friendship Audit
          </p>
          <p className="mt-2 font-mono text-[11px] tracking-widest">
            CASE #{audit.caseNumber}
          </p>
        </div>

        <Divider />

        <SectionTitle>Subject</SectionTitle>
        <p className="font-display text-2xl uppercase">{audit.subjectName}</p>
        <p className="font-mono text-[11px] uppercase tracking-widest text-paper-muted">
          {audit.relationship} · Audited by {audit.accuserName}
        </p>

        <Divider />

        <SectionTitle>Offence</SectionTitle>
        <p className="font-display text-xl uppercase">{audit.offenceLabel}</p>

        <Divider />

        <SectionTitle>Evidence</SectionTitle>
        <div className="mt-1">
          <Row label="Expected arrival" value="7:00 PM" />
          <Row label="Actual arrival" value={`${late} late`} />
          <Row label="Excuse provided" value={p.excuse} />
          <Row label="Previous offences" value={priors} />
          {audit.defence?.note ? (
            <Row label="Defendant note" value={`“${audit.defence.note}”`} />
          ) : null}
        </div>
        {audit.defence?.screenshot ? (
          <img
            src={audit.defence.screenshot}
            alt="Counter-evidence submitted by the defendant"
            className="mt-3 w-full rounded-lg border border-black/20"
          />
        ) : null}

        <Divider />

        <SectionTitle>Damages</SectionTitle>
        <p className="font-display text-4xl leading-none">{minutes} MINUTES</p>
        <p className="font-display text-xl text-paper-muted">OF YOUR LIFE</p>

        <Divider />

        <div className="relative">
          <SectionTitle>Verdict</SectionTitle>
          <p className="font-display text-4xl leading-tight text-guilty">
            🚨 {score}% GUILTY
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.2em]">{verdict}</p>
          <p className="mt-2 text-sm italic text-paper-muted">
            “{p.verdictLine(audit.subjectName, score, verdict)}”
          </p>
          <div className="animate-slam pointer-events-none absolute -top-2 right-0 rounded border-2 border-guilty px-2 py-1 font-display text-[11px] uppercase text-guilty stamp">
            {p.emoji} {p.name}
          </div>
        </div>

        <div className="mt-4">
          <SectionTitle>Offence severity</SectionTitle>
          <div className="mt-2">
            <SeverityBar score={score} />
          </div>
        </div>

        <Divider />

        <SectionTitle>Sentence</SectionTitle>
        <p className="font-display text-xl uppercase leading-snug">{sentence}</p>

        <Divider />

        <p className="text-center font-mono text-[11px] tracking-widest text-paper-muted">
          CASE #{audit.caseNumber}
        </p>
        <p className="mt-1 text-center font-display text-lg">
          CAUGHT<sup className="align-super text-[0.4em]">™</sup>
        </p>
        <p className="mt-1 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-paper-muted">
          This document is legally binding among friends
        </p>
      </div>
    </div>
  );
}
