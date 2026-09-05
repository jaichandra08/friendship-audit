import { findOffence, LATENESS_QUESTIONS } from "./offences";
import type { DefenceOption, EvidenceQuestion } from "./offences";
import { getPersonality } from "./personalities";
import type { EvidenceAnswers, PersonalityId, VerdictLabel } from "./types";

export const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function sumQuestions(questions: EvidenceQuestion[], answers: EvidenceAnswers): number {
  let total = 0;
  for (const q of questions) {
    const opt = q.options.find((o) => o.value === answers[q.id]);
    if (opt) total += opt.points;
  }
  return clamp(total);
}

export function scoreLateness(answers: EvidenceAnswers): number {
  return sumQuestions(LATENESS_QUESTIONS, answers);
}

/** Generic scorer: sums the points of an offence's own evidence questions. */
export function scoreOffence(offenceId: string, answers: EvidenceAnswers): number {
  const offence = findOffence(offenceId);
  if (!offence?.questions) return 0;
  return sumQuestions(offence.questions, answers);
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
  return p.sentences[idx] as string;
}

export const DEFENCE_OPTIONS: DefenceOption[] = [
  { emoji: "🚗", label: "Traffic was insane", modifier: -10 },
  { emoji: "😴", label: "I overslept", modifier: -5 },
  { emoji: "🤷", label: "Not my fault", modifier: -15 },
  { emoji: "😤", label: "They're exaggerating", modifier: -8 },
  { emoji: "🧑‍⚖️", label: "I plead guilty", modifier: 5 },
  { emoji: "✍️", label: "My defence", modifier: -3 },
];

/** Defence options for an offence, falling back to the generic lateness set. */
export function defenceOptionsFor(offenceId: string): DefenceOption[] {
  return findOffence(offenceId)?.defenceOptions ?? DEFENCE_OPTIONS;
}

/** Modifier for a chosen defence, scoped to the offence's own defence options. */
export function defenceModifier(label: string, offenceId?: string): number {
  const options = offenceId ? defenceOptionsFor(offenceId) : DEFENCE_OPTIONS;
  return options.find((d) => d.label === label)?.modifier ?? 0;
}

export function minutesLost(answers: EvidenceAnswers): number {
  const map: Record<string, number> = {
    "5 min": 5,
    "15 min": 15,
    "30 min": 30,
    "1 hr": 60,
    "2+ hrs": 127,
  };
  return map[answers["howLate"] ?? ""] ?? 0;
}

export function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const n = Math.floor(100000 + Math.random() * 899999);
  return `${year}-${n}`;
}

export function generateId(): string {
  return `a_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
