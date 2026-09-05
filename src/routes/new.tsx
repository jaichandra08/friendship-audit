import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  BigButton,
  OptionButton,
  Screen,
  TopBar,
  Wordmark,
} from "@/components/caught/primitives";
import { findOffence, OFFENCE_CATEGORIES } from "@/lib/caught/offences";
import { PERSONALITIES } from "@/lib/caught/personalities";
import {
  generateCaseNumber,
  generateId,
  scoreOffence,
  sentenceFor,
  verdictFor,
} from "@/lib/caught/scoring";
import { saveAudit } from "@/lib/caught/storage";
import type {
  Audit,
  EvidenceAnswers,
  PersonalityId,
  Relationship,
} from "@/lib/caught/types";

export const Route = createFileRoute("/new")({
  head: () => ({
    meta: [
      { title: "Create an audit — CAUGHT™" },
      {
        name: "description",
        content:
          "Pick the offence, name the suspect, log the evidence and get an official verdict in under a minute.",
      },
      { property: "og:title", content: "Create an audit — CAUGHT™" },
      {
        property: "og:description",
        content: "Pick the offence, log the evidence, get the verdict.",
      },
    ],
  }),
  component: NewAudit,
});

const RELATIONSHIPS: Relationship[] = [
  "Friend",
  "Partner",
  "Sibling",
  "Parent",
  "Coworker",
  "Other",
];

type Step = "offence" | "who" | "evidence" | "personality" | "calculating";

const STAGES = [
  "AUDIT IN PROGRESS...",
  "Analyzing evidence...",
  "Calculating damages...",
  "Reviewing previous offences...",
  "🚨 SUSPICIOUS ACTIVITY DETECTED",
];

function NewAudit() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("offence");
  const [offenceId, setOffenceId] = useState("came-late");
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [answers, setAnswers] = useState<EvidenceAnswers>({});
  const [personality, setPersonality] = useState<PersonalityId | null>(null);
  const [stage, setStage] = useState(0);

  const offence = useMemo(() => findOffence(offenceId), [offenceId]);
  const questions = offence?.questions ?? [];

  const evidenceComplete = useMemo(
    () => questions.length > 0 && questions.every((q) => answers[q.id]),
    [questions, answers],
  );

  useEffect(() => {
    if (step !== "calculating") return;
    const timers = STAGES.map((_, i) =>
      setTimeout(() => setStage(i), i * 260),
    );
    const done = setTimeout(() => {
      const score = scoreOffence(offenceId, answers);
      const audit: Audit = {
        id: generateId(),
        caseNumber: generateCaseNumber(),
        subjectName: name.trim() || "The Accused",
        accuserName: "You",
        relationship: relationship ?? "Friend",
        offenceId,
        offenceLabel: offence?.offenceLabel ?? offence?.label ?? "Chronic lateness",
        evidence: answers,
        personality: personality ?? "strict-judge",
        initialScore: score,
        initialVerdict: verdictFor(score),
        sentence: sentenceFor(score, personality ?? "strict-judge"),
        createdAt: new Date().toISOString(),
      };
      saveAudit(audit);
      navigate({ to: "/receipt/$id", params: { id: audit.id } });
    }, 1500);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [step, answers, name, relationship, offenceId, offence, personality, navigate]);

  if (step === "calculating") {
    return (
      <Screen className="flex min-h-dvh flex-col items-center justify-center text-center">
        <div className="h-2 w-2 animate-blink rounded-full bg-guilty" />
        <p
          key={stage}
          className="mt-6 animate-rise font-display text-2xl uppercase leading-snug"
        >
          {STAGES[stage]}
        </p>
        <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-guilty transition-[width] duration-300"
            style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
          />
        </div>
      </Screen>
    );
  }

  if (step === "offence") {
    return (
      <Screen>
        <TopBar back="/home" title="Step 1 of 4" />
        <h1 className="font-display text-4xl leading-tight">What did they do?</h1>
        <div className="mt-6 space-y-5">
          {OFFENCE_CATEGORIES.map((cat) => (
            <section key={cat.title}>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {cat.emoji} {cat.title}
              </p>
              <div className="grid gap-2">
                {cat.offences.map((o) => (
                  <OptionButton
                    key={o.id}
                    selected={o.available && offenceId === o.id}
                    onClick={() => {
                      if (!o.available) {
                        toast("Coming soon", {
                          description: `“${o.label}” is still being investigated.`,
                        });
                        return;
                      }
                      if (o.id !== offenceId) setAnswers({});
                      setOffenceId(o.id);
                      setStep("who");
                    }}
                    className="flex items-center justify-between"
                  >
                    <span>{o.label}</span>
                    {!o.available ? (
                      <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                        Coming soon
                      </span>
                    ) : (
                      <span className="font-mono text-[9px] uppercase tracking-widest text-guilty">
                        Available
                      </span>
                    )}
                  </OptionButton>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Screen>
    );
  }

  if (step === "who") {
    return (
      <Screen>
        <TopBar title="Step 2 of 4" />
        <button
          onClick={() => setStep("offence")}
          className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground"
        >
          ← Back
        </button>
        <h1 className="font-display text-4xl leading-tight">Who are we auditing?</h1>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          autoFocus
          className="mt-6 w-full rounded-2xl border border-input bg-card px-5 py-4 text-lg font-semibold outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <p className="mb-3 mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          What are you to them?
        </p>
        <div className="grid grid-cols-2 gap-2">
          {RELATIONSHIPS.map((r) => (
            <OptionButton
              key={r}
              selected={relationship === r}
              onClick={() => setRelationship(r)}
            >
              {r}
            </OptionButton>
          ))}
        </div>
        <div className="mt-8">
          <BigButton
            disabled={!name.trim() || !relationship}
            onClick={() => setStep("evidence")}
          >
            Continue →
          </BigButton>
        </div>
      </Screen>
    );
  }

  if (step === "evidence") {
    return (
      <Screen>
        <TopBar title="Step 3 of 4" />
        <button
          onClick={() => setStep("who")}
          className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground"
        >
          ← Back
        </button>
        <h1 className="font-display text-4xl leading-tight">Evidence</h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-guilty">
          {offence?.evidenceTagline ?? offence?.label} · {name}
        </p>

        <div className="mt-6 space-y-6">
          {questions.map((q) => (
            <section key={q.id}>
              <p className="mb-2 text-base font-semibold">{q.label}</p>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((o) => (
                  <OptionButton
                    key={o.value}
                    selected={answers[q.id] === o.value}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.value }))}
                  >
                    {o.label}
                  </OptionButton>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8">
          <BigButton disabled={!evidenceComplete} onClick={() => setStep("personality")}>
            Calculate damages →
          </BigButton>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="Step 4 of 4" />
      <button
        onClick={() => setStep("evidence")}
        className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground"
      >
        ← Back
      </button>
      <h1 className="font-display text-4xl leading-tight">Who should judge this?</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your judge decides the tone of the verdict and the sentence.
      </p>
      <div className="mt-6 space-y-3">
        {PERSONALITIES.map((p) => (
          <OptionButton
            key={p.id}
            selected={personality === p.id}
            onClick={() => setPersonality(p.id)}
            className="block w-full"
          >
            <span className="font-display text-lg">
              {p.emoji} {p.name}
            </span>
            <span className="mt-1 block text-sm font-normal text-muted-foreground">
              “{p.quote}”
            </span>
          </OptionButton>
        ))}
      </div>
      <div className="mt-8">
        <BigButton disabled={!personality} onClick={() => setStep("calculating")}>
          Deliver the verdict →
        </BigButton>
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Wordmark /> audits are legally binding among friends.
      </p>
    </Screen>
  );
}
