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
  credentials: Credentials = { 'email': '', 'password': '' };
  error: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {}

  onSubmit() {
    console.log('Email:', this.email);
    console.log('Mot de passe:', this.password);
    // Ajoute ici ton appel à une API ou ta logique de connexion
    this.apiService.login(this.credentials).subscribe({
      next: (response) => {
        this.apiService.handleLoginSuccess(response);
        // Redirige l'utilisateur ou recharge la page
        this.router.navigate(['/vendor-dashboard']);
        this.apiService.setToken(response.token);

      },
      error: (err) => {
        this.error = 'Email ou mot de passe incorrect';
      }
    });
  }

}
