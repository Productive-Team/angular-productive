import { trigger, transition, style, animate } from '@angular/animations';
import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

let isOpen = true;
let hasBack = false;
let pushContent = true;
@Directive({
  selector: '[appSidenavTrigget], [p-sidenav-trigger], [pSidenavTrigger]',
})
export class SidenavTriggerDirective {
  @Input() pSidenavIdForTrigger: string;
  constructor(private el: ElementRef, private comp: SidenavComponent) {
    el.nativeElement.classList.add('sidenav-trigger');
  }

  @HostListener('click', ['$event']) openSidenav() {
    if (!isOpen) {
      this.comp.showNav(this.pSidenavIdForTrigger);
    } else {
      this.comp.hideNav(this.pSidenavIdForTrigger);
    }
  }
}

const animations = trigger('sidenavTransitions', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)', width: 0 }),
    animate('150ms', style({ transform: 'translateX(0)', width: 250 })),
  ]),
  transition(':leave', [
    animate('200ms', style({ transform: 'translateX(-100%)', width: 0 })),
  ]),
]);

@Component({
  selector: 'app-sidenav, p-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  animations: [animations],
})
export class SidenavComponent implements OnInit, AfterViewInit {
  @Input() elevated = true;
  @Input() hidden = false;
  @Input() pushContent = true;
  @Input() backdrop = false;
  @Input() sidenavId: string;
  @Input() backgroundColor: string;

  sidenavOpen = true;

  @HostListener('window:resize', ['$event']) onResize(event) {
    if (this.pushContent) {
      this.setHeight();
    }
    if (window.innerWidth <= 600) {
      pushContent = false;
      hasBack = true;
      this.setNavFixed();
    } else if (window.innerWidth > 600) {
      pushContent = this.pushContent;
      hasBack = this.backdrop;
      if (this.hidden) {
        this.hideNav(this.sidenavId);
      }
      if (this.pushContent) {
        const sidenav = this.el.nativeElement.firstChild as HTMLDivElement;
        sidenav.style.position = 'sticky';
        sidenav.style.zIndex = '996';
      }
    }
    if (isOpen === true && window.innerWidth <= 1000) {
      this.hideNav(this.sidenavId);
      const backdrop = document.querySelector('.backdrop') as HTMLElement;
      if (backdrop) {
        this.removeBackdrop(backdrop);
      }
    } else {
      if (!this.hidden && window.innerWidth > 1000) {
        this.showNav(this.sidenavId);
      }
    }
  }

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (this.hidden) {
      this.sidenavOpen = false;
    }
  }

  ngAfterViewInit(): void {
    // if (!this.pushContent || window.innerWidth <= 600) {
    //   this.hidden = true;
    //   this.backdrop = true;
    //   this.elevated = true;
    //   this.pushContent = false;
    //   this.setNavFixed();
    // } else {
    //   this.setHeight();
    // }
    // if (this.hidden) {
    //   this.hideNav(this.sidenavId);
    // }
    // this.backgroundColorApply();
    // pushContent = this.pushContent;
    // hasBack = this.backdrop;
  }

  private setHeight(): void {
    const height = window.innerHeight;
    const nav = document.querySelector('nav') as HTMLDivElement;
    const boundRectNav = nav.getBoundingClientRect();
    const finalHeight = Math.abs(height - boundRectNav.height) + 'px';
    const sideWrap = document.querySelector('.sidenav-wrap') as HTMLDivElement;
    sideWrap.style.height = finalHeight;
  }

  private elevateSidenav(): void {
    const sidenavElement = document.querySelector('.sidenav');
    sidenavElement.classList.add('elevation');
  }

  hideNav(id: string): void {
    isOpen = false;
    const sidenavElement = document.getElementById(id);
    sidenavElement.style.transform = 'translateX(-150%)';
    sidenavElement.style.width = '0';
    if (hasBack) {
      const backdrop = document.querySelector('.backdrop') as HTMLElement;
      if (pushContent) {
        const body = document.querySelector(
          '.content-contain'
        ) as HTMLDivElement;
        body.style.overflow = 'auto';
      }
      this.removeBackdrop(backdrop);
    }
  }

  showNav(id: string): void {
    isOpen = true;
    const sidenavElement = document.getElementById(id);
    sidenavElement.style.transform = 'translateX(0)';
    sidenavElement.style.width = '250px';
    if (hasBack) {
      if (pushContent) {
        const body = document.querySelector(
          '.content-contain'
        ) as HTMLDivElement;
        body.style.overflow = 'hidden';
      }
      this.setBackdrop(id);
    }
  }

  private setNavFixed(): void {
    const sidenav = this.el.nativeElement.firstChild as HTMLDivElement;
    sidenav.style.position = 'fixed';
    sidenav.style.height = '100vh';
    sidenav.style.zIndex = '1000';
  }

  private setBackdrop(id: string): void {
    const body = document.querySelector('body');
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    if (!pushContent) {
      backdrop.style.zIndex = '999';
    }
    body.insertAdjacentElement('beforeend', backdrop);
    setTimeout(() => {
      backdrop.style.opacity = '0.5';
      backdrop.addEventListener('click', () => {
        this.hideNav(id);
        this.removeBackdrop(backdrop);
      });
    }, 10);
  }

  private removeBackdrop(backdrop: HTMLElement): void {
    if (backdrop !== null) {
      backdrop.style.opacity = '0';
      backdrop.addEventListener('transitionend', () => {
        backdrop.remove();
      });
    }
  }

  private backgroundColorApply(): void {
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

  private getContrastYIQ(hexcolor): string {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 145 ? '#262626' : 'white';
  }

  toggle(): void {
    this.sidenavOpen = !this.sidenavOpen;
  }
}
