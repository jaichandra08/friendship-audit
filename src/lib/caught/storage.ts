import type { Audit } from "./types";

const KEY = "caught.audits.v1";

const SAMPLES: Audit[] = [
  {
    id: "sample-rahul",
    caseNumber: "2026-448201",
    subjectName: "Rahul",
    accuserName: "You",
    relationship: "Friend",
    offenceId: "quick-call",
    offenceLabel: "47-minute quick call",
    evidence: {},
    personality: "strict-judge",
    initialScore: 72,
    initialVerdict: "VERY GUILTY",
    sentence: "OWE THE GROUP SNACKS 🍟",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "sample-mom",
    caseNumber: "2026-330117",
    subjectName: "Mom",
    accuserName: "You",
    relationship: "Parent",
    offenceId: "something-else",
    offenceLabel: "Asked when I'm getting married",
    evidence: {},
    personality: "indian-mom",
    initialScore: 44,
    initialVerdict: "SUSPICIOUS",
    sentence: "BUY EVERYONE CHAI ☕",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "sample-aisha",
    caseNumber: "2026-190553",
    subjectName: "Aisha",
    accuserName: "You",
    relationship: "Friend",
    offenceId: "stole-food",
    offenceLabel: "Stole my fries",
    evidence: {},
    personality: "chaotic-judge",
    initialScore: 88,
    initialVerdict: "EXTREMELY GUILTY",
    sentence: "YOU OWE THE GROUP DESSERT 🍨",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadAudits(): Audit[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(SAMPLES));
      return SAMPLES;
    }
    return JSON.parse(raw) as Audit[];
  } catch {
    return SAMPLES;
  }
}

export function saveAudit(audit: Audit) {
  if (!isBrowser()) return;
  const all = loadAudits().filter((a) => a.id !== audit.id);
  localStorage.setItem(KEY, JSON.stringify([audit, ...all]));
}

export function getAudit(id: string): Audit | undefined {
  return loadAudits().find((a) => a.id === id);
}
