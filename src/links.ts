import type { Shift } from "./types";

export function buildWhatsAppLink(shift: Shift, dayLabel: string): string {
  const phone = (shift.phone || "").replace(/[^0-9]/g, "");
  const msg = encodeURIComponent(
    `السلام عليكم،\nأرغب في حجز موعد مع د. مينا موريس\nاليوم: ${dayLabel}\nالعيادة: ${shift.clinicName}\nالموعد المتاح: ${shift.fromTime} - ${shift.toTime}\nشكراً.`
  );
  return `https://wa.me/${phone}?text=${msg}`;
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

export function mapsSearchUrl(query: string, lat?: number, lng?: number): string {
  if (lat !== undefined && lng !== undefined) {
    return `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${lat},${lng},15z`;
  }
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
}
