import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      console.log('AuthInterceptor: Added token to request', request.url);
    } else {
      console.log('AuthInterceptor: No token available for request', request.url);
    }

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          console.log('AuthInterceptor: Request successful', request.url);
        },
        (error) => {
          console.error('AuthInterceptor: Request failed', request.url, error);
        }
      )
    );
  }
}
