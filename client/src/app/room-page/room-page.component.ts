import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SocketService } from './../socket/socket.service';

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss']
})
export class RoomPageComponent implements OnInit {
  roomId!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(v => this.joinRoom(this.roomId = v.id));
    this.socketService.onNewMessage('newPlayer').subscribe((v) => console.log(`${v} joined room`));
    this.socketService.onNewMessage('error').subscribe(console.error);
  }

  private joinRoom(id: string): void {
    this.socketService.socket.emit('joinRoom', { id, data: { username: this.authService.getUser().username } });
  }
}
