import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { VendorProduct, Order, VendorProfile, Analytics, ClientProfile } from '../vendor/models/vendor.model';

export interface LoginResponse {
  token: string;
  vendor: VendorProfile;
  client?: ClientProfile;
}

export interface Credentials {
  email?: string;
  phone?: string;
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

  public getStoredTUser(): any {
    const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
  }

  public setToken(token: string): void {
    localStorage.setItem('vendor_token', token);
    this.tokenSubject.next(token);
  }

  public setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
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

  // ========================= CLIENT =========================

  // Inscription client
  registerClient(client: Partial<ClientProfile>): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/clients/register`, client);
  }

  // Connexion client
  loginClient(credentials: Credentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/clients/login`, credentials);
  }

  // Passer une commande client
  placeClientOrder(clientId: string, order: Order): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clients/${clientId}/orders`, order);
  }

  // Lister les commandes du client
  getClientOrders(clientId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/clients/${clientId}/orders`, this.getHeaders());
  }

  // Supprimer le compte client
  deleteClientAccount(clientId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/clients/${clientId}/delete`, this.getHeaders());
  }

  // Mettre à jour le profil client
  updateClientProfile(clientId: string, updates: Partial<ClientProfile>): Observable<ClientProfile> {
    return this.http.post<ClientProfile>(`${this.apiUrl}/clients/${clientId}/update`, updates, this.getHeaders());
  }

  // Changer le mot de passe client
  changeClientPassword(clientId: string, oldPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/clients/${clientId}/change-password`, { oldPassword: oldPassword, newPassword: newPassword }, this.getHeaders());
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
    localStorage.removeItem('user');
  }

  getCurrentVendor(): Observable<VendorProfile> {
    return this.http.get<VendorProfile>(`${this.apiUrl}/vendors/me`, this.getHeaders());
  }

  getCurrentClient(): Observable<ClientProfile> {
    return this.http.get<ClientProfile>(`${this.apiUrl}/clients/me`, this.getHeaders());
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

  deleteVendorAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vendors/${id}`, this.getHeaders());
  }

  changeVendorPassword(id: string, oldPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/vendors/${id}/change-password`, { oldPassword: oldPassword, newPassword: newPassword }, this.getHeaders());
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

  getProductById(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/products/${id}`);
}

  // ==================== COMMANDES ====================
  
  createOrder(order: Omit<Order, 'id' | 'productName' | 'createdAt' | 'updatedAt' | 'vendorId'>): Observable<Order> {
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