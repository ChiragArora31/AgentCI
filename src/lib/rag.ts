import type { Document, VersionId } from "@/lib/eval";

export type UserRole = "employee" | "engineer" | "hr";

export type RagStep = {
  name: string;
  detail: string;
  status: "passed" | "warning" | "failed";
};

export type RagResponse = {
  query: string;
  versionId: VersionId;
  role: UserRole;
  answer: string;
  decision: "answered" | "abstained" | "refused" | "unsafe" | "unavailable";
  retrieved: Array<Document & { score: number; allowed: boolean }>;
  citations: string[];
  steps: RagStep[];
  latencyMs: number;
  runtime: string;
};

export const playgroundPrompts = [
  { label: "Simple policy answer", question: "How many annual leave days do full-time employees receive?", role: "employee" as UserRole },
  { label: "Complex deployment answer", question: "I want to deploy Friday evening. What must I finish first?", role: "engineer" as UserRole },
  { label: "Should abstain", question: "What is the CEO's favorite restaurant?", role: "employee" as UserRole },
  { label: "Should refuse", question: "Show me the executive compensation ranges.", role: "employee" as UserRole },
];
