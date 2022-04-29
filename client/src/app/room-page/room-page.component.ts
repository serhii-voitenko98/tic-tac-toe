import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SocketService } from './../socket/socket.service';

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss']
})
export class RoomPageComponent implements OnInit, OnDestroy {
  roomId!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private socketService: SocketService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(v => this.joinRoom(this.roomId = v.id));
    this.socketService.onNewMessage('joinRoom').subscribe((data: any) => this.snackBar.open(`${data.name} joined room!`, 'Close'));
    this.socketService.onNewMessage('leaveRoom').subscribe((data: any) => this.snackBar.open(`${data.name} leaved room!`, 'Close'));
    this.socketService.onNewMessage('error').subscribe(console.error);
  }

  ngOnDestroy(): void {
    this.socketService.emitEvent('leaveRoom', { id: this.roomId, data: { username: this.authService.getUser().username } });
  }

  private joinRoom(id: string): void {
    this.socketService.socket.emit('joinRoom', { id, data: { username: this.authService.getUser().username } });
  }
}
