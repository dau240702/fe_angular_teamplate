import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../../service/auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from '../../../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  user: any = {
    name: 'Jane Doe',
  };
  constructor(    private router: Router,
    private authService: AuthService,
    private JwtModule: JwtHelperService,
    private userService: UserService,){

  }
  ngOnInit(): void {
    this.userService.initializeUserFromToken();
    this.userService.name$.subscribe(name => {
      this.user.name = name;
    });
  }
  Logout() {
    localStorage.removeItem('user');
    this.onLogout.emit('/login');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  @Output()
  onLogout = new EventEmitter<string>();
}
