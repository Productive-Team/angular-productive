import { ClassField } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @Input() size: string;
  @Input() backgroundColor: string;
  @Input() elevated = true;
  @Input() fixed = false;
  @Input() hasSidenav = false;

  textColor: string;
  constructor() {}

  ngOnInit(): void {
    this.navbarSize();
    this.navbarBackground();
    if (this.elevated) {
      this.navElevation();
    }
    if (this.hasSidenav) {
      this.navHasSide();
    }
  }

  getContrastYIQ(hexcolor): string {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    if (isNaN(yiq)) {
      return '#8a8a8a';
    } else {
      return yiq >= 145 ? 'black' : 'white';
    }
  }

  // navFixed(): void {
  //   const navbarElement = document.querySelector('.navbar') as HTMLDivElement;
  //   navbarElement.classList.add('fixed');
  //   const outWrap = document.getElementById('wrap-1');
  //   outWrap.style.height = navbarElement.offsetHeight.toString() + 'px';
  // }

  navElevation(): void {
    const navbarElement = document.querySelector('.navbar') as HTMLDivElement;
    navbarElement.classList.add('elevation');
  }

  navHasSide(): void {
    const navbarElement = document.querySelector('.navbar') as HTMLDivElement;
    if (window.innerWidth > 1000) {
      navbarElement.style.marginLeft = '250px';
    } else {
      navbarElement.style.marginLeft = '0';
    }
  }

  navbarBackground(): void {
    const navbarElement = document.querySelector('.navbar') as HTMLDivElement;
    const buttons = navbarElement.getElementsByTagName('button');
    const hrefTags = navbarElement.getElementsByTagName('a');
    switch (this.backgroundColor) {
      case 'bg-primary':
        navbarElement.classList.add('bg-primary');
        this.backgroundColor = getComputedStyle(document.body)
          .getPropertyValue('--primary')
          .trim();
        break;
      case 'bg-secondary':
        navbarElement.classList.add('bg-secondary');
        this.backgroundColor = getComputedStyle(document.body)
          .getPropertyValue('--secondary')
          .trim();
        break;
      case undefined:
        break;
      default:
        navbarElement.style.backgroundColor = this.backgroundColor;
        break;
    }
    if (this.backgroundColor !== undefined) {
      this.backgroundColor.trim();
      const textColor = this.getContrastYIQ(this.backgroundColor);
      let b = 0;
      for (; b < buttons.length; b++) {
        buttons[b].style.color = textColor;
      }
      let a = 0;
      for (; a < hrefTags.length; a++) {
        hrefTags[a].style.color = textColor;
      }
      navbarElement.style.color = textColor;
    }
  }

  navbarSize(): void {
    const navbarElement = document.querySelector('.navbar') as HTMLDivElement;
    switch (this.size) {
      case 'small':
        navbarElement.style.height = '46px';
        navbarElement.style.lineHeight = '46px';
        navbarElement.classList.add('small');
        break;
      case 'medium':
        navbarElement.style.height = '56px';
        navbarElement.style.lineHeight = '56px';
        navbarElement.classList.add('medium');
        break;
      case 'large':
        navbarElement.style.height = '66px';
        navbarElement.style.lineHeight = '66px';
        navbarElement.classList.add('large');
        break;
      default:
        navbarElement.style.height = '56px';
        navbarElement.style.lineHeight = '56px';
        navbarElement.classList.add('medium');
    }
  }
}
