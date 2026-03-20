import { subDays, subHours } from "date-fns";

export type Preset = "1h" | "6h" | "24h" | "7d" | "30d";

export const PRESETS: { value: Preset; label: string }[] = [
  { value: "1h", label: "1h" },
  { value: "6h", label: "6h" },
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
];

export function getPresetRange(preset: Preset): [Date, Date] {
  const now = new Date();

  if (preset === "1h") return [subHours(now, 1), now];
  if (preset === "6h") return [subHours(now, 6), now];
  if (preset === "24h") return [subHours(now, 24), now];

  return [subDays(now, 7), now];
}
