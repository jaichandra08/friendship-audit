export interface EvidenceQuestion {
  id: string;
  label: string;
  options: { value: string; label: string; points: number }[];
}

export interface DefenceOption {
  emoji: string;
  label: string;
  modifier: number;
}

/** A single label/value row rendered in the Receipt evidence section. */
export interface ReceiptRow {
  label: string;
  value: string;
}

export interface Offence {
  id: string;
  label: string;
  category: string;
  emoji: string;
  available: boolean;
  /** Short label stamped onto the audit + receipt, e.g. "Chronic lateness". */
  offenceLabel?: string;
  /** Tagline shown under the "Evidence" heading during audit creation. */
  evidenceTagline?: string;
  questions?: EvidenceQuestion[];
  /** Defence options shown to the accused. Falls back to generic set if absent. */
  defenceOptions?: DefenceOption[];
  /** Builds the accusation summary line shown to the defendant. */
  buildAccusation?: (evidence: Record<string, string>) => string;
  /** Builds the receipt "Damages" headline + subline. */
  buildDamages?: (evidence: Record<string, string>) => { amount: string; unit: string };
  /** Builds the receipt evidence rows from the recorded answers. */
  buildReceiptRows?: (evidence: Record<string, string>) => ReceiptRow[];
}

export const LATENESS_QUESTIONS: EvidenceQuestion[] = [
  {
    id: "howLate",
    label: "How late were they?",
    options: [
      { value: "5 min", label: "5 min", points: 10 },
      { value: "15 min", label: "15 min", points: 20 },
      { value: "30 min", label: "30 min", points: 35 },
      { value: "1 hr", label: "1 hr", points: 55 },
      { value: "2+ hrs", label: "2+ hrs", points: 75 },
    ],
  },
  {
    id: "saidComing",
    label: "Did they say they were coming?",
    options: [
      { value: "YES", label: "YES", points: 5 },
      { value: "NO", label: "NO", points: 0 },
    ],
  },
  {
    id: "fiveMinutes",
    label: "Did they say “5 minutes”?",
    options: [
      { value: "Unfortunately, yes", label: "Unfortunately, yes", points: 15 },
      { value: "No", label: "No", points: 0 },
    ],
  },
  {
    id: "priors",
    label: "Previous offences?",
    options: [
      { value: "0", label: "0", points: 0 },
      { value: "1–2", label: "1–2", points: 10 },
      { value: "3–5", label: "3–5", points: 20 },
      { value: "I've lost count", label: "I've lost count", points: 30 },
    ],
  },
  {
    id: "apology",
    label: "Did they apologize?",
    options: [
      { value: "Genuine apology", label: "Genuine apology", points: -10 },
      { value: "“My bad”", label: "“My bad”", points: 5 },
      { value: "Blamed traffic", label: "Blamed traffic", points: 10 },
      { value: "No apology", label: "No apology", points: 20 },
    ],
  },
];

export const FIVE_MINUTES_QUESTIONS: EvidenceQuestion[] = [
  {
    id: "timesSaid",
    label: "How many times did they say “5 minutes”?",
    options: [
      { value: "Once", label: "Once", points: 15 },
      { value: "2–3 times", label: "2–3 times", points: 35 },
      { value: "4–6 times", label: "4–6 times", points: 55 },
      { value: "Lost count", label: "Lost count", points: 75 },
    ],
  },
  {
    id: "actualWait",
    label: "How long did “5 minutes” actually take?",
    options: [
      { value: "15 min", label: "15 min", points: 15 },
      { value: "30 min", label: "30 min", points: 30 },
      { value: "1 hr", label: "1 hr", points: 50 },
      { value: "Still waiting", label: "Still waiting", points: 70 },
    ],
  },
  {
    id: "locationStatus",
    label: "Were they actually ready?",
    options: [
      { value: "Still in bed", label: "Still in bed", points: 25 },
      { value: "In the shower", label: "In the shower", points: 20 },
      { value: "“Leaving now”", label: "“Leaving now”", points: 15 },
      { value: "Genuinely close", label: "Genuinely close", points: 0 },
    ],
  },
  {
    id: "sharedLocation",
    label: "Did they share their live location?",
    options: [
      { value: "Yes, and it proved them wrong", label: "Yes — busted", points: 20 },
      { value: "Refused to", label: "Refused to", points: 15 },
      { value: "Yes, they were close", label: "Yes — they were close", points: -10 },
      { value: "Didn't ask", label: "Didn't ask", points: 5 },
    ],
  },
  {
    id: "priors",
    label: "Previous “5 minute” offences?",
    options: [
      { value: "0", label: "0", points: 0 },
      { value: "1–2", label: "1–2", points: 10 },
      { value: "3–5", label: "3–5", points: 20 },
      { value: "It's their catchphrase", label: "It's their catchphrase", points: 30 },
    ],
  },
];

const LATENESS_DEFENCE_OPTIONS: DefenceOption[] = [
  { emoji: "🚗", label: "Traffic was insane", modifier: -10 },
  { emoji: "😴", label: "I overslept", modifier: -5 },
  { emoji: "🤷", label: "Not my fault", modifier: -15 },
  { emoji: "😤", label: "They're exaggerating", modifier: -8 },
  { emoji: "🧑‍⚖️", label: "I plead guilty", modifier: 5 },
  { emoji: "✍️", label: "My defence", modifier: -3 },
];

const FIVE_MINUTES_DEFENCE_OPTIONS: DefenceOption[] = [
  { emoji: "🛵", label: "I WAS actually 5 minutes away", modifier: -12 },
  { emoji: "🗺️", label: "Google Maps lied to me", modifier: -8 },
  { emoji: "🅿️", label: "Couldn't find parking", modifier: -6 },
  { emoji: "😤", label: "They're exaggerating", modifier: -8 },
  { emoji: "🧑‍⚖️", label: "Okay it was more like 45 minutes", modifier: 8 },
  { emoji: "✍️", label: "My defence", modifier: -3 },
];

export const OFFENCE_CATEGORIES: {
  emoji: string;
  title: string;
  offences: Offence[];
}[] = [
  {
    emoji: "⏰",
    title: "TIME CRIMES",
    offences: [
      {
        id: "came-late",
        label: "Came late",
        category: "TIME CRIMES",
        emoji: "⏰",
        available: true,
        offenceLabel: "Chronic lateness",
        evidenceTagline: "Chronic lateness",
        questions: LATENESS_QUESTIONS,
        defenceOptions: LATENESS_DEFENCE_OPTIONS,
      },
      {
        id: "five-minutes-away",
        label: "“5 minutes away”",
        category: "TIME CRIMES",
        emoji: "⏰",
        available: true,
        offenceLabel: "The “5 minutes away” lie",
        evidenceTagline: "“5 minutes away”",
        questions: FIVE_MINUTES_QUESTIONS,
        defenceOptions: FIVE_MINUTES_DEFENCE_OPTIONS,
        buildAccusation: (e) => {
          const times = e["timesSaid"] ?? "at least once";
          const wait = e["actualWait"] ?? "an eternity";
          return `Said “5 minutes away” ${times.toLowerCase()} — it took ${wait.toLowerCase()}.`;
        },
        buildDamages: (e) => {
          const map: Record<string, string> = {
            "15 min": "10",
            "30 min": "25",
            "1 hr": "55",
            "Still waiting": "∞",
          };
          const amount = map[e["actualWait"] ?? ""] ?? "5";
          return { amount, unit: "MINUTES OF FALSE HOPE" };
        },
        buildReceiptRows: (e) => [
          { label: "Promised", value: "5 minutes" },
          { label: "Actual wait", value: e["actualWait"] ?? "unknown" },
          { label: "Times repeated", value: e["timesSaid"] ?? "—" },
          { label: "Real status", value: e["locationStatus"] ?? "—" },
          { label: "Live location", value: e["sharedLocation"] ?? "—" },
          { label: "Previous offences", value: e["priors"] ?? "0" },
        ],
      },
      { id: "ghosted", label: "Ghosted", category: "TIME CRIMES", emoji: "⏰", available: false },
      { id: "cancelled", label: "Cancelled last minute", category: "TIME CRIMES", emoji: "⏰", available: false },
    ],
  },
  {
    emoji: "💸",
    title: "MONEY CRIMES",
    offences: [
      { id: "didnt-pay", label: "Didn't pay me", category: "MONEY CRIMES", emoji: "💸", available: false },
      { id: "borrowed", label: "Borrowed money", category: "MONEY CRIMES", emoji: "💸", available: false },
      { id: "tomorrow", label: "“I'll send it tomorrow”", category: "MONEY CRIMES", emoji: "💸", available: false },
    ],
  },
  {
    emoji: "💬",
    title: "CHAT CRIMES",
    offences: [
      { id: "left-on-read", label: "Left me on read", category: "CHAT CRIMES", emoji: "💬", available: false },
      { id: "three-days", label: "Replied after 3 days", category: "CHAT CRIMES", emoji: "💬", available: false },
      { id: "sent-k", label: "Sent “K”", category: "CHAT CRIMES", emoji: "💬", available: false },
      { id: "story-no-reply", label: "Saw my story but didn't reply", category: "CHAT CRIMES", emoji: "💬", available: false },
    ],
  },
  {
    emoji: "🍟",
    title: "FOOD CRIMES",
    offences: [
      { id: "stole-food", label: "Stole my food", category: "FOOD CRIMES", emoji: "🍟", available: false },
      { id: "didnt-share", label: "Didn't share", category: "FOOD CRIMES", emoji: "🍟", available: false },
      { id: "last-piece", label: "Took the last piece", category: "FOOD CRIMES", emoji: "🍟", available: false },
    ],
  },
  {
    emoji: "🧑‍💼",
    title: "WORK CRIMES",
    offences: [
      { id: "quick-call", label: "“Quick call”", category: "WORK CRIMES", emoji: "🧑‍💼", available: false },
      { id: "took-credit", label: "Took credit", category: "WORK CRIMES", emoji: "🧑‍💼", available: false },
      { id: "late-work", label: "Sent work at 11:59 PM", category: "WORK CRIMES", emoji: "🧑‍💼", available: false },
    ],
  },
  {
    emoji: "🤨",
    title: "OTHER",
    offences: [
      { id: "something-else", label: "Something else", category: "OTHER", emoji: "🤨", available: false },
    ],
  },
];

export function findOffence(id: string): Offence | undefined {
  for (const c of OFFENCE_CATEGORIES) {
    const o = c.offences.find((x) => x.id === id);
    if (o) return o;
  }
  return undefined;
}
