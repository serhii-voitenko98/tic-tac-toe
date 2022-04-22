import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient) {}

  getRooms() {
    return this.http.get('http://localhost:3000/game/room')
      .pipe(
        map((rooms: any) => {
          return rooms.map(([id, data]: [string, any]) => ({ id, ...data }))
        })
      );
  }
}
