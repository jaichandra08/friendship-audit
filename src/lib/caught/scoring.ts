import { LATENESS_QUESTIONS } from "./offences";
import { getPersonality } from "./personalities";
import type { EvidenceAnswers, PersonalityId, VerdictLabel } from "./types";

export const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function scoreLateness(answers: EvidenceAnswers): number {
  let total = 0;
  for (const q of LATENESS_QUESTIONS) {
    const opt = q.options.find((o) => o.value === answers[q.id]);
    if (opt) total += opt.points;
  }
  return clamp(total);
}

export function verdictFor(score: number): VerdictLabel {
  if (score < 30) return "INNOCENT";
  if (score < 50) return "SUSPICIOUS";
  if (score < 70) return "GUILTY";
  if (score < 85) return "VERY GUILTY";
  return "EXTREMELY GUILTY";
}

export type Tone = "innocent" | "suspicious" | "guilty";

export function toneFor(score: number): Tone {
  if (score < 30) return "innocent";
  if (score < 50) return "suspicious";
  return "guilty";
}

export function sentenceFor(score: number, personality: PersonalityId): string {
  const p = getPersonality(personality);
  const idx = Math.min(
    p.sentences.length - 1,
    Math.floor((score / 100) * p.sentences.length),
  );
  return p.sentences[idx];
}

export const DEFENCE_OPTIONS: { emoji: string; label: string; modifier: number }[] = [
  { emoji: "🚗", label: "Traffic was insane", modifier: -10 },
  { emoji: "😴", label: "I overslept", modifier: -5 },
  { emoji: "🤷", label: "Not my fault", modifier: -15 },
  { emoji: "😤", label: "They're exaggerating", modifier: -8 },
  { emoji: "🧑‍⚖️", label: "I plead guilty", modifier: 5 },
  { emoji: "✍️", label: "My defence", modifier: -3 },
];

export function defenceModifier(label: string): number {
  return DEFENCE_OPTIONS.find((d) => d.label === label)?.modifier ?? 0;
}

export function minutesLost(answers: EvidenceAnswers): number {
  const map: Record<string, number> = {
    "5 min": 5,
    "15 min": 15,
    "30 min": 30,
    "1 hr": 60,
    "2+ hrs": 127,
  };
  return map[answers.howLate ?? ""] ?? 0;
}

export function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const n = Math.floor(100000 + Math.random() * 899999);
  return `${year}-${n}`;
}

export function generateId(): string {
  return `a_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
