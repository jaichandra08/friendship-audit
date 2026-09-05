import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  BigButton,
  OptionButton,
  Screen,
  TopBar,
  Wordmark,
} from "@/components/caught/primitives";
import { findOffence } from "@/lib/caught/offences";
import { getPersonality } from "@/lib/caught/personalities";
import {
  clamp,
  defenceModifier,
  defenceOptionsFor,
  sentenceFor,
  verdictFor,
} from "@/lib/caught/scoring";
import { getAudit, saveAudit } from "@/lib/caught/storage";
import type { Audit } from "@/lib/caught/types";

export const Route = createFileRoute("/defend/$id")({
  head: () => ({
    meta: [
      { title: "Defend yourself — CAUGHT™" },
      {
        name: "description",
        content:
          "You've been accused. Pick your defence, submit counter-evidence and try to reduce the charge.",
      },
      { property: "og:title", content: "You've been accused — CAUGHT™" },
      {
        property: "og:description",
        content: "Pick your defence and try to reduce the charge.",
      },
    ],
  }),
  component: DefendPage,
});

function DefendPage() {
  const { id } = useParams({ from: "/defend/$id" });
  const navigate = useNavigate();
  const [audit, setAudit] = useState<Audit | null | undefined>(undefined);
  const [choice, setChoice] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [screenshot, setScreenshot] = useState<string | undefined>();
  const [nothing, setNothing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAudit(getAudit(id) ?? null);
  }, [id]);

  if (audit === undefined) {
    return (
      <Screen className="flex items-center justify-center">
        <p className="animate-blink font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Loading the accusation…
        </p>
      </Screen>
    );
  }

  if (audit === null) {
    return (
      <Screen className="flex flex-col items-center justify-center text-center">
        <p className="font-display text-2xl">Case file not found</p>
        <div className="mt-6 w-full">
          <BigButton onClick={() => navigate({ to: "/home" })}>Back to home</BigButton>
        </div>
      </Screen>
    );
  }

  const p = getPersonality(audit.personality);
  const offence = findOffence(audit.offenceId);
  const defenceOptions = defenceOptionsFor(audit.offenceId);
  const accusation =
    offence?.buildAccusation?.(audit.evidence) ??
    `Were ${audit.evidence["howLate"] ?? "very"} late.`;

  const onFile = (file?: File) => {
    if (!file) return;
    if (file.size > 4_000_000) {
      toast.error("That screenshot is too large. Try a smaller one.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshot(reader.result as string);
      setNothing(false);
      toast.success("Counter-evidence attached.");
    };
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!choice) return;
    const finalScore = clamp(audit.initialScore + defenceModifier(choice, audit.offenceId));
    const updated: Audit = {
      ...audit,
      defence: { option: choice, ...(note.trim() ? { note: note.trim() } : {}), ...(screenshot ? { screenshot } : {}), hasNothing: nothing },
      finalScore,
      finalVerdict: verdictFor(finalScore),
      finalSentence: sentenceFor(finalScore, audit.personality),
    };
    saveAudit(updated);
    navigate({ to: "/verdict/$id", params: { id: audit.id } });
  };

  return (
    <Screen>
      <TopBar back="/home" title="Defendant view" />

      <div className="animate-rise rounded-3xl border border-guilty/50 bg-guilty/10 p-5">
        <p className="font-display text-3xl leading-tight text-guilty">
          🚨 YOU'VE BEEN ACCUSED
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {audit.accuserName} says you:
        </p>
        <p className="font-display text-xl">{accusation}</p>
        <p className="mt-3 text-sm text-muted-foreground">Their evidence:</p>
        <p className="font-mono text-sm">{p.excuse}</p>
      </div>

      <h2 className="mb-3 mt-8 font-display text-2xl">WHAT'S YOUR DEFENCE?</h2>
      <div className="grid gap-2">
        {defenceOptions.map((d) => (
          <OptionButton
            key={d.label}
            selected={choice === d.label}
            onClick={() => {
              setChoice(d.label);
              if (d.label === "My defence") setShowNote(true);
            }}
          >
            {d.emoji} {d.label}
          </OptionButton>
        ))}
      </div>

      {showNote || choice === "My defence" ? (
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Say it fast. The court is impatient."
          rows={3}
          className="mt-3 w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
        />
      ) : null}

      <h2 className="mb-3 mt-8 font-display text-2xl">DO YOU HAVE EVIDENCE?</h2>
      <div className="grid gap-2">
        <OptionButton selected={!!screenshot} onClick={() => fileRef.current?.click()}>
          📸 Upload screenshot
        </OptionButton>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <OptionButton
          selected={showNote}
          onClick={() => {
            setShowNote(true);
            setNothing(false);
          }}
        >
          💬 Add a message
        </OptionButton>
        <OptionButton
          selected={nothing}
          onClick={() => {
            setNothing(true);
            setScreenshot(undefined);
            setNote("");
            setShowNote(false);
          }}
        >
          ❌ I have nothing
        </OptionButton>
      </div>

      {screenshot ? (
        <img
          src={screenshot}
          alt="Your submitted counter-evidence"
          className="mt-3 w-full rounded-2xl border border-border"
        />
      ) : null}

      <div className="mt-8">
        <BigButton disabled={!choice} onClick={submit}>
          Submit defence →
        </BigButton>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          <Wordmark /> reserves the right to laugh at your defence.
        </p>
      </div>
    </Screen>
  );
}
