import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { RoomDto } from '../dto/room';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  rooms: RoomDto[] = [];

  constructor(
    private appService: AppService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.appService.getRooms().subscribe(rooms => this.rooms = rooms);
  }

  joinRoom(room: RoomDto): void {
    this.router.navigate(['room', room.id]);
  }
}
