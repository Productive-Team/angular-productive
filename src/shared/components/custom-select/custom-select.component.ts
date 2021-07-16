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
  AfterViewInit,
  AfterContentInit,
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

  selectedOption: any;

  menuOpen: boolean;

  @ViewChild('menu') selectMenu: ElementRef;
  @ViewChild('input') selectInput: ElementRef;

  @ContentChildren(forwardRef(() => SelectCustomOptionComponent), {
    descendants: true,
  })
  optButtons: any;

  constructor() {}

  change = (_) => {};
  blur = (_) => {};

  ngOnInit() {
    // this.setToBody();
    setTimeout(() => {
      this.setToBody();
      this.checkToSelectSingle(this.pSelectValue);
    }, 0);
  }

  setToBody(): void {
    const menu = this.selectMenu.nativeElement as HTMLElement;
    document.body.insertAdjacentElement('beforeend', menu);
  }

  // writes the checkbox value
  writeValue(obj: any): void {
    this.pSelectValue = obj;
    setTimeout(() => {
      if (obj) {
        this.checkToSelectSingle(obj);
      }
    }, 0);
  }

  // register the changes
  registerOnChange(fn: any): void {
    this.change = fn;
  }

  // blurs the component
  registerOnTouched(fn: any): void {
    this.blur = fn;
  }

  openMenu(): void {
    this.menuOpen = true;
    this.setBackdrop();
    this.scrollOptToView();
    this.setPositions();
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
    this.checkToSelectSingle(value);
    this.pSelectValueChange.emit(value);
    this.change(value);
    this.closeMenu();
  }

  checkToSelectSingle(value: any): void {
    this.optButtons._results.forEach((x) => {
      x.selected = false;
    });
    const component = this.optButtons._results.find((x) => x.value === value);
    this.selectedOption = component;
    const elementComp = component.el.nativeElement
      .firstChild as HTMLButtonElement;
    if (component) {
      this.selectInput.nativeElement.value = elementComp.textContent;
      component.selected = true;
    }
  }

  scrollOptToView(): void {
    setTimeout(() => {
      if (this.selectedOption) {
        const element = this.selectedOption.el.nativeElement as HTMLElement;
        const scrollOpt: ScrollIntoViewOptions = {
          behavior: 'auto',
          block: 'center',
          inline: 'nearest',
        };
        element.scrollIntoView(scrollOpt);
      }
    }, 0);
  }

  setPositions(): void {
    const opt = this.selectedOption.el.nativeElement.firstChild as HTMLElement;
    const fieldset = this.selectInput.nativeElement as HTMLInputElement;
    const fieldPos = this.getPositions(fieldset);
    setTimeout(() => {
      const menu = this.selectMenu.nativeElement.firstChild as HTMLDivElement;
      const optPos = this.getPositions(opt);
      const menuPos = this.getPositions(menu);
      const topPos = fieldPos.top - (optPos.top - optPos.height / 2) - 35;
      const leftPos = fieldPos.left - 16;

      menu.style.width =
        fieldset.parentElement.parentElement.parentElement.offsetWidth + 'px';

      menu.style.left = leftPos + 'px';

      const fullHeight = topPos + menuPos.height;
      console.log(fullHeight);
      if (topPos < 0) {
        if (topPos + fieldPos.top + menuPos.height > window.innerHeight) {
          menu.style.top = topPos - fieldPos.top / 10 + 'px';
        } else {
          menu.style.top = topPos + fieldPos.top + 'px';
        }
        // } else if (fullHeight > window.innerHeight) {
        //   menu.style.top = topPos - menuPos.height / 2 + 'px';
      } else {
        menu.style.top = topPos + 'px';
      }
    }, 0);
  }

  getPositions(element: any): DOMRect {
    return element.getBoundingClientRect();
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
    this.selected = true;
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
