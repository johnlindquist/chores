import type { ReactNode, CSSProperties } from "react";

export interface KidChores {
  name: string;
  chores: string[];
}

export interface ChoreDisplayProps {
  date: string;
  kids: KidChores[];
  benQuote?: string | null;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

// Base wrapper for 800x480 e-ink display
export function ChoreDisplay({
  date,
  kids,
  benQuote,
  className = "",
  style,
  children,
}: ChoreDisplayProps) {
  return (
    <div
      className={`chore-display ${className}`}
      style={{
        width: 800,
        height: 480,
        overflow: "hidden",
        position: "relative",
        background: "#fff",
        color: "#000",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Sample data for stories
export const sampleKids: KidChores[] = [
  { name: "Scooter", chores: ["Make bed", "Feed dog", "Take out recycling"] },
  { name: "Jordan", chores: ["Empty dishwasher", "Wipe counters"] },
  { name: "Rich", chores: ["Vacuum living room", "Fold laundry", "Set table"] },
  { name: "Joy", chores: ["Water plants", "Sweep porch"] },
];

export const sampleDate = "Tuesday, Jan 7";
export const sampleQuote = "It's just a flesh wound!";
