import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { VendorProduct, Order, VendorProfile, Analytics } from '../vendor/models/vendor.model';

export interface LoginResponse {
  token: string;
  vendor: VendorProfile;
}

export interface Credentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private tokenSubject = new BehaviorSubject<string | null>(this.getStoredToken());
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getStoredToken(): string | null {
    return localStorage.getItem('vendor_token');
  }

  public setToken(token: string): void {
    localStorage.setItem('vendor_token', token);
    this.tokenSubject.next(token);
  }

  private removeToken(): void {
    localStorage.removeItem('vendor_token');
    this.tokenSubject.next(null);
  }

  private getHeaders(): { headers: HttpHeaders } {
    const token = this.getStoredToken();
    return {
      headers: new HttpHeaders({
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      })
    };
  }

  private getPHeaders(): { headers: HttpHeaders } {
    const token = this.getStoredToken();
    return {
      headers: new HttpHeaders({
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  private getJsonHeaders(): HttpHeaders {
    let headers = this.getAuthHeaders();
    if (headers.has('Authorization')) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return headers;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // ou votre méthode de stockage de token
    if (!token) {
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // ==================== AUTHENTIFICATION ====================
  
  register(vendor: Partial<VendorProfile>): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/vendors/register`, vendor);
  }

  login(credentials: Credentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/vendors/login`, credentials);
  }

  logout(): void {
    this.removeToken();
  }

  getCurrentVendor(): Observable<VendorProfile> {
    return this.http.get<VendorProfile>(`${this.apiUrl}/vendors/me`, this.getHeaders());
  }

  updateVendorProfile(id: string, updates: Partial<VendorProfile>): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/vendors/${id}`, updates, this.getHeaders());
  }

  toggleVendorAvailability(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/vendors/${id}/availability`, {}, this.getHeaders());
  }

  getVendorProfile(id: string): Observable<VendorProfile> {
    return this.http.get<VendorProfile>(`${this.apiUrl}/vendors/${id}`, this.getHeaders());
  }

  // ==================== PRODUITS ====================
  
  getProductsFeed(): Observable<VendorProduct[]> {
    return this.http.get<VendorProduct[]>(`${this.apiUrl}/products/feed`);
  }

  getMyProducts(): Observable<VendorProduct[]> {
    return this.http.get<VendorProduct[]>(`${this.apiUrl}/products/my-products`, this.getHeaders());
  }

  createProduct(product: Omit<VendorProduct, 'id' | 'createdAt' | 'updatedAt'>): Observable<VendorProduct> {
    return this.http.post<VendorProduct>(`${this.apiUrl}/products`, product, this.getHeaders());
  }

  createProductWithFile(formData: FormData): Observable<VendorProduct> {
    // ATTENTION : On n'ajoute PAS manuellement l'en-tête 'Content-Type'.
    // Quand HttpClient voit un FormData, il le fait automatiquement de la bonne manière
    // (multipart/form-data avec un 'boundary' unique).
    // Si vous forcez 'Content-Type: application/json', l'upload échouera.
    
    // On doit juste passer les en-têtes d'authentification (token JWT) s'il y en a.
    //const authHeaders = this.getHeaders(false); // Supposons que cette méthode retourne les headers d'authentification
    
    return this.http.post<VendorProduct>(`${this.apiUrl}/products`, formData, this.getPHeaders());
  }

  updateProduct(id: string, updates: Partial<VendorProduct>): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/products/${id}`, updates, this.getHeaders());
  }

  toggleProductAvailability(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/products/${id}/availability`, {}, this.getHeaders());
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`, this.getHeaders());
  }

  // ==================== COMMANDES ====================
  
  createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'vendorId'>): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, order);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/my-orders`, this.getHeaders());
  }

  updateOrderStatus(id: string, status: Order['status']): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/orders/${id}/status`, { status }, this.getHeaders());
  }

  // ==================== ANALYTICS ====================
  
  getAnalytics(): Observable<Analytics> {
    return this.http.get<Analytics>(`${this.apiUrl}/orders/analytics`, this.getHeaders());
  }

  // ==================== HELPER METHODS ====================
  
  handleLoginSuccess(response: LoginResponse): void {
    this.setToken(response.token);
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}