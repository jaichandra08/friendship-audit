export interface EvidenceQuestion {
  id: string;
  label: string;
  options: { value: string; label: string; points: number }[];
}

export interface Offence {
  id: string;
  label: string;
  category: string;
  emoji: string;
  available: boolean;
  questions?: EvidenceQuestion[];
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
        questions: LATENESS_QUESTIONS,
      },
      { id: "five-minutes-away", label: "“5 minutes away”", category: "TIME CRIMES", emoji: "⏰", available: false },
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
