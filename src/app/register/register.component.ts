import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [ IonContent, NgIf, FormsModule]
})
export class RegisterComponent  implements OnInit {
  email: string = '';
  nom: string = '';
  telephone: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = '';
  address: string = '';
  region: string = '';
  step: number = 1;

  constructor(private api: ApiService, private router: Router, private toast: ToastController) { }

  ngOnInit() {
    this.role = '';
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toast.create({
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

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      console.error('Les mots de passe ne correspondent pas');
      this.presentToast('Les mots de passe ne correspondent pas', 'danger');
      this.step = 2;
      return;
    }
    
   const userData = {
    name: this.nom,       // 'name' est probablement correct
    email: this.email,
    password: this.password,
    phone: this.telephone, // Utilisez 'telephone' si c'est le nom dans le modèle
    location: this.address,     // Utilisez 'address' si c'est le nom dans le modèle
    //role: this.role,           // N'oubliez pas d'envoyer les autres champs si le backend en a besoin
    // region: this.region,
  };

    if (this.role === 'vendeur') {
      this.api.register(userData).subscribe({
        next: (res) => {
          console.log('Inscription vendeur réussie', res);
          this.presentToast('Inscription réussie !', 'success');
          this.api.setToken(res.token);
          this.router.navigate(['/vendor-dashboard']);
        },
        error: (err) => {
          console.error('Erreur d’inscription vendeur', err);
          this.presentToast(err.error.error.message, 'danger');
        }
      });
    } else if (this.role === 'client') {
      this.api.registerClient(userData).subscribe({
        next: (res) => {
          this.api.setToken(res.token);
          this.api.setUser(res.client);
          this.router.navigate(['/feed']);
        },
        error: (err) => {
          console.error('Erreur d’inscription client', err);
          this.presentToast(err.error.error.message, 'danger');
        }
      });
    } else {
      console.error('Rôle non reconnu');
      this.presentToast('Veuillez choisir un role', 'danger');
    }
  } 
  

}
