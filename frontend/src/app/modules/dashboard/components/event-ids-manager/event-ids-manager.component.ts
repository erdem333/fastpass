import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../../../core/services/config.service';

@Component({
  selector: 'app-event-ids-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-ids-manager.component.html',
  styleUrls: ['./event-ids-manager.component.scss']
})
export class EventIdsManagerComponent implements OnInit, OnChanges {
  @Input() platform: any;

  eventIds: string[] = [];
  newEventId = '';
  isLoading = false;
  error: string | null = null;

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.loadEventIds();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['platform'] && !changes['platform'].firstChange) {
      this.loadEventIds();
    }
  }

  loadEventIds() {
    if (!this.platform?._id) return;

    this.isLoading = true;
    this.configService.getPlatformConfig(this.platform._id).subscribe(
      (config) => {
        this.eventIds = config?.eventIds || [];
        this.isLoading = false;
      },
      (error) => {
        // If no config exists, just show empty
        this.eventIds = [];
        this.isLoading = false;
      }
    );
  }

  addEventId() {
    if (!this.newEventId.trim()) {
      this.error = 'Please enter a valid event ID';
      return;
    }

    if (this.eventIds.includes(this.newEventId)) {
      this.error = 'This event ID already exists';
      return;
    }

    this.isLoading = true;
    this.configService.addEventId(this.platform._id, this.newEventId).subscribe(
      (config) => {
        this.eventIds = config.eventIds;
        this.newEventId = '';
        this.error = null;
        this.isLoading = false;
      },
      (error) => {
        this.error = error.error?.error || 'Error adding event ID';
        this.isLoading = false;
      }
    );
  }

  removeEventId(eventId: string) {
    this.isLoading = true;
    this.configService.removeEventId(this.platform._id, eventId).subscribe(
      (config) => {
        this.eventIds = config.eventIds;
        this.isLoading = false;
      },
      (error) => {
        this.error = error.error?.error || 'Error removing event ID';
        this.isLoading = false;
      }
    );
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.addEventId();
    }
  }
}
