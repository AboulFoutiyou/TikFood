import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { lockClosedOutline, alertCircleOutline } from 'ionicons/icons';
import { IonicModule } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VendorService } from '../vendor/services/vendor.service';

@Component({
  selector: 'app-change-password',
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent  implements OnInit {
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  user: any;
  role: string = 'client';

  constructor( private api: ApiService, private router: Router, private toastController: ToastController, private vendorService: VendorService ) { 
    addIcons({
      'lock-closed-outline': lockClosedOutline,
      'alert-circle-outline': alertCircleOutline
     });
  }

  ngOnInit() {
    this.user = this.api.getStoredTUser();
    if (!this.user) {
      this.vendorService.vendorProfile$.subscribe(profile => {
      this.user = profile;
      this.role = 'vendor';
      console.log('Vendor profile loaded in edit profile:', this.user);
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

  changePassword() {
    this.errorMessage = '';

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les nouveaux mots de passe ne correspondent pas.';
      this.presentToast(this.errorMessage, 'danger');
      return;
    }

    if (this.newPassword.length < 8) {
      this.errorMessage = 'Le nouveau mot de passe doit contenir au moins 8 caractères.';
      this.presentToast(this.errorMessage, 'danger');
      return;
    }

    if (this.role === 'client') {
      this.api.changeClientPassword(this.user.id, this.oldPassword, this.newPassword).subscribe({
      next: (res) => {
        console.log('Mot de passe changé avec succès', res);
        // Afficher un message de succès ou rediriger l'utilisateur
        this.api.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur lors du changement de mot de passe', err);
        this.errorMessage = err.error?.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
        this.presentToast(this.errorMessage, 'danger');
      }
    });
  } else if (this.role === 'vendor') {
      this.api.changeVendorPassword(this.user.id, this.oldPassword, this.newPassword).subscribe({
      next: (res) => {
        console.log('Mot de passe changé avec succès', res);
        // Afficher un message de succès ou rediriger l'utilisateur
        this.api.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur lors du changement de mot de passe', err);
        this.errorMessage = err.error?.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
        this.presentToast(this.errorMessage, 'danger');
      }
    });

  }
  }

}
