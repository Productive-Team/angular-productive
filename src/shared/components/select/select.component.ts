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
  OnDestroy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const menuAnim = trigger('menuAnimation', [
  transition(':enter', [
    style({
      opacity: 0,
    }),
    animate(
      '150ms cubic-bezier(.1,.5,.65,.99)',
      style({
        opacity: 1,
      })
    ),
  ]),
  transition(':leave', [
    animate('150ms cubic-bezier(.1,.5,.65,.99)', style({ opacity: 0 })),
  ]),
]);

@Component({
  selector: 'app-select, p-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  animations: [menuAnim],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements OnInit, OnDestroy {
  @Input() pSelectAppearence: string;
  @Input() pSelectLabel: string;

  pSelectMultiple: boolean;
  pSelectAllInput: boolean;
  @Input('disabled') pSelectDisabled: boolean;

  pSelectSearch: boolean;

  @Input() pSelectValue: any;
  @Output() pSelectValueChange = new EventEmitter<any>();

  selectedOptions = [];
  multipleValues = [];

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

  selectedOptionText: string;

  postionStyle: string;

  public transformOrigin = '50% 0px 0px';

  constructor() {}

  change = (_) => {};
  blur = (_) => {};

  ngOnInit() {
    setTimeout(() => {
      this.setToBody();
      this.checkToSelectSingle(this.pSelectValue);
      this.checkToSelectMultiple(this.pSelectValue);
    }, 0);
  }

  setToBody(): void {
    const menu = this.selectMenu.nativeElement as HTMLElement;
    document.body.insertAdjacentElement('beforeend', menu);
  }

  writeValue(obj: any): void {
    this.pSelectValue = obj;
    setTimeout(() => {
      if (obj) {
        if (!this.pSelectMultiple) {
          this.checkToSelectSingle(obj);
        } else {
          this.checkToSelectMultiple(obj);
        }
      }
    }, 0);
  }

  registerOnChange(fn: any): void {
    this.change = fn;
  }

  registerOnTouched(fn: any): void {
    this.blur = fn;
  }

  openMenu(): void {
    // TODO: Fix bug after filter query, it doesn't scroll the option to view and doesn't set the position
    // even though it still recieves the option normally
    this.menuOpen = true;
    this.setBackdrop();
    this.scrollOptToView();
    setTimeout(() => {
      this.setPositions();
    }, 0);
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
    this.selectInput.nativeElement.closest('.fieldset').parentElement.click();
    this.closeMenu();
  }

  setMultipleValue(value: any) {
    this.pSelectValueChange.emit(value);
    this.change(value);
  }

  checkToSelectSingle(value: any): void {
    this.optButtons._results.forEach((x) => {
      x.selected = false;
    });
    const component = this.optButtons._results.find((x) => x.value === value);
    this.selectedOption = component;
    if (component && value.length > 0) {
      const elementComp = component.el.nativeElement
        .firstChild as HTMLButtonElement;
      this.selectInput.nativeElement.value = elementComp.textContent;
      component.selected = true;
    } else {
      this.selectInput.nativeElement.value = '';
    }
  }

  checkToSelectMultiple(value: any): void {
    const input = this.selectInput.nativeElement as HTMLInputElement;
    const select = this.optButtons._results.find((o) => o.value === value);
    const opt = this.selectedOptions.find((v) => v.value === select.value);
    if (!opt) {
      select.selected = true;
      this.selectedOptions.push(select);
    } else {
      const index = this.selectedOptions.indexOf(opt);
      this.selectedOptions.splice(index, 1);
      select.selected = false;
    }
    const allSelected = this.optButtons._results.filter((x) => x.selected);
    if (allSelected.length > 0) {
      this.selectedOption = allSelected[0];
      input.value = allSelected[0].el.nativeElement.firstChild.textContent;
      this.selectedTotal = this.selectedOptions.length - 1;
    } else {
      this.selectedOption = undefined;
      input.value = null;
      this.selectedTotal = 0;
    }
    const val = [];
    if (this.selectedOptions.length > 0) {
      this.selectedOptions.forEach((v) => {
        val.push(v.value);
        this.multipleValues = val;
      });
    } else {
      this.multipleValues = [];
    }
    this.setMultipleValue(this.multipleValues);
  }

  selectAll(event): void {
    this.optButtons._results.forEach((x) => {
      if (event === true) {
        if (x.selected) {
          const idx = this.selectedOptions.indexOf(x);
          this.selectedOptions.splice(idx, 1);
        }
      }
      this.checkToSelectMultiple(x.value);
    });
    this.allSelected = event;
  }

  isEverySelected(): void {
    this.allSelected = this.optButtons._results.every((t) => t.selected);
  }

  indeterminateSelected(): boolean {
    return (
      this.optButtons._results.filter((x) => x.selected).length > 0 &&
      !this.allSelected
    );
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
    let styleStr = '';

    // Get the input and the input positions
    const input = this.selectInput.nativeElement as HTMLInputElement;
    const inputPositions = this.getPositions(input);

    // Gets the selected or first option in the list
    let selectedOpt;
    if (!this.selectedOption) {
      selectedOpt = this.optButtons._results[0].el.nativeElement
        .firstChild as HTMLElement;
    } else {
      selectedOpt = this.selectedOption.el.nativeElement
        .firstChild as HTMLElement;
    }

    // Gets the select content
    // <div class="p-select-content"></div>

    const select = this.selectMenu.nativeElement.firstChild
      .firstChild as HTMLDivElement;

    // Calculates the top distance in pixels, by subtracting the offsetHeight of the
    // selected option and the input, diving the result by two, and then subtracting
    // the DOMRect top from the input by the result of the division
    let topPosition =
      inputPositions.top - (selectedOpt.offsetHeight - input.offsetHeight) / 2;

    // Calculates the positioning the menu needs to translate backwards via transform.
    // This is done by subtracting the offsetTop of the selected option by the scrollTop value
    // of the p-select-content div, which scrolls
    let topPositioning = Math.abs(selectedOpt.offsetTop - select.scrollTop);

    // By subtracting the two values above you will find the real distance between the menu
    // and the top of the viewport
    const topValue = topPosition - topPositioning;

    // Calculates the transform origin
    select.style.transformOrigin = `50% ${topPositioning + 9}px 0px`;

    const fieldset = this.getPositions(input.closest('.fieldset'));

    let topString = `top: ${topPosition}px;`;
    if (topValue < 0) {
      topPosition = 0;
      topPositioning = 0;
    } else if (topValue + select.offsetHeight > window.innerHeight) {
      topPosition = topPosition - select.offsetHeight;
      if (topPosition < 0) {
        topPosition = 0;
      }
      topPositioning = 0;
      topString = `top: ${topPosition}px;`;
    } else if (topValue > window.innerHeight) {
      topPosition = 0;
      topString = `bottom: ${topPosition}px;`;
    }

    const inputDifferece = Math.round(fieldset.width - input.offsetWidth);

    let leftPos = inputPositions.left - inputDifferece / 4;

    let inputWidth = fieldset.width;

    if (this.pSelectMultiple) {
      leftPos = inputPositions.left - 40;
      if (leftPos < 0) {
        leftPos = 0;
      }
      inputWidth = fieldset.width + 40;
    }

    styleStr =
      topString +
      `left: ${leftPos}px;` +
      `width: ${inputWidth}px;` +
      `transform: scaleY(1) translateY(-${topPositioning}px); bottom: ${
        topValue > window.innerHeight ? topPosition : null
      }; `;

    this.postionStyle = styleStr;
  }

  private getPositions(element: any): DOMRect {
    return element.getBoundingClientRect();
  }

  public updateSearch(): void {
    if (this.pSelectMultiple) {
      const currentValue = this.pSelectValue;
      currentValue.forEach((x) => {
        const component = this.optButtons._results.find((v) => v.value === x);
        if (component) {
          component.selected = true;
        }
      });
    } else {
      const currentValue = this.pSelectValue;
      const component = this.optButtons._results.find(
        (x) => x.value === currentValue
      );
      if (component) {
        component.selected = true;
      }
    }
    this.isEverySelected();
  }

  ngOnDestroy(): void {
    const menu = this.selectMenu.nativeElement as HTMLElement;
    menu.remove();
  }
}

@Component({
  selector: 'app-option, p-option',
  styleUrls: ['./select.component.css'],
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
      [(pCheckboxChecked)]="selected"
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
    this.parent.checkToSelectMultiple(value);
    this.parent.isEverySelected();
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
