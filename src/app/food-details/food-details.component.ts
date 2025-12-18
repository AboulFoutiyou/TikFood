import { Component, OnInit } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonChip, IonToolbar, IonFooter, IonButtons, IonTitle, IonContent, IonIcon, IonLabel, IonImg, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Location } from '@angular/common';
import { arrowBack, chevronBack, imageOutline, restaurantOutline, remove, add, bagHandleOutline, addCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Order } from '../vendor/models/vendor.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-food-details',
  templateUrl: './food-details.component.html',
  styleUrls: ['./food-details.component.scss'],
  imports: [IonContent, IonIcon, IonButton, IonToolbar, IonFooter, IonButtons, IonCard, IonCardContent, IonChip, IonLabel, IonImg, IonTitle, IonAvatar],
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
      'bag-handle-outline': bagHandleOutline,
      'add-circle-outline': addCircleOutline,
      'remove-circle-outline': removeCircleOutline
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
  }).then(
    (alert) => { 
      alert.present(); return alert;
     }
  );
  await alert.present();
  this.goBack();
}

goToLoginAlert() {
  this.alertController.create({
    header: 'Connexion requise',
    message: 'Veuillez vous connecter pour passer une commande.',
    buttons: ['OK'],
  }).then(alert => alert.present());
}

goTofeed() {
  this.location.back();
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

    if ( !this.api.isAuthenticated() ) {
      this.goToLoginAlert();
      return;
    }

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

    this.api.createOrder(order).subscribe({
    next: (res) => {
      this.showConfirmation();
    },
    error: (err) => {
      console.error('Erreur lors de la commande', err);
      if (err.error?.error?.details) {
    console.error('Détails de la validation :', err.error.error.details);
  }
    }
  });
    
  }

  navigateToVendor(vendorId: string): void {
    // Implement navigation to vendor profile
    console.log('Navigating to vendor profile with ID:', vendorId);
  }

  formatPrice(price: number): string {
    return price.toLocaleString();
  }

}
