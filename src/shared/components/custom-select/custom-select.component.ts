import { animate, style, transition, trigger } from '@angular/animations';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  forwardRef,
  EventEmitter,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const menuAnim = trigger('menuAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.95)' }),
    animate(
      '150ms cubic-bezier(.07,.36,.41,.88)',
      style({ opacity: 1, transform: 'scale(1)' })
    ),
  ]),
  transition(':leave', [
    animate('150ms cubic-bezier(.07,.36,.41,.88)', style({ opacity: 0 })),
  ]),
]);

@Component({
  selector: 'app-custom-select, p-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css'],
  animations: [menuAnim],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
})
export class CustomSelectComponent implements OnInit {
  @Input() pSelectAppearence: string;
  @Input() pSelectLabel: string;

  @Input() pSelectValue: any;
  @Input() pSelectValueChange = new EventEmitter<any>();

  menuOpen: boolean;

  @ViewChild('menu') selectMenu: ElementRef;
  constructor() {}

  ngOnInit() {
    this.setToBody();
  }

  setToBody(): void {
    setTimeout(() => {
      console.log(this.selectMenu.nativeElement);
    }, 50);
  }

  openMenu(): void {
    this.menuOpen = true;
    this.setBackdrop();
  }

  closeMenu(): void {
    this.menuOpen = false;
    this.removeBackdrop();
  }

  setBackdrop(): void {
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    backdrop.addEventListener('click', () => {
      this.closeMenu();
    });
    document.body.insertAdjacentElement('beforeend', backdrop);
  }

  removeBackdrop(): void {
    const backdrop = document.querySelector('.backdrop');
    backdrop.remove();
  }
}

@Component({
  selector: 'app-custom-option, p-custom-option',
  styleUrls: ['./custom-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectCustomOptionComponent),
      multi: true,
    },
  ],
  template: ` <button pRipple [value]="value">
    <ng-content></ng-content>
  </button>`,
})
export class SelectCustomOptionComponent {
  @Input() value: any;
  constructor() {}
}
