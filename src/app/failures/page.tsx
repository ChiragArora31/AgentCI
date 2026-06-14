import { FailuresView } from "@/components/failures-view";
import type { VersionId } from "@/lib/eval";

export default async function FailuresPage({ searchParams }: { searchParams: Promise<{ candidate?: string; scenario?: string }> }) {
  const params = await searchParams;
  const candidate: VersionId = params.candidate === "v3-fixed" ? "v3-fixed" : "v2-candidate";
  return <FailuresView initialCandidate={candidate} initialScenario={params.scenario} />;
}
