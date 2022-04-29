import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient) {}

  getRooms() {
    return this.http.get(`${environment.BACKEND_URL}/game/room`)
      .pipe(
        map((rooms: any) => {
          return rooms.map(([id, data]: [string, any]) => ({ id, ...data }))
        })
      );
  }
}
