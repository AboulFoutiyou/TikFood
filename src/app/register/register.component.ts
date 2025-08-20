import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';


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

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {}

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      console.error('Les mots de passe ne correspondent pas');
      return;
    }
    
   const vendorData = {
    name: this.nom,       // 'name' est probablement correct
    email: this.email,
    password: this.password,
    phone: this.telephone, // Utilisez 'telephone' si c'est le nom dans le modèle
    location: this.address,     // Utilisez 'address' si c'est le nom dans le modèle
    // role: this.role,           // N'oubliez pas d'envoyer les autres champs si le backend en a besoin
    // region: this.region,
  };

    this.api.register(vendorData).subscribe({
      next: (res) => {
        console.log('Inscription réussie', res);
        // tu peux stocker le token ou rediriger
        this.api.setToken(res.token);
        this.router.navigate(['/vendor-dashboard']);
        
      },
      error: (err) => {
        console.error('Erreur d’inscription', err);
      }
    });
  }
  

}
