import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable()
export class SocketService {
  socket!: Socket;
  socketConnected$ = new BehaviorSubject(false);

  constructor() {
    this.socket = io(environment.BACKEND_URL);
    this.socket.on('connect', () => {
      this.socketConnected$.next(true);
    });
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
