import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { RoomDto } from './../dto/room';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnChanges {
  @Input() room!: RoomDto;
  @Output() roomSelectedEvent = new EventEmitter<RoomDto>();

  ngOnChanges(): void {
    console.log('room', this.room);

  }

  roomSelected(): void {
    this.roomSelectedEvent.emit(this.room);
  }
}
