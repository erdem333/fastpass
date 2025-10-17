import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  isLoading = false;
  isProcessing = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check if we're returning from Discord OAuth with token
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.handleDiscordToken(params['token']);
      } else if (params['error']) {
        this.error = params['error'];
      } else if (params['code']) {
        // Legacy code handling (if needed)
        this.handleDiscordCallback(params['code']);
      }
    });
  }

  loginWithDiscord() {
    this.isLoading = true;
    this.error = null;

    // Get Discord OAuth URL from backend
    this.authService.getDiscordAuthUrl().subscribe(
      (response) => {
        console.log('Discord Auth URL received:', response);
        // Redirect to Discord
        if (response?.authUrl) {
          window.location.href = response.authUrl;
        } else {
          this.isLoading = false;
          this.error = 'Invalid auth URL received from server.';
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error getting Discord auth URL:', error);
        const errorMessage = error?.error?.error || error?.statusText || 'Unknown error';
        this.error = `Failed to initiate Discord login: ${errorMessage}`;
      }
    );
  }

  handleDiscordToken(token: string) {
    this.isProcessing = true;
    this.error = null;

    console.log('Received Discord token from redirect, storing and navigating to dashboard');

    // Store token in localStorage
    localStorage.setItem('fastpass_token', token);
    console.log('Token stored in localStorage:', !!localStorage.getItem('fastpass_token'));

    // Navigate to dashboard - AuthGuard will handle loading the profile
    this.isProcessing = false;
    this.router.navigate(['/dashboard']);
  }

  handleDiscordCallback(code: string) {
    this.isProcessing = true;
    this.error = null;

    console.log('Processing Discord callback with code:', code);

    this.authService.discordCallback(code).subscribe(
      (response) => {
        console.log('Discord authentication successful:', response);
        this.isProcessing = false;
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.isProcessing = false;
        console.error('Discord callback error:', error);
        const errorMessage = error?.error?.error || error?.statusText || 'Unknown error';
        this.error = `Authentication failed: ${errorMessage}`;
      }
    );
  }
}
