import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../service/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
 
  constructor(private router: Router,   private authService: AuthService,) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.isActive(path, true);
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
