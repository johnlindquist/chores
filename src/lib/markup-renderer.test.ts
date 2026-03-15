import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { getBookOfMormonScriptureForDateKey } from "./daily-scripture";
import {
  getMarkupMetrics,
  getScheduleSummary,
  renderMarkup,
} from "./markup-renderer";
import type { DaySchedule } from "./schedule-parser";

const schedule = {
  kids: [
    { name: "Ada", chores: ["Dishes", "Laundry", "Vacuum"] },
    { name: "Ben", chores: ["Trash", "Counters"] },
    { name: "Cal", chores: ["Bathroom"] },
    { name: "Dee", chores: ["Sweep", "Feed dog"] },
  ],
} as DaySchedule;

function extractRootId(markup: string): string {
  const match = markup.match(/<div id="([^"]+)">/);

  if (!match) {
    throw new Error("Expected root element id in markup output.");
  }

  return match[1];
}

describe("renderMarkup", () => {
  it("uses a unique root id for each layout variant", () => {
    const date = DateTime.fromISO("2026-01-02", { zone: "America/Denver" });
    const scripture = getBookOfMormonScriptureForDateKey("2026-01-02");
    const markup = renderMarkup(schedule, date, "preview-local", scripture);

    const ids = [
      extractRootId(markup.markup),
      extractRootId(markup.markup_half_horizontal),
      extractRootId(markup.markup_half_vertical),
      extractRootId(markup.markup_quadrant),
    ];

    expect(new Set(ids).size).toBe(4);
    expect(ids).toEqual([
      "c-preview-local-full",
      "c-preview-local-half-horizontal",
      "c-preview-local-half-vertical",
      "c-preview-local-quadrant",
    ]);
  });

  it("renders the full scripture text in every non-quadrant layout", () => {
    const date = DateTime.fromISO("2026-01-02", { zone: "America/Denver" });
    const scripture = getBookOfMormonScriptureForDateKey("2026-01-02");
    const markup = renderMarkup(schedule, date, "verification-case", scripture);

    expect(scripture.reference).toBe("2 Nephi 3:21");
    expect(scripture.text.length).toBeGreaterThan(scripture.compactText.length);

    expect(markup.markup).toContain(scripture.reference);
    expect(markup.markup).toContain(scripture.text);

    expect(markup.markup_half_horizontal).toContain(scripture.reference);
    expect(markup.markup_half_horizontal).toContain(scripture.text);

    expect(markup.markup_half_vertical).toContain(scripture.reference);
    expect(markup.markup_half_vertical).toContain(scripture.text);

    expect(markup.markup_quadrant).not.toContain(scripture.reference);
    expect(markup.markup_quadrant).not.toContain(scripture.text);
  });

  it("falls back to the default scripture when none is provided", () => {
    const date = DateTime.fromISO("2026-03-14", { zone: "America/Denver" });
    const result = renderMarkup(schedule, date, "fallback-test", null);

    expect(result.markup).toContain("Mosiah 2:17");
  });

  it("emits machine-readable schedule and markup metrics", () => {
    const date = DateTime.fromISO("2026-01-02", { zone: "America/Denver" });
    const scripture = getBookOfMormonScriptureForDateKey("2026-01-02");
    const markup = renderMarkup(schedule, date, "metrics-case", scripture);

    expect(getScheduleSummary(schedule)).toEqual({
      kidCount: 4,
      totalChores: 8,
      emptyKidCount: 0,
    });

    expect(getMarkupMetrics(markup)).toEqual({
      fullLength: markup.markup.length,
      halfHorizontalLength: markup.markup_half_horizontal.length,
      halfVerticalLength: markup.markup_half_vertical.length,
      quadrantLength: markup.markup_quadrant.length,
    });
  });
});
