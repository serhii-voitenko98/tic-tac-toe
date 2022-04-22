import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn() {
    const rawData = sessionStorage.getItem('user');
    const userData = rawData?.trim() ? JSON.parse(rawData) : null;
    return Boolean(userData);
  }

  getUser() {
    return JSON.parse(sessionStorage.getItem('user') || '');
  }

  login(payload: any) {
    sessionStorage.setItem('user', JSON.stringify(payload));
  }
}
