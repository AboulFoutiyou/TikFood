import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.service';
import { VendorProfile, Analytics } from '../models/vendor.model';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonButton, 
  IonIcon,
  IonToggle,
  IonLabel,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonChip
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  restaurantOutline,
  bagHandleOutline,
  analyticsOutline,
  addCircleOutline,
  timeOutline,
  locationOutline,
  callOutline,
  trendingUpOutline,
  todayOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ThemeToggleComponent,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonToggle,
    IonLabel,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonChip
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss']
})
export class VendorDashboardComponent implements OnInit {
  vendorProfile: VendorProfile | null = null;
  analytics: Analytics | null = null;

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {
    addIcons({
      'restaurant-outline': restaurantOutline,
      'bag-handle-outline': bagHandleOutline,
      'analytics-outline': analyticsOutline,
      'add-circle-outline': addCircleOutline,
      'time-outline': timeOutline,
      'location-outline': locationOutline,
      'call-outline': callOutline,
      'trending-up-outline': trendingUpOutline,
      'today-outline': todayOutline
    });
  }

  ngOnInit(): void {
    this.vendorService.vendorProfile$.subscribe(profile => {
      this.vendorProfile = profile;
    });

    this.vendorService.getAnalytics().subscribe(analytics => {
      this.analytics = analytics;
    });
  }

  toggleAvailability(): void {
    this.vendorService.toggleAvailability();
  }

  navigateToProducts(): void {
    this.router.navigate(['/vendor-products']);
  }

  navigateToOrders(): void {
    this.router.navigate(['/vendor-orders']);
  }

  navigateToAnalytics(): void {
    this.router.navigate(['/vendor-analytics']);
  }

  formatPrice(price: number): string {
    return price.toLocaleString() + ' F CFA';
  }

  getStatusColor(isAvailable: boolean): string {
    return isAvailable ? 'success' : 'danger';
  }

  getStatusText(isAvailable: boolean): string {
    return isAvailable ? 'Disponible' : 'Indisponible';
  }

  get weeklyOrdersTotal(): number {
  return this.analytics?.weeklyOrders?.reduce((a, b) => a + b, 0) || 0;
}
}