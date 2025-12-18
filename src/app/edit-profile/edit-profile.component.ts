import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ClientProfile } from '../vendor/models/vendor.model';
import { addIcons } from 'ionicons';
import { cameraOutline, lockClosedOutline } from 'ionicons/icons';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorService } from '../vendor/services/vendor.service';
import { ToastController } from '@ionic/angular';
import { catchError, of, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { VendorProfile } from '../vendor/models/vendor.model';

@Component({
  selector: 'app-edit-profile',
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent  implements OnInit {
  profile: any;
  vendorProfile: BehaviorSubject<VendorProfile | null> | null = null;
  role: string = 'client';

  constructor( private apiService: ApiService, private router: Router, private vendorService: VendorService, private toastController: ToastController ) { 
    addIcons({
      'camera-outline': cameraOutline,
      'lock-closed-outline': lockClosedOutline
     });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.profile = this.apiService.getStoredTUser() as ClientProfile;
    if (!this.profile) {
      this.vendorService.vendorProfile$.subscribe(profile => {
      this.profile = profile;
      this.vendorProfile = new BehaviorSubject<VendorProfile | null>(profile);; // Met à jour le BehaviorSubject avec le profil vendeur
      console.log('Vendor profile loaded in edit profile:', this.profile);
      this.role = 'vendor';
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

  saveProfile(): void {
    if (this.profile && this.role === 'client') {
      console.log('Sauvegarde du profil :', this.profile);
      //Appelez votre méthode de service pour mettre à jour le profil
      this.apiService.updateClientProfile(this.profile.id, this.profile).subscribe({
        next: (updatedProfile) => {
          this.presentToast('Profil mis à jour avec succès', 'success');
          // Afficher un toast de succès
          this.apiService.setUser(updatedProfile); // Met à jour le profil stocké
          this.loadProfile(); // Recharge le profil pour refléter les changements
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour', err);
          // Afficher un toast d'erreur
          this.presentToast(err.error.error.message, 'danger');
        }
      });
    } else if (this.profile && this.role === 'vendor') {
      const current = this.vendorProfile?.value;
      console.log('Profil vendeur actuel :', current);
      if (current) {
        const { id, createdAt, ...updates } = this.profile;
      this.apiService.updateVendorProfile(current.id, updates).pipe(
              tap(() => {
                this.loadProfile(); // Recharge le profil pour refléter les changements
                this.presentToast('Profil mis à jour avec succès', 'success');
              }),
              catchError(error => {
                console.error('Erreur lors de la mise à jour du profil:', error);
                this.ngOnInit();
                this.presentToast(error.error.error.message, 'danger');
                return of(null);
              })
      ).subscribe();
      }
    }
  }
  
  changePassword(): void {
    console.log('Navigation vers la page de changement de mot de passe...');
    this.router.navigate(['/change-password']);
  }

}
