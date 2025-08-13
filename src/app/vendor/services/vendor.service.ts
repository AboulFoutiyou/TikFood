import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { VendorProduct, Order, VendorProfile, Analytics } from '../models/vendor.model';
import { ApiService } from '../../services/api.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private vendorProfile = new BehaviorSubject<VendorProfile | null>(null);
  private products = new BehaviorSubject<VendorProduct[]>([]);
  private orders = new BehaviorSubject<Order[]>([]);


  public vendorProfile$ = this.vendorProfile.asObservable();
  public products$ = this.products.asObservable();
  public orders$ = this.orders.asObservable();

  constructor(private apiService: ApiService) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    if (this.apiService.isAuthenticated()) {
      this.loadVendorProfile();
      this.loadProducts();
      this.loadOrders();
    }
  }

  private loadVendorProfile(): void {
    this.apiService.getCurrentVendor().pipe(
      catchError(error => {
        console.error('Erreur lors du chargement du profil:', error);
        return of(null);
      })
    ).subscribe(profile => {
      if (profile) {
        this.vendorProfile.next(profile);
      }
    });
  }

  private loadProducts(): void {
    this.apiService.getMyProducts().pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des produits:', error);
        return of([]);
      })
    ).subscribe(products => {
      this.products.next(products);
    });
  }

  private loadOrders(): void {
    this.apiService.getMyOrders().pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des commandes:', error);
        return of([]);
      })
    ).subscribe(orders => {
      this.orders.next(orders);
    });
  }
  // Vendor Profile Methods
  updateVendorProfile(profile: Partial<VendorProfile>): void {
    const current = this.vendorProfile.value;
    if (current) {
      this.apiService.updateVendorProfile(Number(current.id), profile).pipe(
        tap(() => {
          this.vendorProfile.next({ ...current, ...profile });
        }),
        catchError(error => {
          console.error('Erreur lors de la mise à jour du profil:', error);
          return of(null);
        })
      ).subscribe();
    }
  }

  toggleAvailability(): void {
    const current = this.vendorProfile.value;
    if (current) {
      this.apiService.toggleVendorAvailability(Number(current.id)).pipe(
        tap(() => {
          this.vendorProfile.next({ ...current, isAvailable: !current.isAvailable });
        }),
        catchError(error => {
          console.error('Erreur lors du toggle de disponibilité:', error);
          return of(null);
        })
      ).subscribe();
    }
  }

  // Product Methods
  addProduct(product: Omit<VendorProduct, 'id' | 'createdAt' | 'updatedAt'>): void {
    
    this.apiService.createProduct(product).pipe(
      tap(newProduct => {
        const current = this.products.value;
        this.products.next([...current, newProduct]);
      }),
      catchError(error => {
        console.error('Erreur lors de la création du produit:', error);
        return of(null);
      })
    ).subscribe();
  }

  addProductWithFile(formData: FormData): Observable<any> { // Renvoie un Observable pour que le component puisse s'y abonner
    console.log('Envoi du produit avec fichier:', formData);
    return this.apiService.createProductWithFile(formData).pipe(
      tap((newProduct: VendorProduct) => {
        // Si la création réussit, on met à jour la liste des produits
        const currentProducts = this.products.value;
        this.products.next([...currentProducts, newProduct]);
      }),
      catchError(error => {
        // Gère les erreurs venant de l'ApiService
        console.error('Erreur attrapée dans VendorService :', error);
        return throwError(() => new Error('La création du produit via le service a échoué.'));
      })
    );
  }

  updateProduct(id: string, updates: Partial<VendorProduct>): void {
    this.apiService.updateProduct(id, updates).pipe(
      tap(() => {
        const current = this.products.value;
        const updated = current.map(product => 
          product.id === id 
            ? { ...product, ...updates, updatedAt: new Date() }
            : product
        );
        this.products.next(updated);
      }),
      catchError(error => {
        console.error('Erreur lors de la mise à jour du produit:', error);
        return of(null);
      })
    ).subscribe();
  }

  deleteProduct(id: string): void {
    this.apiService.deleteProduct(id).pipe(
      tap(() => {
        const current = this.products.value;
        this.products.next(current.filter(product => product.id !== id));
      }),
      catchError(error => {
        console.error('Erreur lors de la suppression du produit:', error);
        return of(null);
      })
    ).subscribe();
  }

  toggleProductAvailability(id: string): void {
    this.apiService.toggleProductAvailability(id).pipe(
      tap(() => {
        const current = this.products.value;
        const updated = current.map(product => 
          product.id === id 
            ? { ...product, isAvailable: !product.isAvailable, updatedAt: new Date() }
            : product
        );
        this.products.next(updated);
      }),
      catchError(error => {
        console.error('Erreur lors du toggle de disponibilité du produit:', error);
        return of(null);
      })
    ).subscribe();
  }

  // Order Methods
  updateOrderStatus(orderId: string, status: Order['status']): void {
    this.apiService.updateOrderStatus(orderId, status).pipe(
      tap(() => {
        const current = this.orders.value;
        const updated = current.map(order => 
          order.id === orderId ? { ...order, status } : order
        );
        this.orders.next(updated);
      }),
      catchError(error => {
        console.error('Erreur lors de la mise à jour du statut de commande:', error);
        return of(null);
      })
    ).subscribe();
  }

  // Analytics Methods
  getAnalytics(): Observable<Analytics> {
    return this.apiService.getAnalytics().pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des analytics:', error);
        // Retourner des données par défaut en cas d'erreur
        return of({
          totalOrders: 0,
          totalRevenue: 0,
          todayOrders: 0,
          todayRevenue: 0,
          weeklyOrders: [0, 0, 0, 0, 0, 0, 0],
          weeklyRevenue: [0, 0, 0, 0, 0, 0, 0],
          topProducts: [],
          ordersByStatus: []
        });
      })
    );
  }

  // Méthode pour rafraîchir toutes les données
  refreshData(): void {
    this.loadVendorProfile();
    this.loadProducts();
    this.loadOrders();
  }

  // Méthode pour gérer la connexion
  handleLogin(): void {
    this.loadInitialData();
  }

  // Méthode pour gérer la déconnexion
  handleLogout(): void {
    this.vendorProfile.next(null);
    this.products.next([]);
    this.orders.next([]);
  }
}