import type { DateTime } from "luxon";
import { BOOK_OF_MORMON_SCRIPTURES } from "@/data/book-of-mormon-scriptures";

export interface DailyScripture {
  label: "SCRIPTURE";
  reference: string;
  text: string;
  index: number;
  total: number;
  dateKey: string;
}

export function hashDateKey(dateKey: string, seed = 733): number {
  let hash = seed;

  for (let i = 0; i < dateKey.length; i++) {
    hash = ((hash << 5) - hash + dateKey.charCodeAt(i)) | 0;
  }

  return Math.abs(hash);
}

export function getBookOfMormonScriptureForDateKey(
  dateKey: string,
): DailyScripture {
  if (BOOK_OF_MORMON_SCRIPTURES.length === 0) {
    throw new Error(
      "BOOK_OF_MORMON_SCRIPTURES must contain at least one entry.",
    );
  }

  const index = hashDateKey(dateKey, 733) % BOOK_OF_MORMON_SCRIPTURES.length;
  const scripture = BOOK_OF_MORMON_SCRIPTURES[index];

  return {
    label: "SCRIPTURE",
    reference: scripture.reference,
    text: scripture.excerpt,
    index,
    total: BOOK_OF_MORMON_SCRIPTURES.length,
    dateKey,
  };
}

export function getDailyBookOfMormonScripture(date: DateTime): DailyScripture {
  return getBookOfMormonScriptureForDateKey(date.toFormat("yyyy-MM-dd"));
}
