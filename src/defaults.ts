import type { DaySchedule, Shift } from "./types";
import { clinicConfig } from "./firebase-config";

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function defaultShifts(dayIndex: number): Shift[] {
  if (dayIndex === 5 || dayIndex === 6) {
    return [{
      id: uid(), clinicName: "إجازة أسبوعية", address: "", fromTime: "", toTime: "",
      status: "إجازة", alertMessage: "", phone: "",
    }];
  }
  return [
    { id: uid(), clinicName: "عيادة المعادي", address: "شارع 9، المعادي، القاهرة", fromTime: "06:00", toTime: "10:00", status: "غير متواجد", alertMessage: "", phone: "+201001234567" },
    { id: uid(), clinicName: "عيادة مدينة نصر", address: "شارع عباس العقاد، مدينة نصر", fromTime: "18:00", toTime: "22:00", status: "غير متواجد", alertMessage: "", phone: "+201009876543" },
  ];
}

export function defaultSchedule(): DaySchedule[] {
  return clinicConfig.days.map((d, i) => ({ id: d.id, day: d.label, shifts: defaultShifts(i) }));
}

export function emptyShift(): Shift {
  return { id: uid(), clinicName: "", address: "", fromTime: "09:00", toTime: "13:00", status: "غير متواجد", alertMessage: "", phone: "+201000000000" };
}

export function defaultForId(id: string): DaySchedule {
  const d = clinicConfig.days.find((x) => x.id === id) ?? clinicConfig.days[0];
  const idx = clinicConfig.days.findIndex((x) => x.id === id);
  return { id: d.id, day: d.label, shifts: defaultShifts(idx < 0 ? 0 : idx) };
}

export function newUid(): string {
  return uid();
}
