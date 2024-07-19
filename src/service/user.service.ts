import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api/api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ConstService } from './const.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserAccount } from '../model/UserAccount';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: any = {
    fullname: 'Jane Doe',
    role: 'ROLE_ADMIN',
  };
  private userIdSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    this.user.userId
  );
  // chuyển giá trị number từ service sang  component
  userId$: Observable<number> = this.userIdSubject.asObservable();
  private nameSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.user.name
  );
  // chuyển giá trị name từ service sang  component
  name$: Observable<string> = this.nameSubject.asObservable();

  private rolenameSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.user.role
  );
  // chuyển giá trị name từ service sang  component
  role$: Observable<string> = this.rolenameSubject.asObservable();

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
  // check token và lấy các thông tin của user acount để truyền từ service sang  component
  initializeUserFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.JwtModule.decodeToken(token);
      this.user = {
        name: decodedToken.sub, // Update the name with the username from the token
      };
      this.apiService
        .get(`${ConstService.GetUsername}/${this.user.name}`)
        .subscribe((data: UserAccount) => {
          this.setName(data.username);
          this.setUserId(data.employeeId);
          this.setRole(data.role);
        });
      }
    }
}
