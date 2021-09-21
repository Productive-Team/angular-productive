import {
  animate,
  animateChild,
  group,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[app-dropdown-trigger], [p-dropdown-trigger], [pDropdownTrigger]',
  exportAs: 'pDropdownTrigger',
})
export class DropdownTriggerDirective {
  @Input() pDropdownTriggerFor: any;
  @Input() pDropdownOpenHover = false;

  constructor() {}

  @HostListener('click', ['$event']) openMenu(event) {
    if (!this.pDropdownOpenHover) {
      this.pDropdownTriggerFor.openDropdown(event);
    }
  }
  @HostListener('mouseover', ['$event']) openMenuHover(event) {
    if (this.pDropdownOpenHover) {
      setTimeout(() => {
        this.pDropdownTriggerFor.openDropdown(event);
      }, 150);
    }
  }
}

const parentElementAnim = trigger('prntElAnim', [
  transition(':leave', [group([query('@dropdownAnim', animateChild())])]),
]);
const childElementAnim = trigger('dropdownAnim', [
  state('void', style({ opacity: 0, transform: 'scale(0.85)' })),
  transition(
    'void => *',
    animate('110ms', style({ opacity: 1, transform: 'scale(1)' }))
  ),
  transition('* => void', animate('100ms', style({ opacity: 0 }))),
]);

@Component({
  selector: 'app-dropdown, p-dropdown',
  templateUrl: './dropdown.component.html',
  animations: [childElementAnim, parentElementAnim],
})
export class DropdownComponent implements OnInit, OnDestroy {
  @Input() pDropdownId: string;
  @Input() pDropdownWidth: number;
  @Input() pDropdownCloseOnClick = true;
  @Input() pDropdownXPosition: string;
  @Input() pDropdownYPosition: string;

  isMenuOpen = false;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    document
      .querySelector('body')
      .insertAdjacentElement('beforeend', this.el.nativeElement);
  }

  ngOnDestroy(): void {
    document.querySelector('body').removeChild(this.el.nativeElement);
  }

  openDropdown(event: any): void {
    this.isMenuOpen = true;
    this.setBackdrop();
    setTimeout(() => {
      this.setWrapperSize(event.target);
    }, 0);
  }

  setBackdrop(): void {
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    backdrop.style.zIndex = '999';
    backdrop.addEventListener('click', () => {
      this.closeDropdown();
    });
    document.body.insertAdjacentElement('beforeend', backdrop);
  }

  removeBackdrop(): void {
    const backdrop = document.querySelector('.backdrop') as HTMLDivElement;
    backdrop.remove();
  }

  setWrapperSize(elementOrigin: any): void {
    const elRect = elementOrigin.getBoundingClientRect();
    const wrapper = this.el.nativeElement.firstChild as HTMLDivElement;
    wrapper.style.left = elRect.left + 'px';
    wrapper.style.top = elRect.bottom + 'px';

    const menuPanel = this.el.nativeElement.firstChild
      .firstChild as HTMLDivElement;

    const menuPanelRect = menuPanel.getBoundingClientRect();

    const innerHeight = window.innerHeight;
    const innerWidth = document.body.offsetWidth;

    const posX = menuPanelRect.left + menuPanelRect.width;
    const posY = menuPanelRect.top + menuPanelRect.height;

    const actualPanel = menuPanel.firstChild as HTMLDivElement;

    const positioning = `${this.pDropdownXPosition} ${this.pDropdownYPosition}`;

    if (
      (posX > innerWidth && posY < innerHeight) ||
      positioning === 'right top'
    ) {
      actualPanel.style.transformOrigin = 'right top';
      wrapper.style.left = elRect.right - menuPanel.offsetWidth + 'px';
    } else if (
      (posY > innerHeight && posX < innerWidth) ||
      positioning === 'left bottom'
    ) {
      actualPanel.style.transformOrigin = 'left bottom';
      wrapper.style.top = elRect.top - menuPanelRect.height + 'px';
    } else if (
      (posY > innerHeight && posX > innerWidth) ||
      positioning === 'right bottom'
    ) {
      actualPanel.style.transformOrigin = 'right bottom';
      wrapper.style.top = elRect.top - menuPanelRect.height + 'px';
      wrapper.style.left = elRect.right - menuPanel.offsetWidth + 'px';
    }
  }

  closeDropdown(): void {
    this.isMenuOpen = false;
    this.removeBackdrop();
  }
}
