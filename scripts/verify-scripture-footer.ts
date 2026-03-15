import { DateTime } from "luxon";
import {
  getBookOfMormonScriptureForDateKey,
  getDailyBookOfMormonScripture,
} from "../src/lib/daily-scripture";
import { renderMarkup } from "../src/lib/markup-renderer";

type CheckResult =
  | {
      name: string;
      ok: true;
      details?: Record<string, unknown>;
    }
  | {
      name: string;
      ok: false;
      error: string;
      details?: Record<string, unknown>;
    };

function pass(name: string, details?: Record<string, unknown>): CheckResult {
  return {
    name,
    ok: true,
    details,
  };
}

function fail(
  name: string,
  error: string,
  details?: Record<string, unknown>,
): CheckResult {
  return {
    name,
    ok: false,
    error,
    details,
  };
}

const date = DateTime.fromISO("2026-03-14T12:00:00", {
  zone: "America/Denver",
});

const schedule: Parameters<typeof renderMarkup>[0] = {
  kids: [
    { name: "Ava", chores: ["Make bed"] },
    { name: "Ben", chores: ["Take out trash"] },
    { name: "Chloe", chores: [] },
    { name: "Dylan", chores: ["Sweep entry"] },
  ],
};

function verifyStableDailySelection(): CheckResult {
  const first = getBookOfMormonScriptureForDateKey("2026-03-14");
  const second = getBookOfMormonScriptureForDateKey("2026-03-14");

  if (JSON.stringify(first) !== JSON.stringify(second)) {
    return fail(
      "stable_daily_selection",
      "same date returned different scriptures",
      {
        first,
        second,
      },
    );
  }

  return pass("stable_daily_selection", {
    dateKey: first.dateKey,
    reference: first.reference,
    index: first.index,
  });
}

function verifyTimezoneBoundary(): CheckResult {
  const localDate = DateTime.fromISO("2026-03-14T00:30:00Z").setZone(
    "America/Denver",
  );
  const scripture = getDailyBookOfMormonScripture(localDate);

  if (scripture.dateKey !== "2026-03-13") {
    return fail(
      "timezone_boundary",
      "timezone-resolved date key did not roll back into the previous local day",
      {
        expected: "2026-03-13",
        received: scripture.dateKey,
      },
    );
  }

  return pass("timezone_boundary", {
    dateKey: scripture.dateKey,
    reference: scripture.reference,
  });
}

function verifyMarkupFooters(): CheckResult {
  const scripture = {
    label: "SCRIPTURE" as const,
    reference: "Alma 32:21",
    text: 'Faith <works> & "grows".',
    compactText: 'Faith <works> & "grows".',
    index: 0,
    total: 7,
    dateKey: "2026-03-14",
  };

  const result = renderMarkup(schedule, date, "1234567890abcdef", scripture);
  const escapedBody = "Faith &lt;works&gt; &amp; &quot;grows&quot;.";

  const footerLayouts = [
    "markup",
    "markup_half_horizontal",
    "markup_half_vertical",
  ] as const;

  const missing = footerLayouts.filter(
    (layout) =>
      !result[layout].includes("SCRIPTURE") ||
      !result[layout].includes("Alma 32:21") ||
      !result[layout].includes(escapedBody),
  );

  if (missing.length > 0) {
    return fail(
      "markup_footers",
      "one or more footer-bearing layouts did not render the escaped scripture body",
      {
        missing,
      },
    );
  }

  if (result.markup_quadrant.includes("SCRIPTURE")) {
    return fail(
      "quadrant_layout_footer",
      "quadrant layout unexpectedly rendered a scripture footer",
    );
  }

  if (result.markup.includes('Faith <works> & "grows".')) {
    return fail(
      "html_escaping",
      "unescaped scripture text leaked into rendered markup",
    );
  }

  return pass("markup_footers", {
    validatedLayouts: footerLayouts,
    quadrantFooterSuppressed: true,
  });
}

function verifyFallbackFooter(): CheckResult {
  const result = renderMarkup(schedule, date, "1234567890abcdef", null);
  const fallbackText =
    "When ye are in the service of your fellow beings ye are only in the service of your God.";

  if (!result.markup.includes(fallbackText)) {
    return fail(
      "fallback_footer",
      "fallback scripture did not render in the full layout",
      {
        expected: fallbackText,
      },
    );
  }

  return pass("fallback_footer", {
    reference: "Mosiah 2:17",
  });
}

const checks: CheckResult[] = [
  verifyStableDailySelection(),
  verifyTimezoneBoundary(),
  verifyMarkupFooters(),
  verifyFallbackFooter(),
];

const summary = {
  ok: checks.every((check) => check.ok),
  generatedAt: new Date().toISOString(),
  checks,
};

console.log(JSON.stringify(summary, null, 2));

if (!summary.ok) {
  process.exit(1);
}
