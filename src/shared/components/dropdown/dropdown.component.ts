import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

let closeOnBtnClick = true;

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
      menu.style.opacity = '1';
      const back = document.createElement('div');
      back.classList.add('backdrop');
      back.style.zIndex = '999';
      body.insertAdjacentElement('beforeend', back);
      if (closeOnBtnClick) {
        const links = menu.getElementsByTagName('a');
        const buttons = menu.getElementsByTagName('button');
        let a = 0;
        for (; a < links.length; a++) {
          links[a].classList.add('pDropdownButton');
        }
        let b = 0;
        for (; b < buttons.length; b++) {
          buttons[b].classList.add('pDropdownButton');
        }
      }
      document.addEventListener('click', (ev) => {
        const tr = ev.target as HTMLDivElement;
        if (closeOnBtnClick) {
          if (
            tr.classList.contains('backdrop') ||
            tr.classList.contains('dropdown-wrapper') ||
            tr.classList.contains('pDropdownButton')
          ) {
            this.close(back, menu, dropWrap);
          }
        } else {
          if (
            tr.classList.contains('backdrop') ||
            tr.classList.contains('dropdown-wrapper')
          ) {
            this.close(back, menu, dropWrap);
          }
        }
      });
    }, 0);
  }

  close(backdrop, menu, dropWrap): any {
    menu.style.opacity = '0';
    menu.addEventListener('transitionend', this.remov(backdrop, dropWrap));
    menu.removeEventListener('transitionend', this.remov(backdrop, dropWrap));
  }

  private remov(backdrop, dropWrap): any {
    setTimeout(() => {
      dropWrap.style.display = 'none';
      dropWrap.style.left = null;
      dropWrap.style.top = null;
      dropWrap.style.bottom = null;
      dropWrap.style.right = null;
      dropWrap.style.alignItems = null;
      dropWrap.style.justifyContent = null;
      dropWrap.style.height = null;
      dropWrap.style.width = null;
      backdrop.remove();
    }, 50);
  }

  private dropAlign(dropMenu, ev) {
    const posX = ev.clientX;
    const innWdth = window.innerWidth / 1.5;
    const posY = ev.clientY;
    const innHgt = window.innerHeight / 1.5;
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
    let clientX = window.innerWidth;
    let clientY = window.innerHeight;
    const offsetLeft = boundRect.left;
    const offsetTop = boundRect.top;

    const container = document.querySelector(
      '.content-contain'
    ) as HTMLDivElement;

    if (container) {
      const containerMeasures = container.getBoundingClientRect();
      clientX = containerMeasures.width;
      clientY = containerMeasures.height;
    }

    const width = clientX - offsetLeft;
    const height = clientY - offsetTop;

    const element = document.getElementById(
      `${this.pDropdownTriggerId}-wrapper`
    );
    element.style.display = 'flex';
    const menu1 = menu as HTMLUListElement;
    if (menu1.classList.contains('left-align')) {
      element.style.left = offsetLeft + 'px';
      element.style.top = offsetTop + boundRect.height + 'px';
      element.style.alignItems = 'flex-start';
      element.style.justifyContent = 'flex-start';
      element.style.height = height + 'px';
      element.style.width = width + 'px';
    } else if (menu1.classList.contains('bottom-left-align')) {
      element.style.left = offsetLeft + 'px';
      element.style.bottom = window.innerHeight - offsetTop + 'px';
      element.style.alignItems = 'flex-start';
      element.style.justifyContent = 'flex-end';
      element.style.height = offsetTop + 'px';
      element.style.width = width + 'px';
    } else if (menu1.classList.contains('right-align')) {
      element.style.right = width - boundRect.width + 'px';
      element.style.top = offsetTop + boundRect.height + 'px';
      element.style.alignItems = 'flex-end';
      element.style.justifyContent = 'flex-start';
      element.style.height = height + 'px';
      element.style.width = offsetLeft + 'px';
    } else if (menu1.classList.contains('bottom-right-align')) {
      element.style.right = width - boundRect.width + 'px';
      element.style.bottom = window.innerHeight - offsetTop + 'px';
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
export class DropdownComponent implements OnInit {
  @Input() pDropdownId: string;
  @Input() pDropdownWidth: number;
  @Input() pDropdownAlign: string;
  @Input() pDropdownCloseOnClick = true;
  constructor() {}

  ngOnInit(): void {
    closeOnBtnClick = this.pDropdownCloseOnClick;
  }
}
