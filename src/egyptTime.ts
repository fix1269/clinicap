import { clinicConfig } from "./firebase-config";

function nowInEgypt(): Date {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + 2 * 3600000);
}

export function todayEgyptId(): string {
  const egypt = nowInEgypt();
  const idx = egypt.getUTCDay();
  const map = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  return map[idx];
}

export function todayEgyptLabel(): string {
  const id = todayEgyptId();
  const found = clinicConfig.days.find((d) => d.id === id);
  return found ? found.label : "";
}

export function nowEgyptTimeStr(): string {
  const egypt = nowInEgypt();
  const h = String(egypt.getUTCHours()).padStart(2, "0");
  const m = String(egypt.getUTCMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function timeToMinutes(t: string): number {
  if (!t || !t.includes(":")) return -1;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function isTimeInRange(from: string, to: string, now: string): boolean {
  const f = timeToMinutes(from);
  const t = timeToMinutes(to);
  const n = timeToMinutes(now);
  if (f < 0 || t < 0 || n < 0) return false;
  return n >= f && n <= t;
}

export function formatDateAr(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return dateStr;
  }
}
