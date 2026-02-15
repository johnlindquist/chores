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

interface MarkupResult {
  markup: string;
  markup_half_horizontal: string;
  markup_half_vertical: string;
  markup_quadrant: string;
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

export function renderMarkup(
  schedule: DaySchedule,
  date: DateTime,
  instanceUuid: string,
  benQuote?: string | null,
): MarkupResult {
  const dateStr = formatDate(date);
  const id = `c-${instanceUuid.slice(0, 8)}`;

  // Brutalist styles - large readable fonts for e-ink
  const baseStyles = `
    <style>
      #${id} { font-family: Arial, Helvetica, sans-serif; background: #fff; padding: 0; height: 100%; box-sizing: border-box; position: relative; }
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
      #${id} .quote { position: absolute; bottom: 0; left: 0; right: 0; background: #000; color: #fff; padding: 12px 24px; font-size: 16px; display: flex; gap: 10px; }
      #${id} .quote-label { font-weight: 700; }
    </style>
  `;

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

  const displayQuote = benQuote || "Don't quote me on this";
  const quoteHtml = `<div class="quote"><span class="quote-label">BEN:</span><span>"${escapeHtml(displayQuote)}"</span></div>`;

  const sneakWords = getDailyWords(date);
  const sneakHtml = `<div class="sneak"><div class="sneak-label">Word Sneak - Sneak these into conversation!</div><div class="sneak-words">${sneakWords.map((w) => `<div class="sneak-item"><div class="sneak-cat">${escapeHtml(w.cat)}</div><div class="sneak-word">${escapeHtml(w.word)}</div><div class="sneak-def">${escapeHtml(w.def)}</div></div>`).join("")}</div></div>`;

  // Full screen (800x480)
  const fullMarkup = `
    <div id="${id}">
      ${baseStyles}
      <div class="header">
        <span class="title">Chores</span>
        <span class="date">${dateStr}</span>
      </div>
      <div class="grid">${schedule.kids.map((k) => renderKid(k, 5)).join("")}</div>
      ${sneakHtml}
      ${quoteHtml}
    </div>
  `;

  // Half horizontal (800x240) - 2 rows of 2
  const halfHorizontalMarkup = `
    <div id="${id}">
      ${baseStyles}
      <style>
        #${id} .header { padding: 10px 16px; }
        #${id} .title { font-size: 24px; letter-spacing: 3px; }
        #${id} .date { font-size: 14px; padding: 4px 8px; }
        #${id} .grid { grid-template-columns: repeat(4, 1fr); }
        #${id} .kid { padding: 10px; }
        #${id} .kid-name { font-size: 18px; padding-bottom: 4px; margin-bottom: 6px; }
        #${id} .chore { font-size: 14px; padding: 3px 0; }
        #${id} .quote { padding: 8px 16px; font-size: 14px; }
      </style>
      <div class="header">
        <span class="title">Chores</span>
        <span class="date">${dateStr}</span>
      </div>
      <div class="grid">${schedule.kids.map((k) => renderKid(k, 3)).join("")}</div>
      ${quoteHtml}
    </div>
  `;

  // Half vertical (400x480) - single column
  const halfVerticalMarkup = `
    <div id="${id}">
      ${baseStyles}
      <style>
        #${id} .header { padding: 12px 16px; }
        #${id} .title { font-size: 22px; letter-spacing: 2px; }
        #${id} .date { font-size: 14px; padding: 4px 8px; }
        #${id} .grid { grid-template-columns: 1fr 1fr; }
        #${id} .kid { padding: 12px; border-right: 3px solid #000; border-bottom: 3px solid #000; }
        #${id} .kid:nth-child(2n) { border-right: none; }
        #${id} .kid-name { font-size: 18px; padding-bottom: 6px; margin-bottom: 8px; border-bottom: 2px solid #000; }
        #${id} .chore { font-size: 14px; padding: 4px 0; }
        #${id} .quote { padding: 8px 16px; font-size: 14px; }
      </style>
      <div class="header">
        <span class="title">Chores</span>
        <span class="date">${dateStr}</span>
      </div>
      <div class="grid">${schedule.kids.map((k) => renderKid(k, 3)).join("")}</div>
      ${quoteHtml}
    </div>
  `;

  // Quadrant (400x240) - compact list
  const quadrantMarkup = `
    <div id="${id}">
      ${baseStyles}
      <style>
        #${id} .header { padding: 8px 12px; }
        #${id} .title { font-size: 18px; letter-spacing: 2px; }
        #${id} .date { font-size: 12px; padding: 3px 6px; border-width: 2px; }
        #${id} .grid { grid-template-columns: 1fr 1fr; }
        #${id} .kid { padding: 8px 10px; border-width: 2px; }
        #${id} .kid:nth-child(2n) { border-right: none; }
        #${id} .kid-name { font-size: 14px; padding-bottom: 4px; margin-bottom: 6px; border-bottom: 2px solid #000; }
        #${id} .chore { font-size: 12px; padding: 3px 0; }
        #${id} .quote { display: none; }
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
