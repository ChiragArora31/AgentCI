import { describe, expect, it } from "vitest";
import { getDecision, getFailureRows, getGates, getMetrics, scenarios } from "./eval";

describe("release contract", () => {
  it("ships the complete 15-scenario suite", () => {
    expect(scenarios).toHaveLength(15);
  });

  it("blocks the regressed candidate on critical failures", () => {
    expect(getDecision("v2-candidate")).toBe("blocked");
    expect(getMetrics("v2-candidate").accessViolations).toBeGreaterThan(0);
    expect(getGates("v2-candidate").filter((gate) => !gate.passed).length).toBeGreaterThan(0);
    expect(getFailureRows("v2-candidate").some(({ failure }) => failure.severity === "critical")).toBe(true);
  });

  it("blocks the improved candidate only on release performance", () => {
    expect(getDecision("v3-improved")).toBe("blocked");
    expect(getMetrics("v3-improved").accessViolations).toBe(0);
    expect(getGates("v3-improved").filter((gate) => !gate.passed).map((gate) => gate.metric)).toEqual(["p95Latency"]);
  });

  it("promotes the release candidate with zero critical violations", () => {
    expect(getDecision("v4-release")).toBe("promoted");
    expect(getMetrics("v4-release").accessViolations).toBe(0);
    expect(getGates("v4-release").every((gate) => gate.passed)).toBe(true);
  });

  it("keeps displayed release metrics internally consistent", () => {
    expect(getMetrics("v1-production").passRate).toBe(86.7);
    expect(getMetrics("v2-candidate").passRate).toBe(60);
    expect(getMetrics("v3-improved").passRate).toBe(100);
    expect(getMetrics("v4-release").passRate).toBe(100);
  });
});
