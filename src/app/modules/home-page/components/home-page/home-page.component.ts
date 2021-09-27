import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  infoData: MainPageItems[] = [
    {
      header: 'Custom Components',
      description:
        'Completely functional, custom Angular components, designed to be easily reusable throughout the application.',
    },
    {
      header: 'Customizable',
      description:
        'All components featured in Productive are fully open, and allows a high range of customization.',
    },
    {
      header: 'Custom Components',
      description:
        'Completely functional, custom Angular components, designed to be reusable, and speedup development on apps.',
    },
  ];

  constructor() {}
}

export class MainPageItems {
  header: string;
  description: string;
}
