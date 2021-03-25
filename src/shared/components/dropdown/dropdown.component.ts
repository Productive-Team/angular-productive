import { CloneVisitor } from '@angular/compiler/src/i18n/i18n_ast';
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
    const body = document.querySelector('body');
    this.dropAlign(menu, event);
    setTimeout(() => {
      this.setDropdownWrapperPosition(event, menu);
      const dropWrap = document.getElementById(
        `${this.pDropdownTriggerId}-wrapper`
      );
      menu.style.display = 'inline-block';
      menu.style.opacity = '1';
      const back = document.createElement('div');
      back.classList.add('backdrop');
      body.insertAdjacentElement('beforeend', back);
      document.addEventListener('click', (ev) => {
        const tr = ev.target as HTMLDivElement;
        if (
          tr.classList.contains('backdrop') ||
          tr.classList.contains('dropdown-wrapper')
        ) {
          this.close(back, menu, dropWrap);
        }
      });
    }, 5);
  }

  private close(backdrop, menu, dropWrap): any {
    menu.style.opacity = '0';
    dropWrap.style.display = 'none';
    dropWrap.style.left = null;
    dropWrap.style.top = null;
    dropWrap.style.bottom = null;
    dropWrap.style.right = null;
    dropWrap.style.alignItems = null;
    dropWrap.style.justifyContent = null;
    dropWrap.style.height = null;
    dropWrap.style.width = null;
    menu.addEventListener('transitionend', this.remv(backdrop, menu));
    menu.removeEventListener('transitionend', this.remv(backdrop, menu));
  }

  remv(backdrop, menu): void {
    menu.style.display = 'none';
    backdrop.remove();
  }

  private dropAlign(dropMenu, ev) {
    const posX = ev.clientX;
    const innWdth = window.innerWidth / 2;
    const posY = ev.clientY;
    const innHgt = window.innerHeight / 2;
    console.log('hgt:' + innHgt);
    console.log('postY:' + posY);
    if (innWdth > posX && innHgt > posY) {
      dropMenu.classList.remove(
        'right-align',
        'bottom-left-align',
        'bottom-right-align'
      );
      dropMenu.classList.add('left-align');
    } else if (innWdth < posX && innHgt > posY) {
      dropMenu.classList.remove(
        'left-align',
        'bottom-left-align',
        'bottom-right-align'
      );
      dropMenu.classList.add('right-align');
    } else if (innWdth > posX && innHgt < posY) {
      dropMenu.classList.remove(
        'left-align',
        'right-align',
        'bottom-right-align'
      );
      dropMenu.classList.add('bottom-left-align');
    } else if (innWdth < posX && innHgt < posY) {
      dropMenu.classList.remove(
        'left-align',
        'right-align',
        'bottom-left-align'
      );
      dropMenu.classList.add('bottom-right-align');
    }
  }
  private setDropdownWrapperPosition(event, menu): void {
    const tgt = event.target as HTMLInputElement;
    const boundRect = tgt.getBoundingClientRect();
    const clientX = window.innerWidth;
    const clientY = window.innerHeight;
    const offsetLeft = boundRect.left;
    const offsetTop = boundRect.top;

    const width = clientX - offsetLeft;
    const height = clientY - offsetTop;

    const element = document.getElementById(
      `${this.pDropdownTriggerId}-wrapper`
    );
    element.style.display = 'flex';
    const menu1 = menu as HTMLUListElement;
    if (menu1.classList.contains('left-align')) {
      element.style.left = offsetLeft + 'px';
      element.style.top = offsetTop + 'px';
      element.style.alignItems = 'flex-start';
      element.style.justifyContent = 'flex-start';
      element.style.height = height + 'px';
      element.style.width = width + 'px';
    } else if (menu1.classList.contains('bottom-left-align')) {
      element.style.left = offsetLeft + 'px';

      element.style.bottom = height + 'px';
      element.style.alignItems = 'flex-start';
      element.style.justifyContent = 'flex-end';
      element.style.height = offsetTop + 'px';
      element.style.width = width + 'px';
    } else if (menu1.classList.contains('right-align')) {
      element.style.right = width + 'px';
      element.style.top = offsetTop + 'px';
      element.style.alignItems = 'flex-end';
      element.style.justifyContent = 'flex-start';
      element.style.height = height + 'px';
      element.style.width = offsetLeft + 'px';
    } else if (menu1.classList.contains('bottom-right-align')) {
      element.style.right = width + 'px';
      element.style.bottom = height + 'px';
      element.style.alignItems = 'flex-end';
      element.style.justifyContent = 'flex-end';
      element.style.height = offsetLeft + 'px';
      element.style.width = offsetLeft + 'px';
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
