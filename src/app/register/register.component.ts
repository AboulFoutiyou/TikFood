import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';


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

  constructor() { }

  ngOnInit() {}

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  onSubmit() {
    console.log('Formulare soumi');
    // Ajoute ici ton appel à une API ou ta logique de connexion
  }

}
