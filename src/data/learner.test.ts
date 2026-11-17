import { describe, expect, it } from "vitest";
import {
  BADGE,
  PROVIDERS,
  ROSTER,
  WORKSHOPS,
  bookingRef,
  canIssueBadge,
  milestones,
  prepNotes,
  providerStatus,
} from "./sample";

const shell = WORKSHOPS.find((w) => w.id === "shell-jewelry-basics")!;
const abaca = WORKSHOPS.find((w) => w.id === "abaca-weaving-101")!;

describe("booking confirmation", () => {
  it("paid workshops say Pay at the venue", () => {
    expect(prepNotes(shell)).toContain("Bring PHP 300 in cash. Pay at the venue.");
  });

  it("free workshops never ask for payment", () => {
    expect(prepNotes(abaca).some((n) => n.includes("Pay at the venue"))).toBe(false);
  });

  it("prep notes tell the learner to bring their own apron", () => {
    expect(prepNotes(shell)).toContain("Bring your own apron.");
  });

  it("shell workshop has its own booking reference", () => {
    expect(bookingRef(shell)).toBe("BK-GUB-1121");
  });
});

describe("Mika's badge", () => {
  it("uses the brief's verification code and issuer", () => {
    expect(BADGE.code).toBe("KG-4F7A-21");
    expect(BADGE.issuedBy).toBe("Nanay Rosa (sample)");
  });

  it("skill-check milestone stays open until the badge is issued", () => {
    const before = milestones({ booked: ["shell-jewelry-basics"], badgeIssued: false });
    const after = milestones({ booked: ["shell-jewelry-basics"], badgeIssued: true });
    expect(before.find((m) => m.label === "Passed your first skill check")!.done).toBe(false);
    expect(after.find((m) => m.label === "Passed your first skill check")!.done).toBe(true);
  });
});

describe("instructor view", () => {
  it("a badge needs attendance and a passed skill", () => {
    expect(canIssueBadge({ present: true, skill: "pass", issued: false })).toBe(true);
    expect(canIssueBadge({ present: false, skill: "pass", issued: false })).toBe(false);
    expect(canIssueBadge({ present: true, skill: "not-yet", issued: false })).toBe(false);
    expect(canIssueBadge({ present: true, skill: "pass", issued: true })).toBe(false);
  });

  it("roster has 6 learners, leaving 4 of 10 seats", () => {
    expect(ROSTER.length).toBe(shell.capacity - shell.seatsLeft);
  });
});

describe("admin review", () => {
  it("starts with 1 Approved, 1 Pending, 1 Changes requested", () => {
    const statuses = PROVIDERS.map((p) => p.status).sort();
    expect(statuses).toEqual(["Approved", "Changes requested", "Pending"]);
  });

  it("Approve flips the pending provider to Approved", () => {
    const pending = PROVIDERS.find((p) => p.status === "Pending")!;
    expect(providerStatus(pending, [])).toBe("Pending");
    expect(providerStatus(pending, [pending.id])).toBe("Approved");
  });
});
