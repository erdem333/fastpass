import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { PlatformsListComponent } from '../../components/platforms-list/platforms-list.component';
import { EventIdsManagerComponent } from '../../components/event-ids-manager/event-ids-manager.component';
import { WebhookConfigComponent } from '../../components/webhook-config/webhook-config.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    PlatformsListComponent,
    EventIdsManagerComponent,
    WebhookConfigComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any = null;
  isLoading = false;
  selectedPlatform: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Dashboard: Component initialized');
    
    // Subscribe to current user to display user data
    this.authService.currentUser$.subscribe(user => {
      console.log('Dashboard: Current user:', user);
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  onPlatformSelected(platform: any) {
    this.selectedPlatform = platform;
  }
}
