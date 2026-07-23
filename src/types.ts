export type ShiftStatus = "متواجد حالياً" | "غير متواجد" | "إجازة";

export interface Shift {
  id: string;
  clinicName: string;
  address: string;
  fromTime: string;
  toTime: string;
  status: ShiftStatus;
  alertMessage: string;
  phone: string;
}

export interface DaySchedule {
  id: string;
  day: string;
  shifts: Shift[];
}

export interface PrescriptionItem {
  id: string;
  drugName: string;
  dosage: string;
}

export interface Visit {
  id: string;
  date: string;
  diagnosis: string;
  medications: PrescriptionItem[];
  nextConsultDate: string;
  nextConsultTime: string;
  notes: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  age: string;
  height: string;
  weight: string;
  bloodType: string;
  bloodPressure: string;
  drugAllergies: string;
  chronicDiseases: string;
  profileImage: string;
  attachments: Attachment[];
  visits: Visit[];
  createdAt: string;
}

export type PatientFormData = Omit<Patient, "id" | "visits" | "createdAt">;
