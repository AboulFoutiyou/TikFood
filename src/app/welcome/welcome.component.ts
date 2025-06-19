import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  imports: [ IonContent]
})
export class WelcomeComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
