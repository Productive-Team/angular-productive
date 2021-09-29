import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  darkModeEnabled: boolean;

  constructor() {
    const token = localStorage.getItem('dark_active');
    this.darkModeEnabled = token === 'true';

    if (token === 'true') {
      this.setDarkModeColors();
    } else {
      this.setLightModeColors();
    }
  }

  darkModeToggle(): void {
    this.darkModeEnabled = !this.darkModeEnabled;
    localStorage.setItem('dark_active', this.darkModeEnabled.toString());
    const token = localStorage.getItem('dark_active');

    if (token === 'true') {
      this.setDarkModeColors();
    } else {
      this.setLightModeColors();
    }
  }

  setDarkModeColors(): void {
    const r = document.querySelector(':root') as HTMLElement;
    r.style.setProperty('--appBackgroundColor', '#303030');
    r.style.setProperty('--textColor', 'rgb(250,250,250)');
    r.style.setProperty('--primary', '#e91e63');
    r.style.setProperty('--secondary', '#90a4ae');
    r.style.setProperty('--fieldsetColor', 'hsla(0,0%,100%,0.15)');
    r.style.setProperty('--menuPanelColor', '#424242');
    r.style.setProperty('--rippleDefaultColor', '#ffffff26');
    r.style.setProperty('--primaryLowOpacity', '#e91e6326');
    r.style.setProperty('--secondaryLowOpacity', '#46575426');
    r.style.setProperty('--snackbarDefaultColor', 'rgb(255,255,255)');
    r.style.setProperty('--snackbarTextColor', '#262626');
    r.style.setProperty('--backdropColor', 'rgba(117, 114, 114,1)');
    r.style.setProperty('color-scheme', 'dark');
  }

  setLightModeColors(): void {
    const r = document.querySelector(':root') as HTMLElement;
    r.style.setProperty('--appBackgroundColor', 'white');
    r.style.setProperty('--textColor', '#262626');
    r.style.setProperty('--primary', '#3f51b5');
    r.style.setProperty('--secondary', '#e91e63');
    r.style.setProperty('--fieldsetColor', 'hsla(0,0%,94%,1)');
    r.style.setProperty('--menuPanelColor', 'rgb(250, 250, 250)');
    r.style.setProperty('--rippleDefaultColor', 'rgba(0,0,0,0.13)');
    r.style.setProperty('--primaryLowOpacity', '#3f51b526');
    r.style.setProperty('--secondaryLowOpacity', '#e91e6326');
    r.style.setProperty('--snackbarDefaultColor', 'rgb(24,24,24)');
    r.style.setProperty('--snackbarTextColor', 'white');
    r.style.setProperty('color-scheme', 'light');
  }
}
