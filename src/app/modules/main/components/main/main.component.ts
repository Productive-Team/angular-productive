import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/shared/services/dark-mode.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {
  constructor(private darkModeService: DarkModeService) {}

  darkActive = localStorage.getItem('dark_active');

  toggleDarkMode(): void {
    this.darkModeService.darkModeToggle();
    this.darkActive = localStorage.getItem('dark_active');
  }
}
