import { NextResponse } from "next/server";
import { executeRealRag } from "@/lib/rag-engine";
import type { UserRole } from "@/lib/rag";
import type { VersionId } from "@/lib/eval";

export const runtime = "nodejs";
export const maxDuration = 30;

const versionIds = new Set<VersionId>(["v1-production", "v2-candidate", "v3-fixed"]);
const userRoles = new Set<UserRole>(["employee", "engineer", "hr"]);

export async function POST(request: Request) {
  try {
    const body = await request.json() as { query?: unknown; versionId?: unknown; role?: unknown };
    const query = typeof body.query === "string" ? body.query.trim() : "";
    if (!query || query.length > 1_000 || !versionIds.has(body.versionId as VersionId) || !userRoles.has(body.role as UserRole)) {
      return NextResponse.json({ error: "Provide a query under 1,000 characters, a valid version, and a valid role." }, { status: 400 });
    }
    return NextResponse.json(await executeRealRag(query, body.versionId as VersionId, body.role as UserRole), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("RAG request failed", error);
    return NextResponse.json({ error: "The RAG request could not be completed. Please try again." }, { status: 502 });
  }
}
