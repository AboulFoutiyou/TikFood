import { Component, OnInit } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonChip, IonContent, IonIcon, IonLabel, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Location } from '@angular/common';
import { arrowBack, chevronBack, imageOutline, restaurantOutline, remove, add, bagHandleOutline } from 'ionicons/icons';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Order } from '../vendor/models/vendor.model';
import { AlertController } from '@ionic/angular';

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
  vendorName: string = 'Inconnu';

  constructor( private location: Location, private route: ActivatedRoute,
    private api: ApiService, private alertController: AlertController ) { 
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
        if (prod?.vendorId) {
        this.api.getVendorProfile(prod.vendorId).subscribe(vendor => {
          this.vendorName = vendor?.name || 'Inconnu';
        });
      }
        console.log('Product details:', this.product);
      });
    }
  }

  async showConfirmation() {
  const alert = await this.alertController.create({
    header: 'Commande validée',
    message: 'Votre commande a bien été envoyée !',
    buttons: ['OK'],
  });
  await alert.present();
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

    if (!this.product) return;
    const currentClient = this.api.getStoredTUser();
    console.log('Current client:', currentClient);

    const order: Omit<Order, 'id'| 'productName' | 'createdAt' | 'updatedAt' | 'vendorId'> = {
    productId: this.product.id,
    //productName: this.product.name,
    customerName: currentClient ? currentClient.name : 'Inconnu',
    customerPhone: currentClient ? currentClient.phone : 'Inconnu',
    quantity: this.quantity,
    totalPrice: this.product.price * this.quantity,
    status: 'pending',
    orderDate: new Date(),
    deliveryAddress: currentClient ? currentClient.location : 'Inconnu',
    notes: '', // ou récupère depuis un champ de saisie si besoin
  };

    console.log('Order details:', order);

    this.api.createOrder(order).subscribe({
    next: (res) => {
      console.log('Commande envoyée !', res);
      this.showConfirmation();
      // Redirige ou affiche une confirmation ici si besoin
    },
    error: (err) => {
      console.error('Erreur lors de la commande', err);
      if (err.error?.error?.details) {
    console.error('Détails de la validation :', err.error.error.details);
  }
    }
  });
    
  }

}
