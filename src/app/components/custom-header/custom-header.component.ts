import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bagHandleOutline, locationOutline, chevronDownOutline } from 'ionicons/icons';
import { ApiService } from 'src/app/services/api.service';
import { ClientProfile } from 'src/app/vendor/models/vendor.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-header',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent, IonButton, IonIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss']
})
export class CustomHeaderComponent {
  
  clientProfile: ClientProfile | null = null;
  cartItemCount: number = 0; // Pour l'exemple

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    addIcons({
      'bag-handle-outline': bagHandleOutline,
      'location-outline': locationOutline,
      'chevron-down-outline': chevronDownOutline
    });
  }

  ngOnInit(): void {
    this.loadClientProfile();
  }

  loadClientProfile(): void {
    this.clientProfile = this.apiService.getStoredTUser();
  }

  /**
   * Génère les initiales à partir d'un nom complet.
   * Ex: "Aboul Foutiyou" -> "AF"
   */
  getInitials(name: string | undefined): string {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  /**
   * Logique pour récupérer la position de l'utilisateur.
   */
  async changeLocation(): Promise<void> {
    console.log("Tentative de changement de localisation...");
    // C'est ici que vous intégreriez la logique de géolocalisation
    /*
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Coordonnées actuelles :', coordinates);
      // Ensuite, vous utiliseriez une API de "reverse geocoding" pour
      // transformer les coordonnées (latitude, longitude) en une adresse.
    } catch (error) {
      console.error('Erreur lors de la récupération de la position', error);
      // Gérer le cas où l'utilisateur refuse la permission
    }
    */
  }

  navigateToProfile(): void {
    if (this.clientProfile) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']); // Si pas connecté, on va au login
    }
  }

  navigateToCart(): void {
    if (!this.apiService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/cart']);
  }
}