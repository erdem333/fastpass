import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { switchMap, map, take, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    console.log('AuthGuard: Checking access to', state.url);
    
    // First check if token exists synchronously
    const token = this.authService.getToken();
    console.log('AuthGuard: Token exists:', !!token);
    
    if (!token) {
      console.log('AuthGuard: No token found, redirecting to login');
      this.router.navigate(['/auth/login']);
      return of(false);
    }

    // Token exists, now ensure user profile is loaded by calling checkToken
    console.log('AuthGuard: Token exists, calling checkToken() to load profile');
    this.authService.checkToken();

    // Wait for auth service to be ready and have a user
    return this.authService.currentUser$.pipe(
      filter(user => user !== null), // Wait until user is loaded
      take(1),
      map(user => {
        console.log('AuthGuard: User profile loaded:', user?.username);
        return true;
      })
    );
  }
}
