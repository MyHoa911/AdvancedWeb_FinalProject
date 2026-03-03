import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room, RoomFilters, BookingRequest } from '../models/room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly apiUrl = 'http://localhost:5000/api/rooms';

  constructor(private http: HttpClient) {}

  getRooms(filters: RoomFilters = {}): Observable<Room[]> {
    let params = new HttpParams();

    if (filters.building) params = params.set('building', filters.building);
    if (filters.floor != null) params = params.set('floor', String(filters.floor));
    if (filters.capacityMin != null) params = params.set('capacityMin', String(filters.capacityMin));
    if (filters.search) params = params.set('search', filters.search);
    if (filters.date) params = params.set('date', filters.date);
    if (filters.startTime) params = params.set('startTime', filters.startTime);
    if (filters.endTime) params = params.set('endTime', filters.endTime);

    return this.http.get<Room[]>(this.apiUrl, { params });
  }

  bookRoom(request: BookingRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/book`, request);
  }
}
