import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { BOOK_OF_MORMON_SCRIPTURES } from "../data/book-of-mormon-scriptures";
import {
  buildCompactText,
  getBookOfMormonScriptureForDateKey,
  getDailyBookOfMormonScripture,
} from "./daily-scripture";

describe("daily scripture selection", () => {
  it("returns a stable scripture for a fixed calendar day", () => {
    const result = getBookOfMormonScriptureForDateKey("2026-03-14");

    expect(result.label).toBe("SCRIPTURE");
    expect(result.reference.length).toBeGreaterThan(0);
    expect(result.text.length).toBeGreaterThan(0);
    expect(result.compactText.length).toBeGreaterThan(0);
    expect(result.total).toBe(BOOK_OF_MORMON_SCRIPTURES.length);
    expect(result.dateKey).toBe("2026-03-14");
  });

  it("returns the same scripture for the same day twice", () => {
    const first = getBookOfMormonScriptureForDateKey("2026-03-14");
    const second = getBookOfMormonScriptureForDateKey("2026-03-14");

    expect(first).toEqual(second);
  });

  it("uses the date already resolved into the user's timezone", () => {
    const localDate = DateTime.fromISO("2026-03-14T00:30:00Z").setZone(
      "America/Denver",
    );

    expect(getDailyBookOfMormonScripture(localDate).dateKey).toBe("2026-03-13");
  });

  it("builds a compact fallback from the first sentence when possible", () => {
    expect(
      buildCompactText(
        "Sentence one. This second sentence makes it longer than the limit.",
        20,
      ),
    ).toBe("Sentence one.");
  });

  it("builds an ellipsized fallback when the first sentence is too long", () => {
    expect(
      buildCompactText(
        "This is a very long sentence with no early stop that needs to shrink.",
        25,
      ),
    ).toBe("This is a very long sent…");
  });
});
