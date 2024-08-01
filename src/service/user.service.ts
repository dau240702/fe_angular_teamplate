import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from './api/api.service';
import { ConstService } from './const.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: any = { name: null, userId: null, role: 'ROLE_ADMIN' };
  private userIdSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.user.userId);
  userId$: Observable<number> = this.userIdSubject.asObservable();

  private nameSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.user.name);
  name$: Observable<string> = this.nameSubject.asObservable();

  private rolenameSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.user.role);
  role$: Observable<string> = this.rolenameSubject.asObservable();

  private userInitialized: boolean = false;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private JwtModule: JwtHelperService
  ) {}

  setUserId(userId: number) {
    this.userIdSubject.next(userId);
  }

  setName(name: string) {
    this.nameSubject.next(name);
  }

  setRole(role: string) {
    this.rolenameSubject.next(role);
  }

  initializeUserFromToken() {
    if (this.userInitialized) {
      return;
    }
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.JwtModule.decodeToken(token);
      this.user = {
        name: decodedToken.sub,
        userId: decodedToken.userId, 
        role: decodedToken.role 
      };
      this.apiService.get(`${ConstService.GetUsername}/${this.user.name}`)
        .subscribe((data: any) => {
          this.setName(data.username);
          this.setUserId(data.userId);
          this.setRole(data.role);
          this.userInitialized = true; 
        });
    }
  }
}
