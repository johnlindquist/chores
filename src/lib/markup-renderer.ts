import type { DateTime } from "luxon";
import {
  ACTION_VERBS,
  ARCHAIC_WORDS,
  EMOTIONS,
  FOODS,
  NATURE,
  POSITIVE_WORDS,
  RANDOM_NOUNS,
  SILLY_WORDS,
  SOUNDS,
  VOCAB_WORDS,
  type WordEntry,
} from "../data/words";
import type { DailyScripture } from "./daily-scripture";
import type { DaySchedule, KidChores } from "./schedule-parser";

// Deterministic hash for a date string + seed.
// Different seeds per category so words don't advance in lockstep.
function hashDate(dateStr: string, seed: number): number {
  let hash = seed;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getDailyWords(
  date: DateTime,
): { word: string; def: string; cat: string }[] {
  const dateStr = date.toFormat("yyyy-MM-dd");

  const categories: { words: WordEntry[]; cat: string; seed: number }[] = [
    { words: ARCHAIC_WORDS, cat: "Archaic", seed: 7 },
    { words: RANDOM_NOUNS, cat: "Noun", seed: 13 },
    { words: SILLY_WORDS, cat: "Silly", seed: 31 },
    { words: VOCAB_WORDS, cat: "Vocab", seed: 53 },
    { words: POSITIVE_WORDS, cat: "Positive", seed: 97 },
    { words: ACTION_VERBS, cat: "Action", seed: 151 },
    { words: EMOTIONS, cat: "Emotion", seed: 211 },
    { words: FOODS, cat: "Food", seed: 277 },
    { words: SOUNDS, cat: "Sound", seed: 347 },
    { words: NATURE, cat: "Nature", seed: 419 },
  ];

  return categories.map(({ words, cat, seed }) => {
    const index = hashDate(dateStr, seed) % words.length;
    return { ...words[index], cat };
  });
}

export interface MarkupResult {
  markup: string;
  markup_half_horizontal: string;
  markup_half_vertical: string;
  markup_quadrant: string;
}

export interface MarkupMetrics {
  fullLength: number;
  halfHorizontalLength: number;
  halfVerticalLength: number;
  quadrantLength: number;
}

export interface ScheduleSummary {
  kidCount: number;
  totalChores: number;
  emptyKidCount: number;
}

export function getMarkupMetrics(markup: MarkupResult): MarkupMetrics {
  return {
    fullLength: markup.markup.length,
    halfHorizontalLength: markup.markup_half_horizontal.length,
    halfVerticalLength: markup.markup_half_vertical.length,
    quadrantLength: markup.markup_quadrant.length,
  };
}

export function getScheduleSummary(schedule: DaySchedule): ScheduleSummary {
  return {
    kidCount: schedule.kids.length,
    totalChores: schedule.kids.reduce((sum, kid) => sum + kid.chores.length, 0),
    emptyKidCount: schedule.kids.filter((kid) => kid.chores.length === 0)
      .length,
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(date: DateTime): string {
  return date.toFormat("cccc, LLL d");
}

type ScriptureLayout = "full" | "half-horizontal" | "half-vertical";

type MarkupVariant = "full" | "half-horizontal" | "half-vertical" | "quadrant";

function buildMarkupRootId(
  instanceUuid: string,
  variant: MarkupVariant,
): string {
  const normalized = instanceUuid
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .replace(/[-_]+$/g, "")
    .slice(0, 16);

  return `c-${normalized || "instance"}-${variant}`;
}

function getBaseStyles(id: string): string {
  return `
    <style>
      #${id} { font-family: var(--font-geist-pixel-square), Arial, Helvetica, sans-serif; background: #fff; color: #000; padding: 0; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; }
      #${id} .content { min-height: 0; flex: 1 1 auto; overflow: hidden; display: flex; flex-direction: column; }
      #${id} .date-bar { padding: 8px 20px; font-size: 14px; color: #000; letter-spacing: 0.5px; border-bottom: 1px solid #000; }
      #${id} .grid { display: grid; grid-template-columns: repeat(4, 1fr); flex: 1 1 auto; }
      #${id} .kid { padding: 12px 14px; border-right: 1px solid #000; }
      #${id} .kid:last-child { border-right: none; }
      #${id} .kid-name { font-size: 26px; font-weight: 700; background: #000; color: #fff; padding: 6px 8px; margin: -12px -14px 8px -14px; letter-spacing: 0.5px; }
      #${id} .chore { font-size: 16px; padding: 5px 0; color: #000; line-height: 1.3; }
      #${id} .chore + .chore { border-top: 1px dotted #000; }
      #${id} .more { font-size: 14px; }
      #${id} .sneak { padding: 10px 20px; border-top: 2px solid #000; background: #000; color: #fff; }
      #${id} .sneak-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 6px; }
      #${id} .sneak-words { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px 14px; }
      #${id} .sneak-item { }
      #${id} .sneak-cat { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #fff; }
      #${id} .sneak-word { font-size: 15px; font-weight: 700; color: #fff; }
      #${id} .sneak-def { font-size: 11px; font-weight: 700; color: #fff; }
      #${id} .scripture { background: #fff; color: #000; padding: 12px 20px; border-top: 2px solid #000; }
      #${id} .scripture-ref { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 3px; }
      #${id} .scripture-body { font-size: 14px; line-height: 1.4; white-space: normal; }
    </style>
  `;
}

function getFallbackScripture(): DailyScripture {
  return {
    label: "SCRIPTURE",
    reference: "Mosiah 2:17",
    text: "When ye are in the service of your fellow beings ye are only in the service of your God.",
    compactText:
      "When ye are in the service of your fellow beings ye are only in the service of your God.",
    index: 0,
    total: 1,
    dateKey: "fallback",
  };
}

function renderScriptureBlock(
  footer: DailyScripture | null | undefined,
  layout: ScriptureLayout,
): string {
  const active = footer ?? getFallbackScripture();

  return `<div class="scripture scripture--${layout}">
    <div class="scripture-ref">${escapeHtml(active.reference)}</div>
    <div class="scripture-body">${escapeHtml(active.text)}</div>
  </div>`;
}

export function renderMarkup(
  schedule: DaySchedule,
  date: DateTime,
  instanceUuid: string,
  dailyScripture?: DailyScripture | null,
): MarkupResult {
  const dateStr = formatDate(date);
  const fullId = buildMarkupRootId(instanceUuid, "full");
  const halfHorizontalId = buildMarkupRootId(instanceUuid, "half-horizontal");
  const halfVerticalId = buildMarkupRootId(instanceUuid, "half-vertical");
  const quadrantId = buildMarkupRootId(instanceUuid, "quadrant");

  // Helper to render a kid section
  const renderKid = (kid: KidChores, maxChores: number) => {
    const chores = kid.chores.length > 0 ? kid.chores : ["No chores today!"];
    const display = chores.slice(0, maxChores);
    const hasMore = chores.length > display.length;
    const choreHtml = display
      .map((c) => `<div class="chore">${escapeHtml(c)}</div>`)
      .join("");
    const moreHtml = hasMore
      ? `<div class="chore more">+${chores.length - display.length} more</div>`
      : "";
    return `<div class="kid"><div class="kid-name">${escapeHtml(kid.name)}</div>${choreHtml}${moreHtml}</div>`;
  };

  const fullFooterHtml = renderScriptureBlock(dailyScripture, "full");
  const halfHorizontalFooterHtml = renderScriptureBlock(
    dailyScripture,
    "half-horizontal",
  );
  const halfVerticalFooterHtml = renderScriptureBlock(
    dailyScripture,
    "half-vertical",
  );

  const sneakWords = getDailyWords(date);
  const sneakHtml = `<div class="sneak"><div class="sneak-label">Word Sneak</div><div class="sneak-words">${sneakWords.map((w) => `<div class="sneak-item"><div class="sneak-cat">${escapeHtml(w.cat)}</div><div class="sneak-word">${escapeHtml(w.word)}</div><div class="sneak-def">${escapeHtml(w.def)}</div></div>`).join("")}</div></div>`;

  // Full screen (800x480)
  const fullMarkup = `
    <div id="${fullId}">
      ${getBaseStyles(fullId)}
      <div class="date-bar">${dateStr}</div>
      <div class="content">
        <div class="grid">${schedule.kids.map((k) => renderKid(k, 5)).join("")}</div>
        ${sneakHtml}
      </div>
      ${fullFooterHtml}
    </div>
  `;

  // Half horizontal (800x240)
  const halfHorizontalMarkup = `
    <div id="${halfHorizontalId}">
      ${getBaseStyles(halfHorizontalId)}
      <style>
        #${halfHorizontalId} .date-bar { padding: 5px 14px; font-size: 12px; }
        #${halfHorizontalId} .grid { grid-template-columns: repeat(4, 1fr); }
        #${halfHorizontalId} .kid { padding: 6px 10px; }
        #${halfHorizontalId} .kid-name { font-size: 18px; padding: 4px 6px; margin: -6px -10px 5px -10px; }
        #${halfHorizontalId} .chore { font-size: 13px; padding: 2px 0; }
        #${halfHorizontalId} .scripture { padding: 6px 14px; background: #000; color: #fff; border-top: none; }
        #${halfHorizontalId} .scripture-ref { font-size: 10px; margin-bottom: 2px; }
        #${halfHorizontalId} .scripture-body { font-size: 12px; line-height: 1.3; font-weight: 700; }
      </style>
      <div class="date-bar">${dateStr}</div>
      <div class="content">
        <div class="grid">${schedule.kids.map((k) => renderKid(k, 3)).join("")}</div>
      </div>
      ${halfHorizontalFooterHtml}
    </div>
  `;

  // Half vertical (400x480)
  const halfVerticalMarkup = `
    <div id="${halfVerticalId}">
      ${getBaseStyles(halfVerticalId)}
      <style>
        #${halfVerticalId} .date-bar { padding: 6px 12px; font-size: 12px; }
        #${halfVerticalId} .grid { grid-template-columns: 1fr 1fr; }
        #${halfVerticalId} .kid { padding: 10px 12px; border-right: 1px solid #000; border-bottom: 1px solid #000; }
        #${halfVerticalId} .kid:nth-child(2n) { border-right: none; }
        #${halfVerticalId} .kid-name { font-size: 18px; padding: 4px 6px; margin: -10px -12px 6px -12px; }
        #${halfVerticalId} .chore { font-size: 13px; padding: 3px 0; }
        #${halfVerticalId} .scripture { padding: 10px 12px; background: #000; color: #fff; border-top: none; }
        #${halfVerticalId} .scripture-ref { font-size: 10px; margin-bottom: 2px; }
        #${halfVerticalId} .scripture-body { font-size: 12px; line-height: 1.35; font-weight: 700; }
      </style>
      <div class="date-bar">${dateStr}</div>
      <div class="content">
        <div class="grid">${schedule.kids.map((k) => renderKid(k, 3)).join("")}</div>
      </div>
      ${halfVerticalFooterHtml}
    </div>
  `;

  // Quadrant (400x240)
  const quadrantMarkup = `
    <div id="${quadrantId}">
      ${getBaseStyles(quadrantId)}
      <style>
        #${quadrantId} .date-bar { padding: 4px 10px; font-size: 11px; }
        #${quadrantId} .grid { grid-template-columns: 1fr 1fr; }
        #${quadrantId} .kid { padding: 6px 8px; border-right: 1px solid #000; border-bottom: 1px solid #000; }
        #${quadrantId} .kid:nth-child(2n) { border-right: none; }
        #${quadrantId} .kid-name { font-size: 14px; padding: 3px 5px; margin: -6px -8px 4px -8px; }
        #${quadrantId} .chore { font-size: 12px; padding: 2px 0; }
        #${quadrantId} .scripture { display: none; }
      </style>
      <div class="date-bar">${date.toFormat("ccc, LLL d")}</div>
      <div class="content">
        <div class="grid">${schedule.kids.map((k) => renderKid(k, 2)).join("")}</div>
      </div>
    </div>
  `;

  return {
    markup: fullMarkup,
    markup_half_horizontal: halfHorizontalMarkup,
    markup_half_vertical: halfVerticalMarkup,
    markup_quadrant: quadrantMarkup,
  };
}
