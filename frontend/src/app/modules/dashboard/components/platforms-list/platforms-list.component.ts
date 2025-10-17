import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../../core/services/config.service';

@Component({
  selector: 'app-platforms-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './platforms-list.component.html',
  styleUrls: ['./platforms-list.component.scss']
})
export class PlatformsListComponent implements OnInit {
  @Output() platformSelected = new EventEmitter<any>();

  platforms$: Observable<any[]>;
  userConfigs$: Observable<any[]>;

  selectedPlatform: any = null;
  selectedCategory = 'ticketing';
  searchQuery = '';
  isLoading = true;

  categories = ['ticketing', 'sports'];

  constructor(private configService: ConfigService) {
    this.platforms$ = this.configService.platforms$;
    this.userConfigs$ = this.configService.userConfigs$;
  }

  ngOnInit() {
    this.loadPlatforms();
    this.configService.getUserConfigs().subscribe(
      () => this.isLoading = false,
      error => {
        console.error('Error loading configs:', error);
        this.isLoading = false;
      }
    );
  }

  loadPlatforms() {
    this.configService.getPlatforms(this.selectedCategory).subscribe(
      () => this.isLoading = false,
      error => {
        console.error('Error loading platforms:', error);
        this.isLoading = false;
      }
    );
  }

  selectPlatform(platform: any) {
    this.selectedPlatform = platform;
    this.platformSelected.emit(platform);
  }

  getEventIdCount(platformId: string): number {
    const userConfigs = this.getUserConfigsValue();
    const config = userConfigs.find(c => c.platformId?._id === platformId || c.platformId === platformId);
    return config?.eventIds?.length || 0;
  }

  getUserConfigsValue(): any[] {
    let result: any[] = [];
    this.userConfigs$.subscribe(configs => result = configs).unsubscribe();
    return result;
  }

  isActive(platform: any): boolean {
    return this.selectedPlatform?._id === platform._id;
  }
}
