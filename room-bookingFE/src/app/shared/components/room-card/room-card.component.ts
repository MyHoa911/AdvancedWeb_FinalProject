import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Room } from '../../../core/models/room.model';

@Component({
  selector: 'app-room-card',
  standalone: false,
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.css'],
})
export class RoomCardComponent {
  @Input() room!: Room;
  @Output() bookClicked = new EventEmitter<void>();

  readonly equipmentIcons: Record<string, string> = {
    'WiFi':         'wifi',
    'Projector':    'videocam',
    'Whiteboard':   'edit_note',
    'AC':           'ac_unit',
    'Audio System': 'speaker',
  };

  getEquipmentIcon(eq: string): string {
    return this.equipmentIcons[eq] ?? 'devices_other';
  }
}
