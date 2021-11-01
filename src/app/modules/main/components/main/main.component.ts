import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/shared/services/dark-mode.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {
  constructor(public darkModeService: DarkModeService) {}
  transitionState: boolean;
  transitionStateInverse: boolean;
  toggleDarkMode(): void {
    if (this.darkModeService.darkModeEnabled) {
      this.transitionStateInverse = true;
    }
    if (!this.darkModeService.darkModeEnabled) {
      this.transitionState = true;
    }
    this.darkModeService.darkModeToggle();
    setTimeout(() => {
      this.transitionStateInverse = false;
      this.transitionState = false;
    }, 500);
  }
}
