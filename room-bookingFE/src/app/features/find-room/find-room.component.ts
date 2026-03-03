import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Room, RoomFilters } from '../../core/models/room.model';
import { RoomService } from '../../core/services/room.service';

@Component({
  selector: 'app-find-room',
  standalone: false,
  templateUrl: './find-room.component.html',
  styleUrls: ['./find-room.component.css'],
})
export class FindRoomComponent implements OnInit, OnDestroy {
  filterForm!: FormGroup;
  rooms: Room[] = [];
  isLoading = false;
  bookingMessage: { text: string; type: 'success' | 'error' } | null = null;
  private destroy$ = new Subject<void>();

  readonly todayIso = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

  readonly buildings = ['A', 'B1'];

  readonly capacityOptions = [
    { label: 'Any Capacity', value: null },
    { label: '4+',  value: 4  },
    { label: '8+',  value: 8  },
    { label: '12+', value: 12 },
    { label: '20+', value: 20 },
    { label: '30+', value: 30 },
  ];

  readonly timeSlots = [
    { label: 'Any time', startTime: '', endTime: '' },
    { label: '07:00 – 09:00', startTime: '07:00', endTime: '09:00' },
    { label: '09:00 – 11:00', startTime: '09:00', endTime: '11:00' },
    { label: '11:00 – 13:00', startTime: '11:00', endTime: '13:00' },
    { label: '13:00 – 15:00', startTime: '13:00', endTime: '15:00' },
    { label: '15:00 – 17:00', startTime: '15:00', endTime: '17:00' },
    { label: '17:00 – 19:00', startTime: '17:00', endTime: '19:00' },
  ];

  get floorOptions(): number[] {
    const b = this.filterForm?.get('building')?.value;
    if (b === 'A')  return [3, 4, 5, 6, 7, 8];
    if (b === 'B1') return [1, 2, 3, 4, 5];
    return [1, 2, 3, 4, 5, 6, 7, 8];
  }

  constructor(private fb: FormBuilder, private roomService: RoomService) {
    this.filterForm = this.fb.group({
      search:      [''],
      building:    [''],
      floor:       [null],
      capacityMin: [null],
      date:        [this.todayIso],
      timeSlot:    ['Any time'],
    });
  }

  ngOnInit(): void {
    // Reset floor when building changes
    this.filterForm.get('building')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.filterForm.get('floor')!.setValue(null, { emitEvent: false }));

    // Debounce search input only
    this.filterForm.get('search')!.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.loadRooms());

    // Immediate reload for all other controls
    ['building', 'floor', 'capacityMin', 'date', 'timeSlot'].forEach((ctrl) => {
      this.filterForm.get(ctrl)!.valueChanges
        .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
        .subscribe(() => this.loadRooms());
    });

    this.loadRooms();
  }

  loadRooms(): void {
    const raw = this.filterForm.value;
    const filters: RoomFilters = {};

    if (raw.search?.trim())    filters.search      = raw.search.trim();
    if (raw.building)          filters.building    = raw.building;
    if (raw.floor != null)     filters.floor       = Number(raw.floor);
    if (raw.capacityMin != null) filters.capacityMin = Number(raw.capacityMin);
    if (raw.date)              filters.date        = raw.date;

    const slot = this.timeSlots.find((s) => s.label === raw.timeSlot);
    if (slot?.startTime) {
      filters.startTime = slot.startTime;
      filters.endTime   = slot.endTime;
    }

    this.isLoading = true;
    this.bookingMessage = null;
    this.roomService.getRooms(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => { this.rooms = data; this.isLoading = false; },
        error: ()     => { this.rooms = [];  this.isLoading = false; },
      });
  }

  book(room: Room): void {
    const raw = this.filterForm.value;
    const slot = this.timeSlots.find((s) => s.label === raw.timeSlot);

    if (!raw.date || !slot?.startTime) {
      this.bookingMessage = { text: 'Please select a date and time slot before booking.', type: 'error' };
      return;
    }

    this.roomService.bookRoom({
      roomId:    room.id,
      date:      raw.date,
      startTime: slot.startTime,
      endTime:   slot.endTime,
    }).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.bookingMessage = {
            text: `${room.name} booked for ${raw.date} ${slot.startTime}–${slot.endTime}`,
            type: 'success',
          };
          this.loadRooms(); // refresh availability
        },
        error: (err) => {
          this.bookingMessage = {
            text: err?.error?.message ?? 'Booking failed. Please try again.',
            type: 'error',
          };
        },
      });
  }

  clearFilters(): void {
    this.filterForm.reset({
      search: '', building: '', floor: null, capacityMin: null,
      date: this.todayIso, timeSlot: 'Any time',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
