import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonContent, FormsModule, NgIf],
})
export class LoginComponent  implements OnInit {
  email: string = '';
  password: string = '';

  constructor() { }

  ngOnInit() {}

  onSubmit() {
    console.log('Email:', this.email);
    console.log('Mot de passe:', this.password);
    // Ajoute ici ton appel à une API ou ta logique de connexion
  }

}
