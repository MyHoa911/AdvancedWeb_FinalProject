export interface Room {
  id: string;
  name: string;
  building: 'A' | 'B1';
  floor: number;
  capacity: number;
  equipment: string[];
  status: 'AVAILABLE' | 'BOOKED';
  image: string;
}

export interface RoomFilters {
  building?: string;
  floor?: number;
  capacityMin?: number;
  search?: string;
  date?: string;        // 'YYYY-MM-DD'
  startTime?: string;  // 'HH:MM'
  endTime?: string;    // 'HH:MM'
}

export interface BookingRequest {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
}
