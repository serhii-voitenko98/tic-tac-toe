import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket!: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  onNewMessage(message: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(message, msg => {
        observer.next(msg);
      });
    });
  }

  emitEvent<T>(event: string, payload: T): void {
    try {
      this.socket.emit(event, payload);
    } catch(e) {
      console.error(e);
    }
  }
}
