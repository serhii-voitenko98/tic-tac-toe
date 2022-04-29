import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from '../app.service';
import { AuthService } from '../auth/auth.service';
import { RoomDto } from '../dto/room';

@Injectable({
  providedIn: 'root'
})
export class RoomGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private appService: AppService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.appService.getRooms().pipe(
      map((rooms: RoomDto[]) => {
        const room = rooms.find((room: RoomDto) => room.id === route.paramMap.get('id'));
        if ((room?.count || 0) < 2) {
          return true;
        }

        this.router.navigate(['/']);
        return false;
      })
    );
  }
}
