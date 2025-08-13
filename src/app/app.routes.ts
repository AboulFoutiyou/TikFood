import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'welcome',
    loadComponent: () => import('./welcome/welcome.component').then((m) => m.WelcomeComponent),
  },
  {
    path: 'home/client',
    loadComponent: () => import('./client-home/client-home.component').then((m) => m.ClientHomeComponent),
  },
  {
    path: 'food/details',
    loadComponent: () => import('./food-details/food-details.component').then((m) => m.FoodDetailsComponent),
  },
  {
    path: 'feed',
    loadComponent: () => import('./product-feed/product-feed.component').then((m) => m.ProductFeedComponent),
  },
  {
    path: 'vendor-dashboard',
    loadComponent: () => import('./vendor/vendor-dashboard/vendor-dashboard.component').then(m => m.VendorDashboardComponent)
  },
  {
    path: 'vendor-products',
    loadComponent: () => import('./vendor/vendor-products/vendor-products.component').then(m => m.VendorProductsComponent)
  },
  {
    path: 'vendor-orders',
    loadComponent: () => import('./vendor/vendor-orders/vendor-orders.component').then(m => m.VendorOrdersComponent)
  },
  {
    path: 'vendor-analytics',
    loadComponent: () => import('./vendor/vendor-analytics/vendor-analytics.component').then(m => m.VendorAnalyticsComponent)
  }
];
