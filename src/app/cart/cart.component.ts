import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/vendor/models/vendor.model';
import { ApiService } from 'src/app/services/api.service';
import { ClientProfile } from 'src/app/vendor/models/vendor.model';
import { addIcons } from 'ionicons';
import { receiptOutline, fastFoodOutline, closeCircleOutline } from 'ionicons/icons';
import { IonIcon, IonHeader, IonContent, IonList, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [IonIcon, IonHeader, IonContent, IonList, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent  implements OnInit {
  clientProfile: ClientProfile | null = null;
  orders: Order[] = [];

  // On définit l'ordre des statuts pour la barre de progression
  private statusOrder: Order['status'][] = ['pending', 'preparing', 'ready', 'delivered'];

  constructor( private apiService: ApiService ) { 
    addIcons({
      'receipt-outline': receiptOutline,
      'fast-food-outline': fastFoodOutline,
      'close-circle-outline': closeCircleOutline
     });
  }

  ngOnInit() {
    this.loadClientProfile();
  }

  loadClientProfile(): void {
    this.clientProfile = this.apiService.getStoredTUser();
    if (this.clientProfile) {
      this.fetchOrders(this.clientProfile.id);
    } else {
      console.error('Client profile not found');
    }
  }

  fetchOrders(clientId: string): void {
    this.apiService.getClientOrders(clientId).subscribe({
      next: (orders) => {
        this.orders = orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());;
        console.log('Orders loaded:', this.orders);
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });
  }

  /**
   * Vérifie si un statut est l'étape actuelle.
   */
  isStatusActive(orderStatus: Order['status'], stepStatus: Order['status']): boolean {
    return orderStatus === stepStatus;
  }

  /**
   * Vérifie si un statut est une étape déjà passée.
   */
  isStatusCompleted(orderStatus: Order['status'], stepStatus: Order['status']): boolean {
    const orderIndex = this.statusOrder.indexOf(orderStatus);
    const stepIndex = this.statusOrder.indexOf(stepStatus);
    return stepIndex < orderIndex;
  }

}
