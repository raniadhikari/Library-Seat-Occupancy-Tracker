export type SeatStatus = 'AVAILABLE' | 'OCCUPIED';

export type SectionType = 'SECTION_A' | 'SECTION_B' | 'SECTION_C';

export interface Seat {
  id: string;
  code: string; // e.g. "A-1", "A-2"
  sectionId: string;
  sectionName: string;
  status: SeatStatus;
  rollNo?: string;
  studentName?: string;
  course?: string; // e.g. "BCA 4th Sem"
  checkInTime?: string; // ISO string or formatted time
}

export interface Section {
  id: string;
  name: string;
  code: string;
  description: string;
  capacity: number;
  color: string;
  accentColor: string;
}

export interface OccupancyStats {
  totalSeats: number;
  occupied: number;
  available: number;
  occupancyRate: number; // percentage 0 - 100
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  seatCode: string;
  sectionName: string;
  action: 'ALLOCATE' | 'VACATE';
  studentDetails: string;
  details: string;
}

export interface JavaCodeFile {
  name: string;
  category: 'Core Java Class' | 'Menu Driven Main' | 'Swing GUI' | 'Viva & Documentation' | 'Windows Batch Script' | 'Linux / macOS Script' | 'Execution Script';
  description: string;
  code: string;
}

