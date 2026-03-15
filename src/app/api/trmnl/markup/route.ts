import { DateTime, IANAZone } from "luxon";
import { type NextRequest, NextResponse } from "next/server";
import { getDailyBookOfMormonScripture } from "@/lib/daily-scripture";
import { getPluginInstance } from "@/lib/db";
import { logEvent } from "@/lib/log-event";
import { renderMarkup } from "@/lib/markup-renderer";
import { getTodayChores } from "@/lib/schedule-parser";
import { validateScriptureCatalog } from "@/lib/scripture-catalog";
import {
  applyTrmnlMarkupDiagnosticHeaders,
  buildTrmnlMarkupDiagnostics,
  buildTrmnlMarkupError,
} from "@/lib/trmnl-markup-observability";

function shouldIncludeDiagnostics(request: NextRequest): boolean {
  const value = request.nextUrl.searchParams.get("diagnostics")?.toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  let userUuid: string | null = null;
  const includeDiagnostics = shouldIncludeDiagnostics(request);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logEvent("error", {
      event: "trmnl_markup_unauthorized",
      reason: "missing_or_invalid_authorization_header",
    });

    return NextResponse.json(
      buildTrmnlMarkupError(
        "unauthorized",
        "Unauthorized.",
        "Send an Authorization header in the form `Bearer <access_token>`.",
      ),
      { status: 401 },
    );
  }

  const accessToken = authHeader.slice(7);

  try {
    const contentType = request.headers.get("Content-Type") || "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      userUuid = formData.get("user_uuid") as string | null;
    } else if (contentType.includes("application/json")) {
      const body = (await request.json()) as { user_uuid?: string };
      userUuid = body.user_uuid ?? null;
    }

    logEvent("info", {
      event: "trmnl_markup_request_parsed",
      contentType,
      userUuidPresent: Boolean(userUuid),
      diagnosticsRequested: includeDiagnostics,
    });

    if (!userUuid) {
      logEvent("error", {
        event: "trmnl_markup_bad_request",
        reason: "missing_user_uuid",
      });

      return NextResponse.json(
        buildTrmnlMarkupError(
          "missing_user_uuid",
          "Missing user_uuid.",
          "Provide `user_uuid` in either a JSON body or form-encoded body.",
        ),
        { status: 400 },
      );
    }

    const catalogIssues = validateScriptureCatalog();

    if (catalogIssues.length > 0) {
      logEvent("error", {
        event: "trmnl_markup_invalid_scripture_catalog",
        userUuid,
        issueCount: catalogIssues.length,
        issues: catalogIssues,
      });

      return NextResponse.json(
        buildTrmnlMarkupError(
          "invalid_scripture_catalog",
          "Scripture catalog is invalid.",
          "Fix empty or duplicate entries in `src/data/book-of-mormon-scriptures.ts`.",
          {
            issueCount: catalogIssues.length,
            issues: catalogIssues,
          },
        ),
        { status: 500 },
      );
    }

    const instance = await getPluginInstance(userUuid);

    if (!instance) {
      logEvent("error", {
        event: "trmnl_markup_instance_not_found",
        userUuid,
      });

      return NextResponse.json(
        buildTrmnlMarkupError(
          "instance_not_found",
          "Instance not found.",
          "Make sure the TRMNL plugin instance exists for the supplied user_uuid.",
        ),
        { status: 404 },
      );
    }

    if (instance.access_token !== accessToken) {
      logEvent("error", {
        event: "trmnl_markup_unauthorized",
        userUuid,
        reason: "access_token_mismatch",
      });

      return NextResponse.json(
        buildTrmnlMarkupError(
          "unauthorized",
          "Unauthorized.",
          "The provided bearer token does not match the stored TRMNL plugin access token.",
        ),
        { status: 401 },
      );
    }

    const configuredTimezone = instance.time_zone_iana || "America/Denver";
    const timezone = IANAZone.isValidZone(configuredTimezone)
      ? configuredTimezone
      : "America/Denver";

    logEvent("info", {
      event: "trmnl_markup_timezone_resolved",
      userUuid,
      configuredTimezone,
      timezone,
      usedFallback: timezone !== configuredTimezone,
    });

    const today = DateTime.now().setZone(timezone);
    const todaySchedule = getTodayChores(instance.schedule_text, timezone);
    const dailyScripture = getDailyBookOfMormonScripture(today);
    const markup = renderMarkup(todaySchedule, today, userUuid, dailyScripture);
    const diagnostics = buildTrmnlMarkupDiagnostics(
      today,
      timezone,
      todaySchedule,
      markup,
      dailyScripture,
    );

    logEvent("info", {
      event: "trmnl_markup_generated",
      userUuid,
      diagnostics,
    });

    const response = NextResponse.json(
      includeDiagnostics ? { ...markup, meta: diagnostics } : markup,
    );

    applyTrmnlMarkupDiagnosticHeaders(response.headers, diagnostics);

    return response;
  } catch (error) {
    logEvent("error", {
      event: "trmnl_markup_generation_failed",
      userUuid,
      message: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      buildTrmnlMarkupError(
        "internal_error",
        "Failed to generate TRMNL markup.",
        "Inspect the `trmnl_markup_generation_failed` log event for structured details.",
      ),
      { status: 500 },
    );
  }
}
