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
      #${id} { font-family: Arial, Helvetica, sans-serif; background: #fff; padding: 0; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; }
      #${id} .content { min-height: 0; flex: 1 1 auto; overflow: hidden; }
      #${id} .header { background: #000; color: #fff; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
      #${id} .title { font-size: 36px; font-weight: 700; text-transform: uppercase; letter-spacing: 4px; color: #fff; }
      #${id} .date { font-size: 18px; border: 3px solid #fff; padding: 6px 12px; color: #fff; }
      #${id} .grid { display: grid; grid-template-columns: repeat(4, 1fr); }
      #${id} .kid { border-right: 4px solid #000; border-bottom: 4px solid #000; padding: 16px; }
      #${id} .kid:last-child { border-right: none; }
      #${id} .kid-name { font-size: 24px; font-weight: 700; text-transform: uppercase; border-bottom: 3px solid #000; padding-bottom: 8px; margin-bottom: 12px; }
      #${id} .chore { font-size: 18px; padding: 6px 0; border-bottom: 1px solid #000; }
      #${id} .chore:last-child { border-bottom: none; }
      #${id} .more { font-style: italic; font-size: 16px; }
      #${id} .sneak { padding: 8px 16px; border-top: 4px solid #000; }
      #${id} .sneak-label { font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; }
      #${id} .sneak-words { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
      #${id} .sneak-item { }
      #${id} .sneak-cat { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #666; }
      #${id} .sneak-word { font-size: 13px; font-weight: 700; }
      #${id} .sneak-def { font-size: 9px; color: #333; }
      #${id} .scripture { background: #000; color: #fff; padding: 10px 16px; display: grid; gap: 3px; }
      #${id} .scripture-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
      #${id} .scripture-reference { font-size: 13px; font-weight: 700; }
      #${id} .scripture-body { font-size: 12px; line-height: 1.2; white-space: normal; }
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
    <div class="scripture-label">${escapeHtml(active.label)}</div>
    <div class="scripture-reference">${escapeHtml(active.reference)}</div>
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
  const sneakHtml = `<div class="sneak"><div class="sneak-label">Word Sneak - Sneak these into conversation!</div><div class="sneak-words">${sneakWords.map((w) => `<div class="sneak-item"><div class="sneak-cat">${escapeHtml(w.cat)}</div><div class="sneak-word">${escapeHtml(w.word)}</div><div class="sneak-def">${escapeHtml(w.def)}</div></div>`).join("")}</div></div>`;

  // Full screen (800x480)
  const fullMarkup = `
    <div id="${fullId}">
      ${getBaseStyles(fullId)}
      <div class="header">
        <span class="title">Chores</span>
        <span class="date">${dateStr}</span>
      </div>
      <div class="content">
        <div class="grid">${schedule.kids.map((k) => renderKid(k, 5)).join("")}</div>
        ${sneakHtml}
      </div>
      ${fullFooterHtml}
    </div>
  `;

  // Half horizontal (800x240) - 2 rows of 2
  const halfHorizontalMarkup = `
    <div id="${halfHorizontalId}">
      ${getBaseStyles(halfHorizontalId)}
      <style>
        #${halfHorizontalId} .header { padding: 10px 16px; }
        #${halfHorizontalId} .title { font-size: 24px; letter-spacing: 3px; }
        #${halfHorizontalId} .date { font-size: 14px; padding: 4px 8px; }
        #${halfHorizontalId} .grid { grid-template-columns: repeat(4, 1fr); }
        #${halfHorizontalId} .kid { padding: 10px; }
        #${halfHorizontalId} .kid-name { font-size: 18px; padding-bottom: 4px; margin-bottom: 6px; }
        #${halfHorizontalId} .chore { font-size: 14px; padding: 3px 0; }
        #${halfHorizontalId} .scripture { padding: 8px 12px; }
        #${halfHorizontalId} .scripture-reference { font-size: 11px; }
        #${halfHorizontalId} .scripture-body { font-size: 10px; line-height: 1.15; }
      </style>
      <div class="header">
        <span class="title">Chores</span>
        <span class="date">${dateStr}</span>
      </div>
      <div class="content">
        <div class="grid">${schedule.kids.map((k) => renderKid(k, 3)).join("")}</div>
      </div>
      ${halfHorizontalFooterHtml}
    </div>
  `;

  // Half vertical (400x480) - single column
  const halfVerticalMarkup = `
    <div id="${halfVerticalId}">
      ${getBaseStyles(halfVerticalId)}
      <style>
        #${halfVerticalId} .header { padding: 12px 16px; }
        #${halfVerticalId} .title { font-size: 22px; letter-spacing: 2px; }
        #${halfVerticalId} .date { font-size: 14px; padding: 4px 8px; }
        #${halfVerticalId} .grid { grid-template-columns: 1fr 1fr; }
        #${halfVerticalId} .kid { padding: 12px; border-right: 3px solid #000; border-bottom: 3px solid #000; }
        #${halfVerticalId} .kid:nth-child(2n) { border-right: none; }
        #${halfVerticalId} .kid-name { font-size: 18px; padding-bottom: 6px; margin-bottom: 8px; border-bottom: 2px solid #000; }
        #${halfVerticalId} .chore { font-size: 14px; padding: 4px 0; }
        #${halfVerticalId} .scripture { padding: 8px 12px; }
        #${halfVerticalId} .scripture-reference { font-size: 11px; }
        #${halfVerticalId} .scripture-body { font-size: 10px; line-height: 1.15; }
      </style>
      <div class="header">
        <span class="title">Chores</span>
        <span class="date">${dateStr}</span>
      </div>
      <div class="content">
        <div class="grid">${schedule.kids.map((k) => renderKid(k, 3)).join("")}</div>
      </div>
      ${halfVerticalFooterHtml}
    </div>
  `;

  // Quadrant (400x240) - compact list
  const quadrantMarkup = `
    <div id="${quadrantId}">
      ${getBaseStyles(quadrantId)}
      <style>
        #${quadrantId} .header { padding: 8px 12px; }
        #${quadrantId} .title { font-size: 18px; letter-spacing: 2px; }
        #${quadrantId} .date { font-size: 12px; padding: 3px 6px; border-width: 2px; }
        #${quadrantId} .grid { grid-template-columns: 1fr 1fr; }
        #${quadrantId} .kid { padding: 8px 10px; border-width: 2px; }
        #${quadrantId} .kid:nth-child(2n) { border-right: none; }
        #${quadrantId} .kid-name { font-size: 14px; padding-bottom: 4px; margin-bottom: 6px; border-bottom: 2px solid #000; }
        #${quadrantId} .chore { font-size: 12px; padding: 3px 0; }
        #${quadrantId} .scripture { display: none; }
      </style>
      <div class="header">
        <span class="title">Chores</span>
        <span class="date">${date.toFormat("ccc d")}</span>
      </div>
      <div class="grid">${schedule.kids.map((k) => renderKid(k, 2)).join("")}</div>
    </div>
  `;

  return {
    markup: fullMarkup,
    markup_half_horizontal: halfHorizontalMarkup,
    markup_half_vertical: halfVerticalMarkup,
    markup_quadrant: quadrantMarkup,
  };
}
