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
@Directive({
  selector: '[appSidenavTrigget], [p-sidenav-trigger], [pSidenavTrigger]',
})
export class SidenavTriggerDirective {
  constructor(private el: ElementRef, private comp: SidenavComponent) {
    el.nativeElement.classList.add('sidenav-trigger');
  }

  @HostListener('click', ['$event']) openSidenav() {
    if (!isOpen) {
      this.comp.showNav();
    } else {
      this.comp.hideNav();
    }
    // const sidenavElement = document.querySelector(
    //   '.sidenav-wrap'
    // ) as HTMLDivElement;
    // const body = document.querySelector('body');
    // if (!isOpen) {
    //   sidenavElement.style.transform = 'translateX(0)';
    //   sidenavElement.style.width = '250px';
    //   const backdrop = document.createElement('div');
    //   backdrop.classList.add('backdrop');
    //   body.insertAdjacentElement('beforeend', backdrop);
    //   setTimeout(() => {
    //     backdrop.style.opacity = '0.5';
    //   }, 0);
    //   isOpen = true;
    //   backdrop.addEventListener('click', () => {
    //     backdrop.style.opacity = '0';
    //     backdrop.addEventListener('transitionend', () => {
    //       backdrop.remove();
    //     });
    //     sidenavElement.style.transform = 'translateX(-150%)';
    //     sidenavElement.style.width = '0';
    //     isOpen = false;
    //   });
    // }
  }
}

@Component({
  selector: 'app-sidenav, p-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit, AfterViewInit {
  @Input() elevated = true;
  @Input() hidden = false;
  @Input() pushContentOnShow = true;
  @Input() backdrop = false;
  @Input() backgroundColor: string;

  @HostListener('window:resize', ['$event']) onResize(event) {
    this.setHeight();
  }

  constructor() {}

  ngOnInit(): void {
    // if (this.hidden) {
    //   this.showButton();
    //   this.hideNav();
    // } else {
    //   if (window.innerWidth > 1000) {
    //     this.hideButton();
    //   } else {
    //     this.showButton();
    //   }
    // }
    hasBack = this.backdrop;
  }

  ngAfterViewInit(): void {
    if (this.hidden) {
      this.hideNav();
    }
    if (this.elevated) {
      this.elevateSidenav();
    }
    this.backgroundColorApply();
    this.setHeight();
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

  hideNav(): void {
    isOpen = false;
    const sidenavElement = document.querySelector(
      '.sidenav-wrap'
    ) as HTMLDivElement;
    sidenavElement.style.transform = 'translateX(-150%)';
    sidenavElement.style.width = '0';
    if (hasBack) {
      const backdrop = document.querySelector('.backdrop') as HTMLElement;
      this.removeBackdrop(backdrop);
    }
  }

  showNav(): void {
    isOpen = true;
    const sidenavElement = document.querySelector(
      '.sidenav-wrap'
    ) as HTMLDivElement;
    sidenavElement.style.transform = 'translateX(0)';
    sidenavElement.style.width = '250px';
    if (hasBack) {
      this.setBackdrop();
    }
  }

  private setBackdrop(): void {
    const body = document.querySelector('body');
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    body.insertAdjacentElement('beforeend', backdrop);
    setTimeout(() => {
      backdrop.style.opacity = '0.5';
      backdrop.addEventListener('click', () => {
        this.hideNav();
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
