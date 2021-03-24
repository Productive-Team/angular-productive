import {
  AfterViewInit,
  Component,
  Directive,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

let isOpen = false;

@Directive({
  selector: '[app-dropdown-trigger], [p-dropdown-trigger], [pDropdownTrigger]',
})
export class DropdownTriggerDirective {
  @Input() pDropdownTriggerId: string;

  @HostListener('click', ['$event']) openMenu(event) {
    const menu = document.getElementById(this.pDropdownTriggerId);
    this.dropAlign(menu, event);
    const tgt = event.target as HTMLButtonElement;
    if (event.clientY > window.innerHeight / 2) {
      menu.style.top = tgt.offsetTop - 130 + 'px';
    } else {
      menu.style.top = tgt.offsetTop + 'px';
    }
    if (event.clientX > window.innerWidth / 2) {
      menu.style.left = tgt.offsetLeft - 130 + 'px';
    } else {
      menu.style.left = tgt.offsetLeft + 'px';
    }
    menu.style.display = 'inline-block';
    isOpen = true;
  }

  private closeMenu(menu) {
    document.onclick = (event) => {
      const targ = event.target;
      console.log(targ);
      if (targ !== menu) {
        menu.style.opacity = '0';
        menu.addEventListener('transitionend', () => {
          menu.style.display = 'none';
        });
        isOpen = false;
      }
    };
  }

  private stopScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    window.onscroll = () => {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  private allowScroll() {
    window.onscroll = () => {};
  }

  private dropAlign(dropMenu, ev) {
    const posX = ev.clientX;
    const innWdth = window.innerWidth / 2;
    const posY = ev.clientY;
    const innHgt = window.innerHeight / 2;
    if (innWdth > posX && innHgt > posY) {
      dropMenu.classList.add('left-align');
    } else if (innWdth < posX && innHgt > posY) {
      dropMenu.classList.add('right-align');
    } else if (innWdth > posX && innHgt < posY) {
      dropMenu.classList.add('bottom-left-align');
    } else if (innWdth < posX && innHgt < posY) {
      dropMenu.classList.add('bottom-right-align');
    }
  }
}

@Component({
  selector: 'app-dropdown, p-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent implements OnInit, AfterViewInit {
  @Input() pDropdownId: string;
  @Input() pDropdownWidth: number;
  @Input() pDropdownAlign: string;
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // this.setDropdownAlign();
  }

  // setDropdownAlign(): void {
  //   const dropMenu = document.getElementById(this.pDropdownId);
  //   switch (this.pDropdownAlign) {
  //     case 'left':
  //       dropMenu.classList.add('left-align');
  //       break;
  //     case 'right':
  //       dropMenu.classList.add('right-align');
  //       break;
  //     default:
  //       const posX = window.innerWidth / 2;
  //       const menX = dropMenu.offsetLeft;
  //       const posY = window.innerHeight / 2;
  //       const menY = dropMenu.offsetTop;
  //       if (menX > posX && menY > posY) {
  //         dropMenu.classList.add('bottom-right-align');
  //       } else if (menX > posX && menY < posY) {
  //         dropMenu.classList.add('right-align');
  //       } else if (menX < posX && menY > posY) {
  //         dropMenu.classList.add('bottom-left-align');
  //       } else if (menX < posX && menY < posY) {
  //         dropMenu.classList.add('left-align');
  //       }
  //       console.log(posX);
  //       console.log(menX);
  //   }
  // }
}
