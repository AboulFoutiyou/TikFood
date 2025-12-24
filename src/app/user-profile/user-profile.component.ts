import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  receiptOutline,
  heartOutline,
  locationOutline,
  personCircleOutline,
  shieldCheckmarkOutline,
  logOutOutline
} from 'ionicons/icons';
import { IonIcon, IonHeader, IonContent, IonList, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton, IonItem, IonLabel, IonListHeader, IonSkeletonText } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { VendorService } from '../vendor/services/vendor.service';
import { Location } from '@angular/common';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, IonIcon, IonHeader, IonContent, IonList, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton, IonItem, IonLabel, IonListHeader, IonSkeletonText],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent  implements OnInit {
  userProfile: any;
  role: string = 'client';

  constructor( private apiService: ApiService, private router: Router, private alertController: AlertController, private vendorService: VendorService, private location: Location, private toastController: ToastController ) {
    addIcons({
      'receipt-outline': receiptOutline,
      'heart-outline': heartOutline,
      'location-outline': locationOutline,
      'person-circle-outline': personCircleOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'log-out-outline': logOutOutline,
     });
   }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userProfile = this.apiService.getStoredTUser();
    if (!this.userProfile) {
      this.vendorService.vendorProfile$.subscribe(profile => {
      this.userProfile = profile;
      this.role = 'vendor';
      console.log('Vendor profile loaded in user profile:', this.userProfile);
    });
    }
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000, // Le toast disparaît après 3 secondes
      position: 'top', // 'top', 'bottom', ou 'middle'
      color: color,    // Utilise les couleurs du thème Ionic
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  goBack(): void {
    // this.location.back();
    if (this.role === 'vendor') {
      this.router.navigate(['/vendor-dashboard']);
    } else {
      this.router.navigate(['/feed']);
    }
  }

  /**
   * Génère les initiales à partir d'un nom.
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
   * Méthode générique pour la navigation.
   */
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  async confirmDeleteAccount(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Êtes-vous sûr ?',
      message: 'Cette action est irréversible. Toutes vos données seront définitivement supprimées.',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Supprimer',
          cssClass: 'danger-button',
          handler: () => {
            this.deleteAccount();
          },
        },
      ],
    });
    await alert.present();
  }

  logout(): void {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }

  deleteAccount(): void {
    if (this.userProfile && this.userProfile.id && this.role === 'client') {
      this.apiService.deleteClientAccount(this.userProfile.id).subscribe({  
        next: () => {
          this.logout();
        },
        error: (err) => {
          console.error('Error deleting account:', err);
          this.presentToast('Erreur lors de la suppression du compte', 'danger');
        } 
      });
    } else if (this.userProfile && this.userProfile.id && this.role === 'vendor') {
      this.apiService.deleteVendorAccount(this.userProfile.id).subscribe({  
        next: () => {
          this.logout();
        },
        error: (err) => {
          console.error('Error deleting account:', err);
          this.presentToast('Erreur lors de la suppression du compte', 'danger');
        } 
      });
    } else {
      console.error('User profile or ID not found.');
      this.presentToast('Erreur lors de la suppression du compte', 'danger');
    }
  }

}
