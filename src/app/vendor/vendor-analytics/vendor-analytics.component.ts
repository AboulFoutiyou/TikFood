import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.service';
import { Analytics } from '../models/vendor.model';
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
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonLabel,
  IonProgressBar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  chevronBack,
  trendingUpOutline,
  bagHandleOutline,
  cashOutline,
  timeOutline,
  barChartOutline,
  pieChartOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-vendor-analytics',
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
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonLabel,
    IonProgressBar
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vendor-analytics.component.html',
  styleUrls: ['./vendor-analytics.component.scss']
})
export class VendorAnalyticsComponent implements OnInit {
  analytics: Analytics | null = null;
  weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {
    addIcons({
      'chevron-back': chevronBack,
      'trending-up-outline': trendingUpOutline,
      'bag-handle-outline': bagHandleOutline,
      'cash-outline': cashOutline,
      'time-outline': timeOutline,
      'bar-chart-outline': barChartOutline,
      'pie-chart-outline': pieChartOutline
    });
  }

  ngOnInit(): void {
    this.vendorService.getAnalytics().subscribe(analytics => {
      this.analytics = analytics;
    });
  }

  goBack(): void {
    this.router.navigate(['/vendor-dashboard']);
  }

  formatPrice(price: number): string {
    return price.toLocaleString() + ' F CFA';
  }

  getMaxWeeklyValue(data: number[]): number {
    return Math.max(...data, 1);
  }

  getBarHeight(value: number, maxValue: number): number {
    return Math.max((value / maxValue) * 100, 2);
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
      'confirmed': 'Confirmées',
      'preparing': 'En préparation',
      'ready': 'Prêtes',
      'delivered': 'Livrées',
      'cancelled': 'Annulées'
    };
    return labels[status] || status;
  }

  getTotalWeeklyOrders(): number {
    return this.analytics?.weeklyOrders.reduce((a, b) => a + b, 0) || 0;
  }

  getTotalWeeklyRevenue(): number {
    return this.analytics?.weeklyRevenue.reduce((a, b) => a + b, 0) || 0;
  }
}