import { Component, OnInit } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonChip, IonContent, IonIcon, IonLabel, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Location } from '@angular/common';
import { arrowBack, chevronBack, imageOutline, restaurantOutline, remove, add, bagHandleOutline } from 'ionicons/icons';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-food-details',
  templateUrl: './food-details.component.html',
  styleUrls: ['./food-details.component.scss'],
  imports: [IonContent, IonIcon, IonButton, IonCard, IonCardContent, IonChip, IonLabel, IonImg],
})
export class FoodDetailsComponent  implements OnInit {
  quantite: number = 1;
  quantity = 1;
  product: any;
  basePrice = 12000; // Base price in F CFA

  constructor( private location: Location, private route: ActivatedRoute,
    private api: ApiService ) { 
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

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getProductById(id).subscribe(prod => {
        this.product = prod;
        console.log('Product details:', this.product);
      });
    }
  }


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
    const total = this.product ? this.product.price * this.quantity : 0;
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
