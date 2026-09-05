import type { PersonalityId, VerdictLabel } from "./types";

export interface Personality {
  id: PersonalityId;
  emoji: string;
  name: string;
  quote: string;
  verdictLine: (name: string, score: number, verdict: VerdictLabel) => string;
  excuse: string;
  sentences: string[];
}

export const PERSONALITIES: Personality[] = [
  {
    id: "indian-mom",
    emoji: "👩",
    name: "INDIAN MOM",
    quote: "I raised you better than this.",
    excuse: "“Beta, I am just leaving now.”",
    verdictLine: (name, score) =>
      `${name}, ${score}% guilty. Look at Sharma ji's son — always on time.`,
    sentences: [
      "BUY EVERYONE CHAI ☕",
      "APOLOGISE. PROPERLY. IN PERSON.",
      "NO PHONE FOR ONE WEEK 📵",
      "BRING SNACKS FOR THE WHOLE GROUP 🍟",
      "COME HOME BEFORE 8 PM FROM NOW ON",
    ],
  },
  {
    id: "strict-judge",
    emoji: "⚖️",
    name: "STRICT JUDGE",
    quote: "Zero tolerance for nonsense.",
    excuse: "“Bro, almost there.”",
    verdictLine: (name, score) =>
      `The court finds ${name} ${score}% guilty. The evidence is overwhelming.`,
    sentences: [
      "SEND A SINCERE APOLOGY",
      "ARRIVE 30 MINUTES EARLY NEXT TIME",
      "YOU ARE FORBIDDEN FROM SAYING “5 MINUTES”",
      "OWE THE GROUP SNACKS 🍟",
      "PAY FOR THE NEXT THREE OUTINGS",
    ],
  },
  {
    id: "chaotic-judge",
    emoji: "🧑‍⚖️",
    name: "CHAOTIC JUDGE",
    quote: "I have reviewed the evidence and I'm already disappointed.",
    excuse: "“Bro said 5 minutes.” (it was not 5 minutes)",
    verdictLine: (name, score) =>
      `${name} is ${score}% guilty and honestly I'm not even surprised.`,
    sentences: [
      "BUY EVERYONE CHAI ☕",
      "YOU OWE THE GROUP DESSERT 🍨",
      "YOUR LOCATION MUST BE SHARED LIVE. FOREVER.",
      "YOU ARE FORBIDDEN FROM SAYING “5 MINUTES”",
      "ONE SNACK + ONE SINCERE APOLOGY 🍟",
    ],
  },
];

export function getPersonality(id: PersonalityId): Personality {
  return PERSONALITIES.find((p) => p.id === id) ?? PERSONALITIES[1];
}
