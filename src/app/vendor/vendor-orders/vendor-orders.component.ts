import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.service';
import { Order } from '../models/vendor.model';
import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonCard,
  IonCardContent,
  IonChip,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  chevronBack,
  timeOutline,
  personOutline,
  callOutline,
  locationOutline,
  bagHandleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-vendor-orders',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonCard,
    IonCardContent,
    IonChip,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonBadge
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vendor-orders.component.html',
  styleUrls: ['./vendor-orders.component.scss']
})
export class VendorOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus: string = 'all';

  statusOptions = [
    { value: 'all', label: 'Toutes' },
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmées' },
    { value: 'preparing', label: 'En préparation' },
    { value: 'ready', label: 'Prêtes' },
    { value: 'delivered', label: 'Livrées' },
    { value: 'cancelled', label: 'Annulées' }
  ];

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {
    addIcons({
      'chevron-back': chevronBack,
      'time-outline': timeOutline,
      'person-outline': personOutline,
      'call-outline': callOutline,
      'location-outline': locationOutline,
      'bag-handle-outline': bagHandleOutline
    });
  }

  ngOnInit(): void {
    this.vendorService.orders$.subscribe(orders => {
      this.orders = orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
      this.filterOrders();
    });
  }

  goBack(): void {
    this.router.navigate(['/vendor-dashboard']);
  }

  onStatusFilterChange(event: any): void {
    this.selectedStatus = event.detail.value;
    this.filterOrders();
  }

  filterOrders(): void {
    if (this.selectedStatus === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.selectedStatus);
    }
  }

  updateOrderStatus(orderId: string, status: string): void {
    this.vendorService.updateOrderStatus(orderId, status as Order['status']);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': 'warning',
      'confirmed': 'primary',
      'preparing': 'secondary',
      'ready': 'success',
      'delivered': 'success',
      'cancelled': 'danger'
    };
    return colors[status] || 'medium';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'En attente',
      'confirmed': 'Confirmée',
      'preparing': 'En préparation',
      'ready': 'Prête',
      'delivered': 'Livrée',
      'cancelled': 'Annulée'
    };
    return labels[status] || status;
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'À l\'instant';
    } else if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Il y a ${hours}h`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Il y a ${days}j`;
    }
  }

  formatPrice(price: number): string {
    return price.toLocaleString() + ' F CFA';
  }

  getNextStatusOptions(currentStatus: string): { value: string; label: string }[] {
    const statusFlow: { [key: string]: string[] } = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['preparing', 'cancelled'],
      'preparing': ['ready', 'cancelled'],
      'ready': ['delivered'],
      'delivered': [],
      'cancelled': []
    };

    const nextStatuses = statusFlow[currentStatus] || [];
    return this.statusOptions.filter(option => nextStatuses.includes(option.value));
  }

  canUpdateStatus(status: string): boolean {
    return !['delivered', 'cancelled'].includes(status);
  }
}