import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moonOutline, sunnyOutline } from 'ionicons/icons';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ThemeService],
  template: `
    <ion-button 
      fill="clear" 
      shape="round"
      class="theme-toggle-btn"
      (click)="toggleTheme()">
      <ion-icon 
        [name]="isDarkMode ? 'sunny-outline' : 'moon-outline'" 
        slot="icon-only">
      </ion-icon>
    </ion-button>
  `,
  styles: [`
    .theme-toggle-btn {
      --color: #6b7280;
      --background-hover: rgba(107, 114, 128, 0.1);
      --border-radius: 50%;
      --padding-start: 8px;
      --padding-end: 8px;
      width: 40px;
      height: 40px;
      
      ion-icon {
        font-size: 20px;
      }
    }

    :host-context(.dark-theme) .theme-toggle-btn {
      --color: #d1d5db;
      --background-hover: rgba(209, 213, 219, 0.1);
    }
  `]
})
export class ThemeToggleComponent {
  isDarkMode = false;

  constructor(private themeService: ThemeService) {
    addIcons({
      'moon-outline': moonOutline,
      'sunny-outline': sunnyOutline
    });

    // S'abonner aux changements de thème
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }
}