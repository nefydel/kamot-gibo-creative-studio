import { describe, expect, it } from "vitest";
import { BADGE, COURSES, WORKSHOPS, courseSeats, enrolledCount, enrolledLabel, seatsLabel } from "./sample";
import { badgePost, facebookShareUrl, workshopPost } from "@/lib/share";

const shell = WORKSHOPS.find((w) => w.id === "shell-jewelry-basics")!;

describe("enrollment count", () => {
  it("shell workshop shows 6 learners enrolled, separate from 4 of 10 seats left", () => {
    expect(enrolledLabel(enrolledCount(shell))).toBe("6 learners enrolled");
    expect(seatsLabel(shell)).toBe("4 of 10 seats left");
  });

  it("enrolling in a course adds one learner and removes one seat", () => {
    const c = COURSES.find((x) => x.id === "advanced-buskay-patterns")!;
    expect(courseSeats(c, false)).toEqual({ enrolled: 5, seatsLeft: 3 });
    expect(courseSeats(c, true)).toEqual({ enrolled: 6, seatsLeft: 2 });
  });
});

describe("Facebook sharing", () => {
  it("uses Facebook's public share link with the page URL", () => {
    const post = workshopPost(shell, "https://example.com/workshops/shell-jewelry-basics");
    const url = facebookShareUrl(post);
    expect(url.startsWith("https://www.facebook.com/sharer/sharer.php?")).toBe(true);
    expect(new URL(url).searchParams.get("u")).toBe("https://example.com/workshops/shell-jewelry-basics");
  });

  it("badge post keeps the Skill-verified ng KamotGibo wording", () => {
    expect(badgePost(BADGE, "https://example.com").text).toContain("Skill-verified ng KamotGibo");
  });
});
