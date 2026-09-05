import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BigButton, Screen, Wordmark } from "@/components/caught/primitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CAUGHT™ — Your friends have been audited" },
      {
        name: "description",
        content:
          "Document suspicious friendship behaviour, get an official audit receipt with a guilty percentage, and let the accused defend themselves.",
      },
      { property: "og:title", content: "CAUGHT™ — Your friends have been audited" },
      {
        property: "og:description",
        content:
          "Create a dramatic friendship audit receipt in 30 seconds. No account required.",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();
  return (
    <Screen className="flex min-h-dvh flex-col items-center justify-center text-center">
      <div className="animate-rise">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-guilty animate-blink">
          🚨 Case file opening
        </p>
        <h1 className="text-6xl">
          <Wordmark />
        </h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Your friends have been audited.
        </p>
      </div>

      <div className="mt-10 w-full animate-rise rounded-3xl border border-border bg-card p-6">
        <p className="text-lg font-semibold leading-snug">
          Somebody did something suspicious.
        </p>
        <p className="mt-1 text-lg font-semibold leading-snug text-muted-foreground">
          Document the evidence.
        </p>
      </div>

      <div className="mt-10 w-full">
        <BigButton onClick={() => navigate({ to: "/home" })}>
          Let's audit them →
        </BigButton>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          No account required.
        </p>
      </div>
    </Screen>
  );
}
