import { DateTime } from "luxon";

export interface KidChores {
  name: string;
  chores: string[];
}

export interface DaySchedule {
  kids: KidChores[];
}

export interface ParsedSchedule {
  kidNames: string[];
  weeklySchedule: Map<string, Map<string, string[]>>; // day -> kid -> chores
  dateOverrides: Map<string, Map<string, string[]>>; // YYYY-MM-DD -> kid -> chores
  globalChores: Map<string, string[]>; // day or date -> global chores (*)
}

const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export function parseScheduleText(text: string): ParsedSchedule {
  const lines = text.split("\n");
  const result: ParsedSchedule = {
    kidNames: [],
    weeklySchedule: new Map(),
    dateOverrides: new Map(),
    globalChores: new Map(),
  };

  let currentSection: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    // Parse @kids directive
    if (trimmed.toLowerCase().startsWith("@kids")) {
      const kidsStr = trimmed.slice(5).trim();
      result.kidNames = kidsStr.split(",").map((k) => k.trim()).filter(Boolean);
      continue;
    }

    // Parse section headers (@mon, @tue, @2026-01-10, etc.)
    if (trimmed.startsWith("@")) {
      const sectionName = trimmed.slice(1).toLowerCase();
      currentSection = sectionName;

      // Initialize the section
      if (WEEKDAYS.includes(sectionName)) {
        if (!result.weeklySchedule.has(sectionName)) {
          result.weeklySchedule.set(sectionName, new Map());
        }
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(sectionName)) {
        if (!result.dateOverrides.has(sectionName)) {
          result.dateOverrides.set(sectionName, new Map());
        }
      }
      continue;
    }

    // Parse chore assignments (Kid Name: chore 1; chore 2)
    if (currentSection && trimmed.includes(":")) {
      const colonIndex = trimmed.indexOf(":");
      const kidName = trimmed.slice(0, colonIndex).trim();
      const choresStr = trimmed.slice(colonIndex + 1).trim();
      const chores = choresStr
        .split(";")
        .map((c) => c.trim())
        .filter(Boolean);

      if (chores.length === 0) continue;

      // Handle global chores (*:)
      if (kidName === "*") {
        const key = currentSection;
        const existing = result.globalChores.get(key) || [];
        result.globalChores.set(key, [...existing, ...chores]);
        continue;
      }

      // Add to appropriate schedule
      if (WEEKDAYS.includes(currentSection)) {
        const daySchedule = result.weeklySchedule.get(currentSection);
        if (daySchedule) {
          const existing = daySchedule.get(kidName) || [];
          daySchedule.set(kidName, [...existing, ...chores]);
        }
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(currentSection)) {
        const dateSchedule = result.dateOverrides.get(currentSection);
        if (dateSchedule) {
          const existing = dateSchedule.get(kidName) || [];
          dateSchedule.set(kidName, [...existing, ...chores]);
        }
      }
    }
  }

  return result;
}

export function getChoresForDate(
  schedule: ParsedSchedule,
  date: DateTime
): DaySchedule {
  const dateStr = date.toFormat("yyyy-MM-dd").toLowerCase();
  const weekday = date.weekdayLong?.toLowerCase().slice(0, 3) || "mon";

  // Check for date override first
  let kidChoresMap: Map<string, string[]> | undefined;
  let sectionKey: string;

  if (schedule.dateOverrides.has(dateStr)) {
    kidChoresMap = schedule.dateOverrides.get(dateStr);
    sectionKey = dateStr;
  } else {
    kidChoresMap = schedule.weeklySchedule.get(weekday);
    sectionKey = weekday;
  }

  // Get global chores for this section
  const globalChores = schedule.globalChores.get(sectionKey) || [];

  // Build the result
  const kids: KidChores[] = [];

  for (const kidName of schedule.kidNames) {
    const specificChores = kidChoresMap?.get(kidName) || [];
    const allChores = [...specificChores, ...globalChores];

    kids.push({
      name: kidName,
      chores: allChores,
    });
  }

  return { kids };
}

export function getTodayChores(
  scheduleText: string,
  timezone: string
): DaySchedule {
  const schedule = parseScheduleText(scheduleText);
  const today = DateTime.now().setZone(timezone);
  return getChoresForDate(schedule, today);
}

export function getWeekPreview(
  scheduleText: string,
  timezone: string,
  days = 7
): Array<{ date: DateTime; schedule: DaySchedule }> {
  const schedule = parseScheduleText(scheduleText);
  const result: Array<{ date: DateTime; schedule: DaySchedule }> = [];

  for (let i = 0; i < days; i++) {
    const date = DateTime.now().setZone(timezone).plus({ days: i });
    result.push({
      date,
      schedule: getChoresForDate(schedule, date),
    });
  }

  return result;
}
