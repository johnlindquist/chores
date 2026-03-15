import type { DateTime } from "luxon";
import type { DailyScripture } from "@/lib/daily-scripture";
import {
  getMarkupMetrics,
  getScheduleSummary,
  type MarkupResult,
} from "@/lib/markup-renderer";
import type { DaySchedule } from "@/lib/schedule-parser";
import { getScriptureCatalogSummary } from "@/lib/scripture-catalog";

export type TrmnlMarkupErrorCode =
  | "unauthorized"
  | "missing_user_uuid"
  | "instance_not_found"
  | "invalid_scripture_catalog"
  | "internal_error";

export interface TrmnlMarkupDiagnostics {
  date: string;
  timezone: string;
  scripture: {
    reference: string;
    index: number;
    total: number;
    textLength: number;
    compactTextLength: number;
    catalogChecksum: string;
    catalogSize: number;
  };
  schedule: ReturnType<typeof getScheduleSummary>;
  markup: ReturnType<typeof getMarkupMetrics>;
}

export interface TrmnlMarkupErrorBody {
  error: {
    code: TrmnlMarkupErrorCode;
    message: string;
    hint?: string;
    details?: Record<string, unknown>;
  };
}

export function buildTrmnlMarkupDiagnostics(
  date: DateTime,
  timezone: string,
  schedule: DaySchedule,
  markup: MarkupResult,
  scripture: DailyScripture,
): TrmnlMarkupDiagnostics {
  const catalog = getScriptureCatalogSummary();

  return {
    date: date.toISODate() ?? date.toFormat("yyyy-MM-dd"),
    timezone,
    scripture: {
      reference: scripture.reference,
      index: scripture.index,
      total: scripture.total,
      textLength: scripture.text.length,
      compactTextLength: scripture.compactText.length,
      catalogChecksum: catalog.checksum,
      catalogSize: catalog.total,
    },
    schedule: getScheduleSummary(schedule),
    markup: getMarkupMetrics(markup),
  };
}

export function buildTrmnlMarkupError(
  code: TrmnlMarkupErrorCode,
  message: string,
  hint?: string,
  details?: Record<string, unknown>,
): TrmnlMarkupErrorBody {
  return {
    error: {
      code,
      message,
      ...(hint ? { hint } : {}),
      ...(details ? { details } : {}),
    },
  };
}

export function applyTrmnlMarkupDiagnosticHeaders(
  headers: Headers,
  diagnostics: TrmnlMarkupDiagnostics,
): Headers {
  headers.set("x-chores-date", diagnostics.date);
  headers.set("x-chores-timezone", diagnostics.timezone);
  headers.set("x-chores-scripture-reference", diagnostics.scripture.reference);
  headers.set("x-chores-scripture-index", String(diagnostics.scripture.index));
  headers.set("x-chores-scripture-total", String(diagnostics.scripture.total));
  headers.set(
    "x-chores-scripture-catalog-size",
    String(diagnostics.scripture.catalogSize),
  );
  headers.set(
    "x-chores-scripture-catalog-checksum",
    diagnostics.scripture.catalogChecksum,
  );
  headers.set(
    "x-chores-markup-full-length",
    String(diagnostics.markup.fullLength),
  );
  headers.set(
    "x-chores-markup-half-horizontal-length",
    String(diagnostics.markup.halfHorizontalLength),
  );
  headers.set(
    "x-chores-markup-half-vertical-length",
    String(diagnostics.markup.halfVerticalLength),
  );
  headers.set(
    "x-chores-markup-quadrant-length",
    String(diagnostics.markup.quadrantLength),
  );

  return headers;
}
