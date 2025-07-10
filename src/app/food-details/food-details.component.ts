import { Component, OnInit } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonChip, IonContent, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Location } from '@angular/common';
import { arrowBack, chevronBack, imageOutline, restaurantOutline, remove, add, bagHandleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-food-details',
  templateUrl: './food-details.component.html',
  styleUrls: ['./food-details.component.scss'],
  imports: [IonContent, IonIcon, IonButton, IonCard, IonCardContent, IonChip, IonLabel]
})
export class FoodDetailsComponent  implements OnInit {
  quantite: number = 1;
  quantity = 2;
  basePrice = 12000; // Base price in F CFA

  constructor( private location: Location ) { 
    addIcons({
      "arrow-back": arrowBack,
      'chevron-back': chevronBack,
      'image-outline': imageOutline,
      'restaurant-outline': restaurantOutline,
      'remove': remove,
      'add': add,
      'bag-handle-outline': bagHandleOutline

     });
  }

  ngOnInit() {}


increment() {
  this.quantite++;
}

decrement() {
  if (this.quantite > 1) {
    this.quantite--;
  }
}

goBack(): void {
    this.location.back();
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getTotalPrice(): string {
    const total = this.basePrice * this.quantity;
    return total.toLocaleString();
  }

  placeOrder(): void {
    // Implement order placement logic
    console.log('Order placed for quantity:', this.quantity);
    console.log('Total price:', this.getTotalPrice(), 'F CFA');
    
    // You could navigate to a confirmation page here
    // this.router.navigate(['/order-confirmation']);
  }

}
