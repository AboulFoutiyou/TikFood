import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkMode.asObservable();

  constructor() {
    // Vérifier si l'utilisateur a déjà une préférence sauvegardée
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      this.setDarkMode(JSON.parse(savedTheme));
    }
  }

  setDarkMode(isDark: boolean): void {
    this.isDarkMode.next(isDark);
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    
    // Appliquer le thème au document
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  toggleDarkMode(): void {
    this.setDarkMode(!this.isDarkMode.value);
  }

  getCurrentTheme(): boolean {
    return this.isDarkMode.value;
  }
}