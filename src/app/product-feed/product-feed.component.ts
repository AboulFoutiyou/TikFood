import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeToggleComponent } from '../components/theme-toggle/theme-toggle.component';
import { CustomHeaderComponent } from '../components/custom-header/custom-header.component';
import { 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonChip, 
  IonLabel,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonGrid,
  IonRow,
  IonCol,
  IonImg
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  heartOutline, 
  heart,
  chatbubbleOutline,
  shareOutline,
  restaurantOutline,
  timeOutline,
  locationOutline
} from 'ionicons/icons';
import { ApiService } from '../services/api.service';
import { VendorProduct } from '../vendor/models/vendor.model';
import { VendorProfile } from '../vendor/models/vendor.model';

export interface Product {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  images: string[];
  category: 'sucré' | 'salé' | 'mixte' | 'jus';
  description: string;
  publishedAt: Date;
  location: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

@Component({
  selector: 'app-product-feed',
  templateUrl: './product-feed.component.html',
  styleUrls: ['./product-feed.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    // ThemeToggleComponent,
    CustomHeaderComponent,
    IonContent,
    IonCard,
    IonCardContent,
    IonChip,
    IonLabel,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductFeedComponent  implements OnInit {
  selectedCategory: string = 'tous';
  products: VendorProduct[] = [];
  vendorProfile: VendorProfile | null = null;
  vendorProfiles: { [vendorId: string]: VendorProfile } = {};

  filteredProducts: VendorProduct[] = [];

  constructor(private router: Router, private apiService: ApiService) { 
     addIcons({
      'heart-outline': heartOutline,
      'heart': heart,
      'chatbubble-outline': chatbubbleOutline,
      'share-outline': shareOutline,
      'restaurant-outline': restaurantOutline,
      'time-outline': timeOutline,
      'location-outline': locationOutline
    });

    // Initialize filtered products
    this.filteredProducts = [...this.products];
  }
loadProducts(): void {
  this.apiService.getProductsFeed().subscribe({
    next: (products) => {
      this.products = products;
      products.forEach(product => {
        if (product.vendorId && !this.vendorProfiles[product.vendorId]) {
          this.apiService.getVendorProfile(product.vendorId).subscribe({
            next: (profile) => this.vendorProfiles[product.vendorId] = profile
          });
        }
      });
      this.filterProducts();
    },
    error: (err) => {
      console.error('Erreur lors du chargement des produits :', err);
    }
  });
}
  ngOnInit() : void {
    this.filterProducts();
    this.loadProducts();
    // for (const product of this.products) {
    //   this.loadVendorProfile(product.vendorId);
    // }
  }

  loadVendorProfile(id: string): void {
      this.apiService.getVendorProfile(id).subscribe({
        next: (profile) => {
          this.vendorProfile = profile;
        },
        error: (err) => {
          console.error('Erreur lors du chargement du profil du vendeur :', err);
        }
  }); 
}
  onCategoryChange(event: any): void {
    this.selectedCategory = event.detail.value;
    console.log('Category changed to:', this.selectedCategory); // Debug log
    this.filterProducts();
  }

  filterProducts(): void {
    console.log('Filtering products for category:', this.selectedCategory); // Debug log
    if (this.selectedCategory === 'tous') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(
        product => product.category === this.selectedCategory
      );
    }
    console.log('Filtered products count:', this.filteredProducts.length); // Debug log
  }

  

  navigateToProductDetail(productId: string): void {
    this.router.navigate(['/product-detail'], { queryParams: { id: productId } });
  }

  toggleLike(product: Product, event: Event): void {
    event.stopPropagation();
    product.isLiked = !product.isLiked;
    product.likes += product.isLiked ? 1 : -1;
  }

  openComments(productId: string, event: Event): void {
    event.stopPropagation();
    // Implement comments functionality
    console.log('Open comments for product:', productId);
  }

  shareProduct(product: Product, event: Event): void {
    event.stopPropagation();
    // Implement share functionality
    console.log('Share product:', product.name);
  }

  getTimeAgo(date: Date): string {
    const d = (date instanceof Date) ? date : new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Il y a moins d\'une heure';
    } else if (diffInHours === 1) {
      return 'Il y a 1 heure';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours} heures`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? 'Il y a 1 jour' : `Il y a ${diffInDays} jours`;
    }
  }

  formatPrice(price: number): string {
    return price.toLocaleString() + ' F CFA';
  }

}
