import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.authService.getToken();
    const isAdmin = this.authService.isAdmin();

    if (token && isAdmin) {
      // Token exists and user is admin, allow access to the route
      return true;
    } else {
      // No token or user is not admin, redirect to login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
