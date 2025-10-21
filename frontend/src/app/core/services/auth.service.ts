import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readySubject = new BehaviorSubject<boolean>(false);
  public ready$ = this.readySubject.asObservable();

  private tokenKey = 'fastpass_token';
  
  // Dynamically set backend URL based on environment
  private apiUrl = this.getBackendUrl();
  private isLoadingUser = false;

  constructor(private http: HttpClient) {
    console.log('AuthService initialized with API URL:', this.apiUrl);
  }

  // Get backend URL - works for both local dev and Railway
  private getBackendUrl(): string {
    // For production (Railway), use relative URLs or full URL from env
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      
      // If we're in production on Railway, backend will be on same origin path or different domain
      // First try: check if there's a BACKEND_URL in sessionStorage (could be set from config)
      const storedBackendUrl = sessionStorage.getItem('backendUrl');
      if (storedBackendUrl) {
        return storedBackendUrl;
      }
      
      // Default behavior:
      // - Local dev: http://localhost:3000/api
      // - Railway (if frontend proxies): /api
      // - Railway (if separate services): use full URL from sessionStorage or detect
      if (origin.includes('localhost')) {
        return 'http://localhost:3000/api';
      } else {
        // Production on Railway - Frontend server proxies /api calls to backend
        return '/api';
      }
    }
    
    return '/api';
  }

  // Static method to set backend URL programmatically (useful for dynamic config)
  static setBackendUrl(url: string) {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('backendUrl', url);
    }
  }

  // Check if user has valid token and load profile
  checkToken(): void {
    // Reset ready state when checking token
    this.readySubject.next(false);
    
    const token = localStorage.getItem(this.tokenKey);
    console.log('AuthService.checkToken(): Token exists:', !!token);
    
    if (token && !this.isLoadingUser) {
      this.isLoadingUser = true;
      this.getProfile().subscribe(
        user => {
          console.log('AuthService.checkToken(): User profile loaded:', user);
          this.currentUserSubject.next(user);
          this.readySubject.next(true);
          this.isLoadingUser = false;
        },
        error => {
          console.error('AuthService.checkToken(): Error loading user profile:', error);
          this.logout();
          this.readySubject.next(true);
          this.isLoadingUser = false;
        }
      );
    } else {
      // No token, mark as ready
      console.log('AuthService.checkToken(): No token, marking as ready');
      this.readySubject.next(true);
    }
  }

  // Get Discord OAuth URL
  getDiscordAuthUrl(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/discord/login`);
  }

  // Get user profile
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/profile`);
  }

  // Discord callback - exchange code for token
  discordCallback(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/discord/callback`, { code }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  // Get current token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Check if logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }
}
