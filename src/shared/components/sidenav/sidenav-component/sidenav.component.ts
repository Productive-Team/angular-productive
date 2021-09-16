import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-sidenav, p-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  @Input() elevated: boolean;
  @Input() hidden = false;
  @Input() pushContent = true;
  @Input() backdrop = false;

  sidenavOpen = false;

  initialPushValue: boolean;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.initialPushValue = this.pushContent;
    if (this.hidden || !this.pushContent) {
      this.sidenavOpen = false;
    } else {
      this.sidenavOpen = true;
    }
    this.checkWindowSize();
    window.addEventListener('resize', (e) => {
      this.checkWindowSize();
    });
  }

  checkWindowSize(): any {
    if (window.innerWidth < 1000) {
      this.sidenavOpen = false;
    } else if (window.innerWidth >= 1000) {
      if (this.pushContent && !this.hidden) {
        this.sidenavOpen = true;
      }
    }
    if (this.initialPushValue) {
      if (window.innerWidth < 600) {
        this.pushContent = false;
        this.backdrop = true;
      } else {
        this.pushContent = true;
        this.backdrop = false;
      }
    }
  }

  toggle(): void {
    this.sidenavOpen = !this.sidenavOpen;
    if (this.backdrop && this.sidenavOpen && !this.pushContent) {
      this.setBackDrop();
    }
  }

  setBackDrop(): void {
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    document.body.insertAdjacentElement('beforeend', backdrop);
    setTimeout(() => {
      backdrop.style.zIndex = '998';
      backdrop.style.opacity = '0.4';
      backdrop.addEventListener('click', (x) => {
        backdrop.style.opacity = '0';
        this.sidenavOpen = false;
        setTimeout(() => {
          backdrop.remove();
        }, 250);
      });
    }, 0);
  }

  @HostBinding('class.closed')
  get openClosedValue() {
    return !this.sidenavOpen;
  }

  @HostBinding('class.elevation-p8')
  get elevationValue() {
    return this.elevated;
  }

  @HostBinding('class.floating')
  get floatingSidenav() {
    return !this.pushContent;
  }
}
