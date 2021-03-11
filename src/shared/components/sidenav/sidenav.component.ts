import {
  Component,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[p-sidenav-trigger]',
})
export class SidenavTriggerDirective {
  isOpen = false;

  constructor(private el: ElementRef) {
    el.nativeElement.classList.add('sidenav-trigger');
  }

  @HostListener('click', ['$event']) openSidenav() {
    const sidenavElement = document.querySelector('.sidenav') as HTMLDivElement;
    const body = document.querySelector('body');
    if (!this.isOpen) {
      body.style.overflowY = 'hidden';
      sidenavElement.style.transform = 'translateX(0)';
      const backdrop = document.createElement('div');
      backdrop.classList.add('backdrop');
      body.insertAdjacentElement('beforeend', backdrop);
      setTimeout(() => {
        backdrop.style.opacity = '0.5';
      }, 0);
      this.isOpen = true;
      backdrop.addEventListener('click', () => {
        backdrop.style.opacity = '0';
        backdrop.addEventListener('transitionend', () => {
          backdrop.remove();
        });
        sidenavElement.style.transform = 'translateX(-150%)';
        body.style.overflowY = 'visible';
        this.isOpen = false;
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
      this.hideButton();
    }
    if (this.elevated) {
      this.elevateSidenav();
    }
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
}
