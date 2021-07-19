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
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const menuAnim = trigger('menuAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.95)' }),
    animate(
      '150ms cubic-bezier(.1,.5,.65,.99)',
      style({ opacity: 1, transform: 'scale(1)' })
    ),
  ]),
  transition(':leave', [
    animate('150ms cubic-bezier(.1,.5,.65,.99)', style({ opacity: 0 })),
  ]),
]);

@Component({
  selector: 'app-select, p-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css'],
  animations: [menuAnim],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements OnInit {
  @Input() pSelectAppearence: string;
  @Input() pSelectLabel: string;

  pSelectMultiple: boolean;
  pSelectAllInput: boolean;

  pSelectSearch: boolean;

  @Input() pSelectValue: any;
  @Output() pSelectValueChange = new EventEmitter<any>();

  selectedOptions = [];

  allSelected = false;

  selectedTotal = 0;

  selectedOption: any;

  menuOpen: boolean;

  @ViewChild('menu') selectMenu: ElementRef;
  @ViewChild('input') selectInput: ElementRef;

  @ContentChildren(forwardRef(() => SelectOptionComponent), {
    descendants: true,
  })
  optButtons: any;

  constructor() {}

  change = (_) => {};
  blur = (_) => {};

  ngOnInit() {
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
    if (component) {
      const elementComp = component.el.nativeElement
        .firstChild as HTMLButtonElement;
      this.selectInput.nativeElement.value = elementComp.textContent;
      component.selected = true;
    }
  }

  checkToSelectMultiple(): void {
    const selected = this.optButtons._results.filter((x) => x.selected);
    const input = this.selectInput.nativeElement as HTMLInputElement;
    if (selected.length > 0) {
      this.selectedOption = selected[0];
      this.selectedOptions = selected;
      input.value = selected[0].el.nativeElement.firstChild.textContent;
      this.selectedTotal = this.selectedOptions.length - 1;
      const values = [];
      this.selectedOptions.forEach((x) => {
        values.push(x.el.nativeElement.firstChild.value);
      });
      this.pSelectValueChange.emit(values);
      this.change(values);
    } else {
      input.value = null;
      this.selectedOption = undefined;
      this.pSelectValueChange.emit([]);
      this.selectedTotal = this.selectedOptions.length - 1;
      this.change([]);
    }
  }

  selectAll(event): void {
    this.optButtons._results.forEach((x) => {
      x.selected = event;
    });
    this.allSelected = event;
    this.checkToSelectMultiple();
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
    const fieldset = this.selectInput.nativeElement as HTMLInputElement;
    const fieldPos = this.getPositions(fieldset);
    let opt;
    if (!this.selectedOption) {
      opt = this.optButtons._results[0].el.nativeElement.firstChild;
    } else {
      opt = this.selectedOption.el.nativeElement.firstChild as HTMLElement;
    }
    setTimeout(() => {
      const menu = this.selectMenu.nativeElement.firstChild as HTMLDivElement;
      menu.style.width =
        fieldset.parentElement.parentElement.parentElement.offsetWidth + 'px';
      const menuPos = this.getPositions(menu);
      const optPos = this.getPositions(opt);
      const topPos =
        fieldPos.top - (optPos.top - optPos.height / 2) - optPos.height / 1.3;
      const leftPos = fieldPos.left - 16;

      menu.style.left = leftPos + 'px';

      if (topPos < 0) {
        menu.style.top = '0px';
      } else if (topPos + menuPos.height > window.innerHeight) {
        menu.style.top = fieldPos.top - menuPos.height + 'px';
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
  selector: 'app-option, p-option',
  styleUrls: ['./custom-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectOptionComponent),
      multi: true,
    },
  ],
  template: ` <button
    pRipple
    [class]="selected ? 'selected' : ''"
    [value]="value"
    (click)="
      parent.pSelectMultiple
        ? selectMultiple($event.target.value)
        : selectSingleValue($event.target.value)
    "
  >
    <p-checkbox
      class="p-select-no-pointer-events"
      [(ngModel)]="selected"
      *ngIf="parent.pSelectMultiple"
    ></p-checkbox>
    <ng-content></ng-content>
  </button>`,
})
export class SelectOptionComponent {
  @Input() value: any;

  selected: boolean;
  constructor(public parent: SelectComponent, private el: ElementRef) {}

  selectSingleValue(value: any): void {
    this.selected = true;
    this.parent.setSingleValue(value);
  }

  selectMultiple(value: any): void {
    this.selected = !this.selected;
    this.parent.checkToSelectMultiple();
  }
}

@Directive({
  selector: '[multiple], [appMultiple]',
})
export class SelectMultipleDirective implements OnInit {
  @Input() pSelectAllInput: boolean;
  constructor(public parent: SelectComponent) {
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
  constructor(public parent: SelectComponent) {
    this.parent.pSelectSearch = true;
  }
}
