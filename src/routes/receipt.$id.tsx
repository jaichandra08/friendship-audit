import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Receipt } from "@/components/caught/Receipt";
import { BigButton, Screen, TopBar } from "@/components/caught/primitives";
import { shareText } from "@/lib/caught/share";
import { getAudit } from "@/lib/caught/storage";
import type { Audit } from "@/lib/caught/types";

export const Route = createFileRoute("/receipt/$id")({
  head: () => ({
    meta: [
      { title: "Official audit receipt — CAUGHT™" },
      {
        name: "description",
        content:
          "An official CAUGHT™ friendship audit receipt: subject, evidence, damages, verdict and sentence.",
      },
      { property: "og:title", content: "Official audit receipt — CAUGHT™" },
      {
        property: "og:description",
        content: "The evidence has been reviewed. The verdict is in.",
      },
    ],
  }),
  component: ReceiptPage,
});

function ReceiptPage() {
  const { id } = useParams({ from: "/receipt/$id" });
  const navigate = useNavigate();
  const [audit, setAudit] = useState<Audit | null | undefined>(undefined);

  useEffect(() => {
    setAudit(getAudit(id) ?? null);
  }, [id]);

  if (audit === undefined) {
    return (
      <Screen className="flex items-center justify-center">
        <p className="animate-blink font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Retrieving case file…
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

  const score = audit.finalScore ?? audit.initialScore;

  const onShare = async () => {
    const text = `🚨 YOU'VE BEEN AUDITED\n\n${audit.subjectName} has been found:\n${score}% GUILTY\n\nCrime:\n${audit.offenceLabel}\n\nSentence:\n${audit.finalSentence ?? audit.sentence}\n\nThink the verdict is wrong?\n👉 DEFEND YOURSELF\n\nCAUGHT™ · Case #${audit.caseNumber}`;
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/defend/${audit.id}`
        : undefined;
    const res = await shareText("CAUGHT™ Official Audit", text, url);
    if (res === "copied") toast.success("Share text copied — go paste the evidence.");
    if (res === "failed") toast.error("Couldn't share. Screenshot the receipt instead.");
  };

  return (
    <Screen>
      <TopBar back="/home" title="Official document" />
      <div className="animate-rise">
        <Receipt audit={audit} final={audit.finalScore !== undefined} />
      </div>

      <div className="mt-6 space-y-3">
        <BigButton variant="outline" onClick={onShare}>
          Share receipt
        </BigButton>
        <BigButton
          onClick={() => navigate({ to: "/defend/$id", params: { id: audit.id } })}
        >
          Let them defend themselves
        </BigButton>
        {audit.finalScore !== undefined ? (
          <BigButton
            variant="ghost"
            onClick={() => navigate({ to: "/verdict/$id", params: { id: audit.id } })}
          >
            View final verdict
          </BigButton>
        ) : null}
      </div>
    </Screen>
  );
}
