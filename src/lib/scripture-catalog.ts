import {
  BOOK_OF_MORMON_SCRIPTURES,
  type BookOfMormonScripture,
} from "@/data/book-of-mormon-scriptures";

export type ScriptureCatalogIssueCode =
  | "duplicate_reference"
  | "empty_reference"
  | "empty_text";

export interface ScriptureCatalogIssue {
  code: ScriptureCatalogIssueCode;
  index: number;
  reference: string | null;
  message: string;
}

export interface ScriptureCatalogSummary {
  total: number;
  checksum: string;
  references: string[];
  longestReference: string;
  longestTextLength: number;
  shortestTextLength: number;
  over96Chars: number;
  over240Chars: number;
  over480Chars: number;
}

function stableCatalogHash(input: string, seed = 2089): string {
  let hash = seed;

  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
  }

  return Math.abs(hash).toString(16).padStart(8, "0");
}

export function validateScriptureCatalog(
  scriptures: readonly BookOfMormonScripture[] = BOOK_OF_MORMON_SCRIPTURES,
): ScriptureCatalogIssue[] {
  const issues: ScriptureCatalogIssue[] = [];
  const seen = new Map<string, number>();

  scriptures.forEach((scripture, index) => {
    const reference = scripture.reference.trim();
    const text = scripture.text.trim();

    if (!reference) {
      issues.push({
        code: "empty_reference",
        index,
        reference: null,
        message: `Scripture at index ${index} is missing a reference.`,
      });
    } else if (seen.has(reference)) {
      issues.push({
        code: "duplicate_reference",
        index,
        reference,
        message: `Reference "${reference}" is duplicated at indexes ${seen.get(reference)} and ${index}.`,
      });
    } else {
      seen.set(reference, index);
    }

    if (!text) {
      issues.push({
        code: "empty_text",
        index,
        reference: reference || null,
        message: `Scripture "${reference || `index ${index}`}" is missing verse text.`,
      });
    }
  });

  return issues;
}

export function getScriptureCatalogSummary(
  scriptures: readonly BookOfMormonScripture[] = BOOK_OF_MORMON_SCRIPTURES,
): ScriptureCatalogSummary {
  if (scriptures.length === 0) {
    return {
      total: 0,
      checksum: stableCatalogHash("[]"),
      references: [],
      longestReference: "",
      longestTextLength: 0,
      shortestTextLength: 0,
      over96Chars: 0,
      over240Chars: 0,
      over480Chars: 0,
    };
  }

  const normalized = scriptures.map((scripture) => ({
    reference: scripture.reference.trim(),
    text: scripture.text.replace(/\s+/g, " ").trim(),
  }));

  const lengths = normalized.map((scripture) => scripture.text.length);
  const longest = normalized.reduce((current, next) =>
    next.text.length > current.text.length ? next : current,
  );
  const countAbove = (limit: number) =>
    lengths.filter((length) => length > limit).length;

  return {
    total: normalized.length,
    checksum: stableCatalogHash(
      JSON.stringify(
        normalized.map((scripture) => [scripture.reference, scripture.text]),
      ),
    ),
    references: normalized.map((scripture) => scripture.reference),
    longestReference: longest.reference,
    longestTextLength: Math.max(...lengths),
    shortestTextLength: Math.min(...lengths),
    over96Chars: countAbove(96),
    over240Chars: countAbove(240),
    over480Chars: countAbove(480),
  };
}
