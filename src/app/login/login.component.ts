import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ApiService, Credentials } from '../services/api.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonContent, FormsModule, NgIf,],
})
export class LoginComponent  implements OnInit {
  email: string = '';
  password: string = '';
  credentials: Credentials = { 'email': '', 'phone':'', 'password': '' };
  error: string | null = null;
  identifier: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {}

  onSubmit() {
    const id = (this.identifier || '').trim();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id);
    const isPhone = /^[0-9+\s()-]{6,}$/.test(id);

    if (isEmail) {
      this.credentials.email = id;
      this.credentials.phone = undefined;
    } else if (isPhone) {
      this.credentials.phone = id;
      this.credentials.email = undefined;
    } else {
      this.error = 'Veuillez entrer une adresse email ou un numéro de téléphone valide.';
      return;
    }
    // Ajoute ici ton appel à une API ou ta logique de connexion
    this.apiService.login(this.credentials).subscribe({
      next: (response) => {
        this.apiService.handleLoginSuccess(response);
        // Redirige l'utilisateur ou recharge la page
        this.router.navigate(['/vendor-dashboard']);
        this.apiService.setToken(response.token);

      },
      error: (err) => {
        this.error = err.error.error.message;
        console.error('Login vendor failed:', this.error);
        // Si vendeur échoue, essayer comme client
        if (err.error.error.message != 'Mot de passe incorrect.') {
        this.apiService.loginClient(this.credentials).subscribe({
          next: (response) => {
            this.apiService.handleLoginSuccess(response);
            this.apiService.setToken(response.token);
            this.apiService.setUser(response.client);
            this.router.navigate(['/feed']);
          },
          error: (err) => {
            console.error('Login failed:', err);
            this.error = err.error.error.message;
          }
        });
        } 
      }
    });
  }

}
