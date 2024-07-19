import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConstService {
  constructor(private http: HttpClient) {}
  public static serverHost(): string {
    return isDevMode() ? 'http://localhost:8081' : '';

  }

  public static readonly FREQUENCY = {};
  public static Authention = 'auth';
  public static GetUsername = 'auth/users';


}
