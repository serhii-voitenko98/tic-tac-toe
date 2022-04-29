import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { RoomDto } from '../dto/room';
import { SocketService } from '../socket/socket.service';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  rooms: RoomDto[] = [];

  constructor(
    private appService: AppService,
    private router: Router,
    private socketService: SocketService,
  ) {}

  ngOnInit(): void {
    this.appService.getRooms().subscribe(rooms => this.rooms = rooms);
    this.socketService.onNewMessage('joinRoom').subscribe((data: any) => {
      this.updateCount(data.room, data.count);

      console.log('this.rooms', this.rooms);
    });
    this.socketService.onNewMessage('leaveRoom').subscribe((data: any) => {
      this.updateCount(data.room, data.count);

      console.log('this.rooms', this.rooms);
    });
  }

  joinRoom(room: RoomDto): void {
    this.router.navigate(['room', room.id]);
  }

  private updateCount(roomId: string, count: number) {
    this.rooms = this.rooms.map(room => {
      if (room.id === roomId) {
        room.count = count;
      }

      return room;
    });
  }
}
