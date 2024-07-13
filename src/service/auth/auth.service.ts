import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConstService } from '../const.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //endpoint: string = 'http://192.168.24.32:8080';
  endpoint: string = ConstService.serverHost();
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  token = '';
  lang: any = '';
  currentUser: any = {};
  data: any[] = [];

  constructor(
    private http: HttpClient, 
    public router: Router, 

  ) {}
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }
  setLang(lang: string) {
    this.lang = lang;
    localStorage.setItem('lang', lang);
  }
  
  getLang(): string {
    return this.lang;
  }

  getRoles(): string[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  setRoles(roles: string[]): void {
    localStorage.setItem('roles', JSON.stringify(roles));
  }
  isAdmin(): boolean {
    const roles = this.getRoles();
    return roles.includes('ROLE_ADMIN');
  }

}