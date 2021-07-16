import { animate, style, transition, trigger } from '@angular/animations';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  forwardRef,
  EventEmitter,
  Directive,
  Output,
  ContentChildren,
  QueryList,
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

  pSelectMultiple: boolean;
  pSelectAllInput: boolean;

  pSelectSearch: boolean;

  @Input() pSelectValue: any;
  @Output() pSelectValueChange = new EventEmitter<any>();

  selectedOptions = [];

  menuOpen: boolean;

  @ViewChild('menu') selectMenu: ElementRef;
  @ViewChild('input') selectInput: ElementRef;

  @ContentChildren(forwardRef(() => SelectCustomOptionComponent), {
    descendants: true,
  })
  optButtons: any;

  constructor() {}

  ngOnInit() {
    // this.setToBody();
  }

  // setToBody(): void {
  //   setTimeout(() => {
  //     console.log(this.selectMenu.nativeElement);
  //   }, 50);
  // }

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

  setSingleValue(value: any) {
    if (this.selectedOptions.length > 0) {
      console.log(this.selectedOptions[0]);
      this.selectedOptions[0].selected = false;
    }
    this.pSelectValueChange.emit(value);
    this.closeMenu();
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
  template: ` <button
    pRipple
    [class]="selected ? 'selected' : ''"
    [value]="value"
    (click)="
      parent.pSelectMultiple ? '' : selectSingleValue($event.target.value)
    "
  >
    <p-checkbox
      class="p-select-no-pointer-events"
      *ngIf="parent.pSelectMultiple"
    ></p-checkbox>
    <ng-content></ng-content>
  </button>`,
})
export class SelectCustomOptionComponent {
  @Input() value: any;

  selected: boolean;
  constructor(public parent: CustomSelectComponent, private el: ElementRef) {}

  selectSingleValue(value: any): void {
    const nativeEl = this.el.nativeElement.firstChild as HTMLButtonElement;
    this.selected = true;
    console.log(this.el);
    this.parent.selectedOptions.push(this.el.nativeElement);
    this.parent.selectInput.nativeElement.value = nativeEl.textContent;
    this.parent.setSingleValue(value);
  }
}

@Directive({
  selector: '[multiple], [appMultiple]',
})
export class SelectMultipleDirective implements OnInit {
  @Input() pSelectAllInput: boolean;
  constructor(public parent: CustomSelectComponent) {
    this.parent.pSelectMultiple = true;
  }

  ngOnInit(): void {
    if (this.pSelectAllInput) {
      this.parent.pSelectAllInput = true;
    }
  }
}

@Directive({
  selector: '[search], [appSearch]',
})
export class SelectSearchDirective {
  constructor(public parent: CustomSelectComponent) {
    this.parent.pSelectSearch = true;
  }
}
