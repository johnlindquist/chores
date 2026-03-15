import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { getBookOfMormonScriptureForDateKey } from "./daily-scripture";
import { renderMarkup } from "./markup-renderer";
import type { DaySchedule } from "./schedule-parser";
import {
  applyTrmnlMarkupDiagnosticHeaders,
  buildTrmnlMarkupDiagnostics,
  buildTrmnlMarkupError,
} from "./trmnl-markup-observability";

const schedule: DaySchedule = {
  kids: [
    { name: "Ada", chores: ["Dishes", "Laundry", "Vacuum"] },
    { name: "Ben", chores: ["Trash", "Counters"] },
    { name: "Cal", chores: ["Bathroom"] },
    { name: "Dee", chores: ["Sweep", "Feed dog"] },
  ],
};

describe("trmnl-markup-observability", () => {
  it("builds deterministic diagnostics for a rendered payload", () => {
    const date = DateTime.fromISO("2026-03-14", { zone: "America/Denver" });
    const scripture = getBookOfMormonScriptureForDateKey("2026-03-14");
    const markup = renderMarkup(
      schedule,
      date,
      "observability-case",
      scripture,
    );

    expect(
      buildTrmnlMarkupDiagnostics(
        date,
        "America/Denver",
        schedule,
        markup,
        scripture,
      ),
    ).toEqual({
      date: "2026-03-14",
      timezone: "America/Denver",
      scripture: {
        reference: "1 Nephi 19:7",
        index: 521,
        total: 6604,
        textLength: 337,
        compactTextLength: 96,
        catalogChecksum: "45282169",
        catalogSize: 6604,
      },
      schedule: {
        kidCount: 4,
        totalChores: 8,
        emptyKidCount: 0,
      },
      markup: {
        fullLength: markup.markup.length,
        halfHorizontalLength: markup.markup_half_horizontal.length,
        halfVerticalLength: markup.markup_half_vertical.length,
        quadrantLength: markup.markup_quadrant.length,
      },
    });
  });

  it("builds coded errors with optional hints", () => {
    expect(
      buildTrmnlMarkupError(
        "missing_user_uuid",
        "Missing user_uuid.",
        "Provide `user_uuid` in either a JSON body or form-encoded body.",
      ),
    ).toEqual({
      error: {
        code: "missing_user_uuid",
        message: "Missing user_uuid.",
        hint: "Provide `user_uuid` in either a JSON body or form-encoded body.",
      },
    });
  });

  it("writes diagnostics into headers", () => {
    const date = DateTime.fromISO("2026-03-14", { zone: "America/Denver" });
    const scripture = getBookOfMormonScriptureForDateKey("2026-03-14");
    const markup = renderMarkup(schedule, date, "header-case", scripture);
    const diagnostics = buildTrmnlMarkupDiagnostics(
      date,
      "America/Denver",
      schedule,
      markup,
      scripture,
    );

    const headers = applyTrmnlMarkupDiagnosticHeaders(
      new Headers(),
      diagnostics,
    );

    expect(headers.get("x-chores-date")).toBe("2026-03-14");
    expect(headers.get("x-chores-timezone")).toBe("America/Denver");
    expect(headers.get("x-chores-scripture-reference")).toBe("1 Nephi 19:7");
    expect(headers.get("x-chores-scripture-catalog-checksum")).toBe("45282169");
  });
});
