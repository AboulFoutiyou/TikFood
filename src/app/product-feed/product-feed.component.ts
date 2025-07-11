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
  products: Product[] = [
    {
      id: '1',
      name: 'Fataya au poisson',
      restaurant: 'Chez Fatou',
      price: 500,
      images: ['https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg'],
      category: 'salé',
      description: 'Délicieux beignet farci au poisson, épices et légumes. Croustillant à l\'extérieur, moelleux à l\'intérieur.',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      location: 'Dakar, Sénégal',
      likes: 24,
      comments: 8,
      isLiked: false
    },
    {
      id: '2',
      name: 'Thiakry aux fruits',
      restaurant: 'Délices de Coumba',
      price: 1500,
      images: ['https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'],
      category: 'sucré',
      description: 'Dessert traditionnel sénégalais à base de couscous, lait caillé et fruits frais.',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      location: 'Saint-Louis, Sénégal',
      likes: 45,
      comments: 12,
      isLiked: true
    },
    {
      id: '3',
      name: 'Jus de bissap',
      restaurant: 'Boissons Aminata',
      price: 750,
      images: ['https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg'],
      category: 'jus',
      description: 'Boisson rafraîchissante à base d\'hibiscus, gingembre et menthe. Parfait pour se désaltérer.',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      location: 'Thiès, Sénégal',
      likes: 18,
      comments: 5,
      isLiked: false
    },
    {
      id: '4',
      name: 'Nems aux crevettes',
      restaurant: 'Saveurs d\'Asie Dakar',
      price: 1200,
      images: ['https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg'],
      category: 'salé',
      description: 'Rouleaux de printemps croustillants farcis aux crevettes et légumes frais.',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      location: 'Kaolack, Sénégal',
      likes: 32,
      comments: 7,
      isLiked: true
    },
    {
      id: '5',
      name: 'Mini tacos poulet',
      restaurant: 'Fast Food Modou',
      price: 2000,
      images: ['https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg'],
      category: 'salé',
      description: 'Petits tacos garnis de poulet grillé, salade, tomates et sauce épicée.',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      location: 'Ziguinchor, Sénégal',
      likes: 67,
      comments: 15,
      isLiked: false
    },
    {
      id: '6',
      name: 'Thiéboudienne',
      restaurant: 'Restaurant Teranga',
      price: 3500,
      images: ['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'],
      category: 'mixte',
      description: 'Plat national sénégalais : riz au poisson avec légumes et sauce tomate.',
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      location: 'Rufisque, Sénégal',
      likes: 89,
      comments: 23,
      isLiked: true
    }
  ];

  filteredProducts: Product[] = [];

  constructor(private router: Router) { 
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

  ngOnInit() : void {
    this.filterProducts();
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
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
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
