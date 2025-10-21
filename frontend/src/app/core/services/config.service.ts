import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, firstValueFrom } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface AppConfig {
  backendUrl: string;
  environment: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private platformsSubject = new BehaviorSubject<any[]>([]);
  public platforms$ = this.platformsSubject.asObservable();

  private userConfigsSubject = new BehaviorSubject<any[]>([]);
  public userConfigs$ = this.userConfigsSubject.asObservable();

  private config: AppConfig | null = null;
  
  // Dynamic backend URL based on environment
  private apiUrl = this.getBackendUrl();

  constructor(private http: HttpClient) {}

  // Initialize config on startup
  async initializeConfig(): Promise<AppConfig> {
    if (this.config) {
      return this.config;
    }

    try {
      // Try to load from assets/config.json (can be configured for different environments)
      this.config = await firstValueFrom(this.http.get<AppConfig>('assets/config.json'));
    } catch (error) {
      console.warn('Config file not found, using defaults');
      this.config = {
        backendUrl: this.getBackendUrl(),
        environment: this.getEnvironment()
      };
    }

    // Set the backend URL in AuthService if provided
    if (this.config.backendUrl) {
      AuthService.setBackendUrl(this.config.backendUrl);
      console.log('Config initialized with backend URL:', this.config.backendUrl);
    }

    // Update API URL
    this.apiUrl = this.getBackendUrl();

    return this.config;
  }

  private getBackendUrl(): string {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      
      if (origin.includes('localhost')) {
        return 'http://localhost:3000/api';
      } else {
        // Production - use relative path (same domain)
        return '/api';
      }
    }
    return '/api';
  }

  private getEnvironment(): string {
    if (typeof window !== 'undefined') {
      return window.location.hostname.includes('localhost') ? 'development' : 'production';
    }
    return 'production';
  }

  // Get all platforms
  getPlatforms(category?: string, country?: string): Observable<any[]> {
    let query = '';
    if (category || country) {
      const params = [];
      if (category) params.push(`category=${category}`);
      if (country) params.push(`country=${country}`);
      query = `?${params.join('&')}`;
    }

    return this.http.get<any[]>(`${this.apiUrl}/platforms${query}`).pipe(
      tap(platforms => this.platformsSubject.next(platforms))
    );
  }

  // Get user configurations
  getUserConfigs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/config`).pipe(
      tap(configs => this.userConfigsSubject.next(configs))
    );
  }

  // Get configuration for a specific platform
  getPlatformConfig(platformId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/config/platform/${platformId}`);
  }

  // Save or update configuration
  saveConfig(platformId: string, config: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/config/platform/${platformId}`, config).pipe(
      tap(updated => {
        const configs = this.userConfigsSubject.value;
        const index = configs.findIndex(c => c.platformId === platformId);
        if (index > -1) {
          configs[index] = updated;
        } else {
          configs.push(updated);
        }
        this.userConfigsSubject.next([...configs]);
      })
    );
  }

  // Add event ID
  addEventId(platformId: string, eventId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/config/platform/${platformId}/event`, { eventId }).pipe(
      tap(updated => {
        const configs = this.userConfigsSubject.value;
        const index = configs.findIndex(c => c.platformId === platformId);
        if (index > -1) {
          configs[index] = updated;
        }
        this.userConfigsSubject.next([...configs]);
      })
    );
  }

  // Remove event ID
  removeEventId(platformId: string, eventId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/config/platform/${platformId}/event/${eventId}`).pipe(
      tap(updated => {
        const configs = this.userConfigsSubject.value;
        const index = configs.findIndex(c => c.platformId === platformId);
        if (index > -1) {
          configs[index] = updated;
        }
        this.userConfigsSubject.next([...configs]);
      })
    );
  }

  // Save webhook configuration
  saveWebhook(platformId: string, webhook: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/config/platform/${platformId}/webhook`, webhook).pipe(
      tap(updated => {
        const configs = this.userConfigsSubject.value;
        const index = configs.findIndex(c => c.platformId === platformId);
        if (index > -1) {
          configs[index] = updated;
        }
        this.userConfigsSubject.next([...configs]);
      })
    );
  }

  // Getter methods for config
  getConfig(): AppConfig | null {
    return this.config;
  }

  getBackendUrlConfig(): string {
    return this.config?.backendUrl || this.getBackendUrl();
  }

  getEnvironmentConfig(): string {
    return this.config?.environment || this.getEnvironment();
  }
}
