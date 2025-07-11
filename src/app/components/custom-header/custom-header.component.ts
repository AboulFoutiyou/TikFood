import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bagOutline, locationOutline } from 'ionicons/icons';

@Component({
  selector: 'app-custom-header',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent, IonButton, IonIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="custom-header">
      <div class="header-left">
        <div class="user-avatar">
          <div class="avatar-circle">
            <div class="avatar-face">
              <div class="eyes">
                <div class="eye"></div>
                <div class="eye"></div>
              </div>
              <div class="mouth"></div>
            </div>
          </div>
        </div>
        <div class="location-info">
          <div class="location-label">Votre position</div>
          <div class="location-text">
            <ion-icon name="location-outline" class="location-icon"></ion-icon>
            <span>Malika, Dakar</span>
          </div>
        </div>
      </div>
      
      <div class="header-right">
        <app-theme-toggle></app-theme-toggle>
        <ion-button fill="clear" class="cart-button">
          <ion-icon name="bag-outline" slot="icon-only"></ion-icon>
        </ion-button>
      </div>
    </div>
  `,
  styles: [`
    .custom-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: #ffffff;
      border-bottom: 1px solid #f3f4f6;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      .avatar-circle {
        width: 40px;
        height: 40px;
        background: #1f2937;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .avatar-face {
          .eyes {
            display: flex;
            gap: 6px;
            margin-bottom: 2px;

            .eye {
              width: 4px;
              height: 4px;
              background: #ffffff;
              border-radius: 50%;
            }
          }

          .mouth {
            width: 8px;
            height: 4px;
            border: 1px solid #ffffff;
            border-top: none;
            border-radius: 0 0 8px 8px;
          }
        }
      }
    }

    .location-info {
      .location-label {
        font-size: 12px;
        color: #9ca3af;
        margin-bottom: 2px;
      }

      .location-text {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        font-weight: 500;
        color: #1f2937;

        .location-icon {
          font-size: 14px;
          color: #ff7b00;
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cart-button {
      --color: #ff7b00;
      --background-hover: rgba(255, 123, 0, 0.1);
      --border-radius: 50%;
      --padding-start: 8px;
      --padding-end: 8px;
      width: 40px;
      height: 40px;
      
      ion-icon {
        font-size: 22px;
      }
    }

    // Dark theme support
    :host-context(.dark-theme) {
      .custom-header {
        background: #374151;
        border-bottom-color: #4b5563;
      }

      .location-info {
        .location-label {
          color: #9ca3af;
        }

        .location-text {
          color: #ffffff;
        }
      }

      .user-avatar .avatar-circle {
        background: #6b7280;
      }
    }

    // Responsive design
    @media (max-width: 480px) {
      .custom-header {
        padding: 12px 16px;
      }

      .location-info {
        .location-label {
          font-size: 11px;
        }

        .location-text {
          font-size: 13px;
        }
      }
    }
  `]
})
export class CustomHeaderComponent {
  constructor() {
    addIcons({
      'bag-outline': bagOutline,
      'location-outline': locationOutline
    });
  }
}