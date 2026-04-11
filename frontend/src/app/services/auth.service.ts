import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  //private apiUrl = 'http://localhost:5184/api/users';
  private apiUrl = 'http://localhost:5184/api/Auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, {
      Username: username,
      Password: password
    });
  }

  register(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, {
      Username: username,
      Password: password
    });
  }

}
