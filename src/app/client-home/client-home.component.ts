import { Component, OnInit } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.scss'],
  imports: [ IonContent, IonIcon],
})
export class ClientHomeComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
