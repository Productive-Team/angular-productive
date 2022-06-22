import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  darkModeEnabled: boolean;

  constructor() {
    this.detectDarkMode();
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (change) => {
        localStorage.removeItem('dark_active');
        this.detectDarkMode();
      });
  }

  detectDarkMode(): void {
    const token = localStorage.getItem('dark_active');
    if (!token) {
      if (window?.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.darkModeEnabled = true;
        localStorage.setItem('dark_active', this.darkModeEnabled.toString());
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        this.darkModeEnabled = false;
        localStorage.setItem('dark_active', this.darkModeEnabled.toString());
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    } else {
      if (token === 'true') {
        this.darkModeEnabled = true;
        localStorage.setItem('dark_active', this.darkModeEnabled.toString());
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        this.darkModeEnabled = false;
        localStorage.setItem('dark_active', this.darkModeEnabled.toString());
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    }
  }

  darkModeToggle(): void {
    this.darkModeEnabled = !this.darkModeEnabled;
    localStorage.setItem('dark_active', this.darkModeEnabled.toString());
    this.darkModeSet();
  }

  darkModeSet(): void {
    const documentClasses = document.documentElement.classList;
    if (documentClasses.contains('dark')) {
      documentClasses.remove('dark');
      documentClasses.add('light');
    } else if (!documentClasses.contains('dark')) {
      documentClasses.add('dark');
      documentClasses.remove('light');
    } else {
    }
  }
}
