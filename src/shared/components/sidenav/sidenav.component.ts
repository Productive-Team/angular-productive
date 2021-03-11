import {
  Component,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

let isOpen = false;
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[p-sidenav-trigger]',
})
export class SidenavTriggerDirective {
  constructor(private el: ElementRef) {
    el.nativeElement.classList.add('sidenav-trigger');
    el.nativeElement.parentElement.parentElement.classList.add(
      'sidenav-trigger-parent'
    );
  }

  @HostListener('click', ['$event']) openSidenav() {
    const sidenavElement = document.querySelector('.sidenav') as HTMLDivElement;
    const body = document.querySelector('body');
    if (!isOpen) {
      body.style.overflowY = 'hidden';
      sidenavElement.style.transform = 'translateX(0)';
      const backdrop = document.createElement('div');
      backdrop.classList.add('backdrop');
      body.insertAdjacentElement('beforeend', backdrop);
      setTimeout(() => {
        backdrop.style.opacity = '0.5';
      }, 0);
      isOpen = true;
      backdrop.addEventListener('click', () => {
        backdrop.style.opacity = '0';
        backdrop.addEventListener('transitionend', () => {
          backdrop.remove();
        });
        sidenavElement.style.transform = 'translateX(-150%)';
        body.style.overflowY = 'visible';
        isOpen = false;
      });
    }
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'p-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  @Input() elevated = false;
  @Input() hidden = false;
  @Input() backgroundColor: string;

  @HostListener('window:resize', ['$event']) onResize(event) {
    if (!this.hidden) {
      if (event.srcElement.innerWidth > 1000) {
        const backdrop = document.querySelector('.backdrop') as HTMLDivElement;
        if (backdrop !== null) {
          backdrop.style.opacity = '0';
          backdrop.addEventListener('transitionend', () => {
            backdrop.remove();
            isOpen = false;
          });
        }
        this.hideButton();
        this.showNav();
      } else {
        this.showButton();
        this.hideNav();
      }
    }
  }

  constructor() {}

  ngOnInit(): void {
    if (this.hidden) {
      this.showButton();
      this.hideNav();
    } else {
      if (window.innerWidth > 1000) {
        this.hideButton();
      } else {
        this.showButton();
      }
    }
    if (this.elevated) {
      this.elevateSidenav();
    }
    this.backgroundColorApply();
  }

  elevateSidenav(): void {
    const sidenavElement = document.querySelector('.sidenav');
    sidenavElement.classList.add('elevation');
  }

  hideNav(): void {
    const sidenavElement = document.querySelector('.sidenav') as HTMLDivElement;
    sidenavElement.style.transform = 'translateX(-150%)';
  }

  showNav(): void {
    const sidenavElement = document.querySelector('.sidenav') as HTMLDivElement;
    sidenavElement.style.transform = 'translateX(0)';
  }

  hideButton(): void {
    const sideTrig = document.querySelector(
      '.sidenav-trigger'
    ) as HTMLButtonElement;
    sideTrig.style.display = 'none';
  }

  showButton(): void {
    const sideTrig = document.querySelector(
      '.sidenav-trigger'
    ) as HTMLButtonElement;
    sideTrig.style.display = 'block';
  }

  backgroundColorApply(): void {
    const sidenavElement = document.querySelector('.sidenav') as HTMLDivElement;
    const buttons = sidenavElement.getElementsByTagName('button');
    const hrefTags = sidenavElement.getElementsByTagName('a');
    switch (this.backgroundColor) {
      case 'bg-primary':
        sidenavElement.classList.add('bg-primary');
        this.backgroundColor = getComputedStyle(document.body).getPropertyValue(
          '--primary'
        );
        break;
      case 'bg-secondary':
        sidenavElement.classList.add('bg-secondary');
        this.backgroundColor = getComputedStyle(document.body).getPropertyValue(
          '--secondary'
        );
        break;
      case undefined:
        break;
      default:
        sidenavElement.style.backgroundColor = this.backgroundColor;
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
      sidenavElement.style.color = textColor;
    }
  }

  getContrastYIQ(hexcolor): string {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 145 ? '#262626' : 'white';
  }
}
