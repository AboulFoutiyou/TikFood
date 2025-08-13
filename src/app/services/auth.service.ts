import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService, Credentials, LoginResponse } from './api.service';
import { VendorService } from '../vendor/services/vendor.service';
import { VendorProfile } from '../vendor/models/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentVendorSubject = new BehaviorSubject<VendorProfile | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentVendor$ = this.currentVendorSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private vendorService: VendorService
  ) {
    // Vérifier si l'utilisateur est déjà connecté au démarrage
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    if (this.apiService.isAuthenticated()) {
      this.isAuthenticatedSubject.next(true);
      this.loadCurrentVendor();
    }
  }

  private loadCurrentVendor(): void {
    this.apiService.getCurrentVendor().pipe(
      tap(vendor => {
        this.currentVendorSubject.next(vendor);
      }),
      catchError(error => {
        console.error('Erreur lors du chargement du vendeur actuel:', error);
        this.logout();
        return of(null);
      })
    ).subscribe();
  }

  login(credentials: Credentials): Observable<LoginResponse> {
    return this.apiService.login(credentials).pipe(
      tap(response => {
        this.apiService.handleLoginSuccess(response);
        this.isAuthenticatedSubject.next(true);
        this.currentVendorSubject.next(response.vendor);
        this.vendorService.handleLogin();
      }),
      catchError(error => {
        console.error('Erreur de connexion:', error);
        throw error;
      })
    );
  }

  register(vendor: Partial<VendorProfile>): Observable<LoginResponse> {
    return this.apiService.register(vendor).pipe(
      tap(response => {
        this.apiService.handleLoginSuccess(response);
        this.isAuthenticatedSubject.next(true);
        this.currentVendorSubject.next(response.vendor);
        this.vendorService.handleLogin();
      }),
      catchError(error => {
        console.error('Erreur d\'inscription:', error);
        throw error;
      })
    );
  }

  logout(): void {
    this.apiService.logout();
    this.isAuthenticatedSubject.next(false);
    this.currentVendorSubject.next(null);
    this.vendorService.handleLogout();
  }

  isAuthenticated(): boolean {
    return this.apiService.isAuthenticated();
  }

  getCurrentVendor(): VendorProfile | null {
    return this.currentVendorSubject.value;
  }
}