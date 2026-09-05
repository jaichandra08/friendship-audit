export type VerdictLabel =
  | "INNOCENT"
  | "SUSPICIOUS"
  | "GUILTY"
  | "VERY GUILTY"
  | "EXTREMELY GUILTY";

export type PersonalityId = "indian-mom" | "strict-judge" | "chaotic-judge";

export type Relationship =
  | "Friend"
  | "Partner"
  | "Sibling"
  | "Parent"
  | "Coworker"
  | "Other";

export type EvidenceAnswers = Record<string, string>;

export interface DefenceRecord {
  option: string;
  note?: string;
  screenshot?: string;
  hasNothing?: boolean;
}

export interface Audit {
  id: string;
  caseNumber: string;
  subjectName: string;
  accuserName: string;
  relationship: Relationship;
  offenceId: string;
  offenceLabel: string;
  evidence: EvidenceAnswers;
  personality: PersonalityId;
  initialScore: number;
  initialVerdict: VerdictLabel;
  sentence: string;
  defence?: DefenceRecord;
  finalScore?: number;
  finalVerdict?: VerdictLabel;
  finalSentence?: string;
  createdAt: string;
}
