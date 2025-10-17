import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private platformsSubject = new BehaviorSubject<any[]>([]);
  public platforms$ = this.platformsSubject.asObservable();

  private userConfigsSubject = new BehaviorSubject<any[]>([]);
  public userConfigs$ = this.userConfigsSubject.asObservable();

  // Set backend URL explicitly
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

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
}
