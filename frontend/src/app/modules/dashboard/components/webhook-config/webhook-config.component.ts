import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../../../core/services/config.service';

@Component({
  selector: 'app-webhook-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './webhook-config.component.html',
  styleUrls: ['./webhook-config.component.scss']
})
export class WebhookConfigComponent implements OnInit, OnChanges {
  @Input() platform: any;

  presetName = '';
  webhookUrl = '';
  color = '#5b9cf5';
  footerText = '';
  logoUrl = '';

  isLoading = false;
  isSaving = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.loadWebhookConfig();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['platform'] && !changes['platform'].firstChange) {
      this.loadWebhookConfig();
    }
  }

  loadWebhookConfig() {
    if (!this.platform?._id) {
      this.resetForm();
      return;
    }

    this.isLoading = true;
    this.configService.getPlatformConfig(this.platform._id).subscribe(
      (config) => {
        if (config?.webhookConfig) {
          this.presetName = config.webhookConfig.presetName || '';
          this.webhookUrl = config.webhookConfig.webhookUrl || '';
          this.color = config.webhookConfig.color || '#5b9cf5';
          this.footerText = config.webhookConfig.footerText || '';
          this.logoUrl = config.webhookConfig.logoUrl || '';
        } else {
          this.resetForm();
        }
        this.isLoading = false;
      },
      (error) => {
        this.resetForm();
        this.isLoading = false;
      }
    );
  }

  resetForm() {
    this.presetName = '';
    this.webhookUrl = '';
    this.color = '#5b9cf5';
    this.footerText = '';
    this.logoUrl = '';
  }

  saveWebhook() {
    // Validation
    if (!this.presetName.trim()) {
      this.error = 'Preset name is required';
      return;
    }

    if (!this.webhookUrl.trim()) {
      this.error = 'Webhook URL is required';
      return;
    }

    if (!this.webhookUrl.startsWith('http')) {
      this.error = 'Webhook URL must start with http:// or https://';
      return;
    }

    if (!this.footerText.trim()) {
      this.error = 'Footer text is required';
      return;
    }

    if (!this.color.match(/^#[0-9A-F]{6}$/i)) {
      this.error = 'Invalid color format (use hex: #XXXXXX)';
      return;
    }

    this.isSaving = true;
    this.error = null;
    this.success = null;

    const webhookData = {
      presetName: this.presetName,
      webhookUrl: this.webhookUrl,
      color: this.color,
      footerText: this.footerText,
      logoUrl: this.logoUrl
    };

    this.configService.saveWebhook(this.platform._id, webhookData).subscribe(
      (response) => {
        this.success = 'Webhook configuration saved successfully!';
        this.isSaving = false;
        setTimeout(() => this.success = null, 3000);
      },
      (error) => {
        this.error = error.error?.error || 'Error saving webhook configuration';
        this.isSaving = false;
      }
    );
  }

  clearWebhook() {
    if (confirm('Are you sure? This will delete the webhook configuration.')) {
      this.resetForm();
      this.saveWebhook();
    }
  }

  testColor(hex: string) {
    this.color = hex;
  }
}
