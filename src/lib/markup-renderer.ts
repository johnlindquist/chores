import type { DaySchedule, KidChores } from "./schedule-parser";
import { DateTime } from "luxon";

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

function renderKidSection(kid: KidChores, maxChores = 5): string {
  const chores = kid.chores.length > 0 ? kid.chores : ["No chores today!"];
  const displayChores = chores.slice(0, maxChores);
  const hasMore = chores.length > displayChores.length;

  const choresList = displayChores
    .map((c) => `<li>${escapeHtml(c)}</li>`)
    .join("");
  const moreText = hasMore
    ? `<li class="more">+${chores.length - displayChores.length} more</li>`
    : "";

  return `
    <div class="kid-section">
      <div class="kid-name">${escapeHtml(kid.name)}</div>
      <ul class="chores-list">
        ${choresList}
        ${moreText}
      </ul>
    </div>
  `;
}

function renderCompactKid(kid: KidChores): string {
  const count = kid.chores.length;
  if (count === 0) {
    return `<div class="kid-row"><span class="kid-name">${escapeHtml(kid.name)}</span><span class="chore-summary no-chores">Day off!</span></div>`;
  }
  const firstChore = kid.chores[0];
  const moreCount = count > 1 ? ` +${count - 1}` : "";
  return `<div class="kid-row"><span class="kid-name">${escapeHtml(kid.name)}</span><span class="chore-summary">${escapeHtml(firstChore)}${moreCount}</span></div>`;
}

export function renderMarkup(
  schedule: DaySchedule,
  date: DateTime,
  instanceUuid: string,
  benQuote?: string | null
): MarkupResult {
  const dateStr = formatDate(date);
  const containerId = `chores-${instanceUuid.slice(0, 8)}`;

  // Base styles optimized for e-ink (high contrast, no grays)
  const baseStyles = `
    <style>
      #${containerId} {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        padding: 20px;
        height: 100%;
        box-sizing: border-box;
        background: #fff;
        color: #000;
      }
      #${containerId} .header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        border-bottom: 3px solid #000;
        padding-bottom: 12px;
        margin-bottom: 16px;
      }
      #${containerId} .title {
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }
      #${containerId} .date {
        font-size: 18px;
        font-weight: 500;
      }
      #${containerId} .kids-grid {
        display: grid;
        gap: 16px;
      }
      #${containerId} .kids-grid.two-col {
        grid-template-columns: 1fr 1fr;
      }
      #${containerId} .kid-section {
        border: 2px solid #000;
        padding: 12px;
      }
      #${containerId} .kid-name {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      #${containerId} .chores-list {
        margin: 0;
        padding: 0;
        list-style: none;
        font-size: 16px;
        line-height: 1.4;
      }
      #${containerId} .chores-list li {
        padding: 4px 0;
        border-bottom: 1px solid #000;
      }
      #${containerId} .chores-list li:last-child {
        border-bottom: none;
      }
      #${containerId} .chores-list li::before {
        content: "• ";
        font-weight: bold;
      }
      #${containerId} .chores-list .more {
        font-style: italic;
      }
      #${containerId} .chores-list .more::before {
        content: "";
      }
      #${containerId} .kid-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #000;
        font-size: 16px;
      }
      #${containerId} .kid-row:last-child {
        border-bottom: none;
      }
      #${containerId} .kid-row .kid-name {
        font-weight: 700;
        font-size: 16px;
        margin-bottom: 0;
      }
      #${containerId} .chore-summary {
        text-align: right;
        max-width: 60%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      #${containerId} .no-chores {
        font-style: italic;
      }
      #${containerId} .compact-header {
        font-size: 20px;
        font-weight: 700;
        border-bottom: 2px solid #000;
        padding-bottom: 8px;
        margin-bottom: 12px;
      }
      #${containerId} .ben-quote {
        margin-top: 16px;
        padding: 12px;
        border: 2px solid #000;
        background: #f0f0f0;
      }
      #${containerId} .ben-quote-label {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 4px;
      }
      #${containerId} .ben-quote-text {
        font-size: 16px;
        font-style: italic;
      }
    </style>
  `;

  // Ben quote section (only if quote exists)
  const benQuoteHtml = benQuote
    ? `<div class="ben-quote">
        <div class="ben-quote-label">Ben says:</div>
        <div class="ben-quote-text">"${escapeHtml(benQuote)}"</div>
      </div>`
    : "";

  // Full screen layout (800x480)
  const fullMarkup = `
    <div id="${containerId}" class="view view--full">
      ${baseStyles}
      <div class="header">
        <span class="title">Chores</span>
        <span class="date">${dateStr}</span>
      </div>
      <div class="kids-grid two-col">
        ${schedule.kids.map((kid) => renderKidSection(kid, 5)).join("")}
      </div>
      ${benQuoteHtml}
    </div>
  `;

  // Half horizontal (wide but short ~800x240)
  const halfHorizontalMarkup = `
    <div id="${containerId}" class="view view--half-horizontal">
      ${baseStyles}
      <style>
        #${containerId}.view--half-horizontal { padding: 12px; }
        #${containerId}.view--half-horizontal .header { margin-bottom: 10px; padding-bottom: 8px; }
        #${containerId}.view--half-horizontal .title { font-size: 22px; }
        #${containerId}.view--half-horizontal .date { font-size: 14px; }
        #${containerId}.view--half-horizontal .kid-section { padding: 8px; }
        #${containerId}.view--half-horizontal .kid-name { font-size: 16px; margin-bottom: 4px; }
        #${containerId}.view--half-horizontal .chores-list { font-size: 13px; }
        #${containerId}.view--half-horizontal .chores-list li { padding: 2px 0; }
      </style>
      <div class="header">
        <span class="title">Chores</span>
        <span class="date">${dateStr}</span>
      </div>
      <div class="kids-grid two-col">
        ${schedule.kids.map((kid) => renderKidSection(kid, 3)).join("")}
      </div>
    </div>
  `;

  // Half vertical (tall but narrow ~400x480)
  const halfVerticalMarkup = `
    <div id="${containerId}" class="view view--half-vertical">
      ${baseStyles}
      <style>
        #${containerId}.view--half-vertical { padding: 14px; }
        #${containerId}.view--half-vertical .header { margin-bottom: 12px; }
        #${containerId}.view--half-vertical .title { font-size: 22px; }
        #${containerId}.view--half-vertical .date { font-size: 14px; }
        #${containerId}.view--half-vertical .kid-section { padding: 10px; }
        #${containerId}.view--half-vertical .kid-name { font-size: 16px; }
        #${containerId}.view--half-vertical .chores-list { font-size: 14px; }
      </style>
      <div class="header">
        <span class="title">Chores</span>
        <span class="date">${dateStr}</span>
      </div>
      <div class="kids-grid">
        ${schedule.kids.map((kid) => renderKidSection(kid, 3)).join("")}
      </div>
    </div>
  `;

  // Quadrant (smallest ~400x240)
  const quadrantMarkup = `
    <div id="${containerId}" class="view view--quadrant">
      ${baseStyles}
      <style>
        #${containerId}.view--quadrant { padding: 10px; }
        #${containerId}.view--quadrant .compact-header { font-size: 16px; margin-bottom: 8px; padding-bottom: 6px; }
        #${containerId}.view--quadrant .kid-row { font-size: 14px; padding: 5px 0; }
      </style>
      <div class="compact-header">Chores - ${date.toFormat("ccc d")}</div>
      ${schedule.kids.map((kid) => renderCompactKid(kid)).join("")}
    </div>
  `;

  return {
    markup: fullMarkup,
    markup_half_horizontal: halfHorizontalMarkup,
    markup_half_vertical: halfVerticalMarkup,
    markup_quadrant: quadrantMarkup,
  };
}
