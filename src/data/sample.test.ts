import { describe, expect, it } from "vitest";
import { WORKSHOPS, filterWorkshops, formatFee, seatsLabel } from "./sample";

describe("sample workshops", () => {
  it("shows the pottery session as Full", () => {
    const pottery = WORKSHOPS.find((w) => w.craft === "Pottery")!;
    expect(seatsLabel(pottery)).toBe("Full");
  });

  it("shows the shell jewelry workshop with 4 of 10 seats left", () => {
    const shell = WORKSHOPS.find((w) => w.id === "shell-jewelry-basics")!;
    expect(seatsLabel(shell)).toBe("4 of 10 seats left");
    expect(formatFee(shell.fee)).toBe("PHP 300");
  });

  it("shows the sponsored abaca workshop as Free", () => {
    const abaca = WORKSHOPS.find((w) => w.craft === "Abaca weaving")!;
    expect(formatFee(abaca.fee)).toBe("Free");
  });
});

describe("discover filters", () => {
  it("Gubat + Beginner shows only the shell jewelry workshop", () => {
    const res = filterWorkshops(WORKSHOPS, { town: "Gubat", level: "Beginner" });
    expect(res.map((w) => w.id)).toEqual(["shell-jewelry-basics"]);
  });

  it("Free shows only the sponsored abaca workshop", () => {
    const res = filterWorkshops(WORKSHOPS, { cost: "free" });
    expect(res.map((w) => w.id)).toEqual(["abaca-weaving-101"]);
  });

  it("Weekdays shows only the Friday basketry session", () => {
    const res = filterWorkshops(WORKSHOPS, { when: "weekday" });
    expect(res.map((w) => w.id)).toEqual(["rattan-basketry"]);
  });
});
