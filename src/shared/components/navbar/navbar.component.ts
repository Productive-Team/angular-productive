import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @Input() Size: string;
  @Input() backgroundColor: string;
  constructor() {}

  ngOnInit(): void {
    const navbarElement = document.querySelector('.navbar') as HTMLDivElement;
    switch (this.Size) {
      case 'small':
        navbarElement.style.height = '36px';
        break;
      case 'medium':
        navbarElement.style.height = '46px';
        break;
      case 'large':
        navbarElement.style.height = '56px';
        break;
      default:
        navbarElement.style.height = '46px';
    }
  }
}

export class SizeEnum {
  small = 1;
  medium = 2;
  big = 3;
}
