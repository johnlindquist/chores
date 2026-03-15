import type { DateTime } from "luxon";
import {
  BOOK_OF_MORMON_SCRIPTURES,
  type BookOfMormonScripture,
} from "@/data/book-of-mormon-scriptures";

export interface DailyScripture {
  label: "SCRIPTURE";
  reference: string;
  text: string;
  compactText: string;
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

export function buildCompactText(text: string, maxLength = 96): string {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const firstSentence = normalized.match(/^[^.?!]+[.?!]/)?.[0]?.trim();

  if (firstSentence && firstSentence.length <= maxLength) {
    return firstSentence;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function toDailyScripture(
  scripture: BookOfMormonScripture,
  index: number,
  dateKey: string,
): DailyScripture {
  return {
    label: "SCRIPTURE",
    reference: scripture.reference,
    text: scripture.text,
    compactText: buildCompactText(scripture.text),
    index,
    total: BOOK_OF_MORMON_SCRIPTURES.length,
    dateKey,
  };
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

  return toDailyScripture(scripture, index, dateKey);
}

export function getDailyBookOfMormonScripture(date: DateTime): DailyScripture {
  return getBookOfMormonScriptureForDateKey(date.toFormat("yyyy-MM-dd"));
}

export type {
  ScriptureCatalogIssue,
  ScriptureCatalogSummary,
} from "./scripture-catalog";
export {
  getScriptureCatalogSummary,
  validateScriptureCatalog,
} from "./scripture-catalog";
