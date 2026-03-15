import { describe, expect, it } from "vitest";
import { BOOK_OF_MORMON_SCRIPTURES } from "@/data/book-of-mormon-scriptures";
import { BOOK_OF_MORMON_SCRIPTURE_MANIFEST } from "@/data/book-of-mormon-scriptures.manifest";
import {
  getScriptureCatalogSummary,
  validateScriptureCatalog,
} from "./scripture-catalog";

describe("Book of Mormon scripture catalog", () => {
  it("has no duplicates or empty entries", () => {
    expect(validateScriptureCatalog(BOOK_OF_MORMON_SCRIPTURES)).toEqual([]);
  });

  it("matches the generated manifest", () => {
    const summary = getScriptureCatalogSummary(BOOK_OF_MORMON_SCRIPTURES);

    expect(summary.total).toBe(BOOK_OF_MORMON_SCRIPTURE_MANIFEST.total);
    expect(summary.checksum).toBe(BOOK_OF_MORMON_SCRIPTURE_MANIFEST.checksum);
    expect(summary.references[0] ?? null).toBe(
      BOOK_OF_MORMON_SCRIPTURE_MANIFEST.firstReference,
    );
    expect(summary.references.at(-1) ?? null).toBe(
      BOOK_OF_MORMON_SCRIPTURE_MANIFEST.lastReference,
    );
    expect(summary.longestTextLength).toBe(
      BOOK_OF_MORMON_SCRIPTURE_MANIFEST.longestTextLength,
    );
    expect(summary.shortestTextLength).toBe(
      BOOK_OF_MORMON_SCRIPTURE_MANIFEST.shortestTextLength,
    );
    expect(summary.over96Chars).toBe(
      BOOK_OF_MORMON_SCRIPTURE_MANIFEST.over96Chars,
    );
    expect(summary.over240Chars).toBe(
      BOOK_OF_MORMON_SCRIPTURE_MANIFEST.over240Chars,
    );
    expect(summary.over480Chars).toBe(
      BOOK_OF_MORMON_SCRIPTURE_MANIFEST.over480Chars,
    );
  });

  it("is no longer a tiny placeholder catalog", () => {
    expect(BOOK_OF_MORMON_SCRIPTURE_MANIFEST.total).toBeGreaterThanOrEqual(
      5000,
    );
  });
});
