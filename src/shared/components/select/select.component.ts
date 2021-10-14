/* eslint-disable @angular-eslint/no-input-rename */
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
  ViewChildren,
  AfterViewChecked,
  DoCheck,
  AfterContentChecked,
  QueryList,
  AfterContentInit,
  OnChanges,
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
export class SelectComponent implements OnInit, OnDestroy, DoCheck {
  @Input() pSelectAppearence: string;
  @Input() pSelectLabel: string;

  pSelectMultiple: boolean;
  pSelectAllInput: boolean;
  @Input('disabled') pSelectDisabled: boolean;

  pSelectSearch: boolean;

  @Input() pSelectData: SelectDataModel[] = [];

  @Input() pSelectValue: any;
  @Output() pSelectValueChange = new EventEmitter<any>();

  selectedOptions: SelectOptionComponent[] = [];
  multipleValues = [];

  optionButtons: SelectOptionComponent[] = [];

  allSelected = false;

  selectedTotal = 0;

  selectedOption: SelectOptionComponent;

  menuOpen: boolean;

  searchText: string;

  @ViewChild('menu') selectMenu: ElementRef;
  @ViewChild('input') selectInput: ElementRef;

  @ViewChild('optionContent') optionContent: ElementRef;

  @ViewChildren(forwardRef(() => SelectOptionComponent))
  arrayGeneratedButtons: QueryList<SelectOptionComponent>;

  @ContentChildren(forwardRef(() => SelectOptionComponent), {
    descendants: true,
  })
  contentProjectionButtons: QueryList<SelectOptionComponent>;

  selectedOptionText: string;

  postionStyle: string;

  public transformOrigin = '50% 0px 0px';

  constructor(private el: ElementRef) {}

  change = (_) => {};
  blur = (_) => {};

  ngOnInit() {
    setTimeout(() => {
      this.setToBody();
      if (this.pSelectData.length === 0) {
        if (!this.pSelectMultiple) {
          this.checkToSelectSingle(this.pSelectValue);
        } else {
          const array = Array.isArray(this.pSelectValue);
          if (array) {
            this.pSelectValue.forEach((x) => {
              this.checkToSelectMultiple(x);
            });
          } else {
            this.checkToSelectMultiple(this.pSelectValue);
          }
        }
      } else {
        const text = this.pSelectData.find((x) => x.id === this.pSelectValue);
        if (text !== undefined) {
          this.selectInput.nativeElement.value = text.name.trim();
        }
      }
    }, 0);
  }

  ngDoCheck(): void {
    if (this.arrayGeneratedButtons) {
      this.arrayGeneratedButtons.toArray().forEach((x) => {
        const existsInArray = this.optionButtons.findIndex(
          (y) => y.value === x.value
        );
        if (existsInArray) {
          this.optionButtons.splice(existsInArray, 1);
          this.optionButtons.push(x);
        }
        if (existsInArray < 0) {
          this.optionButtons.push(x);
        }
      });
    }
    if (this.contentProjectionButtons) {
      this.contentProjectionButtons.toArray().forEach((x) => {
        const existsInArray = this.optionButtons.find((y) => y === x);
        if (!existsInArray) {
          this.optionButtons.push(x);
        }
      });
    }

    if (this.pSelectValue) {
      if (!this.pSelectMultiple) {
        const selected = this.optionButtons.find(
          (x) => x.value === this.pSelectValue
        );
        selected.selected = true;
        this.selectedOption = selected;
      } else {
        const isArray = Array.isArray(this.pSelectValue);
        if (isArray) {
          this.pSelectValue.forEach((x) => {
            const find = this.optionButtons.find((c) => c.value === x);
            if (find) {
              find.selected = true;
              this.selectedOptions.push(find);
            }
          });
        } else {
          const find = this.optionButtons.find(
            (c) => c.value === this.pSelectValue
          );
          if (find) {
            find.selected = true;
            this.selectedOptions.push(find);
          }
        }
      }
    }
  }

  // ngDoCheck(): void {
  //   if (this.arrayGeneratedButtons !== undefined) {
  //     const genLength = this.arrayGeneratedButtons._results.length;
  //     let i = 0;
  //     for (; i < genLength; i++) {
  //       const idx = this.optionButtons.findIndex(
  //         (x) => x.value === this.arrayGeneratedButtons._results[i].value
  //       );

  //       if (idx >= 0) {
  //         this.optionButtons.splice(idx, 1);

  //         if (this.selectedOption !== undefined) {
  //           if (
  //             this.arrayGeneratedButtons._results[i].value ===
  //             this.selectedOption.value
  //           ) {
  //             this.arrayGeneratedButtons._results[i].selected = true;
  //             this.selectedOption = this.arrayGeneratedButtons._results[i];
  //           }
  //         }

  //         if (this.pSelectMultiple) {
  //           const isArray = Array.isArray(this.pSelectValue);
  //           if (isArray) {
  //             this.pSelectValue.forEach((c) => {
  //               if (this.arrayGeneratedButtons._results[i].value === c) {
  //                 this.arrayGeneratedButtons._results[i].selected = true;
  //               }
  //             });
  //           } else {
  //             if (
  //               this.arrayGeneratedButtons._results[i].value ===
  //               this.pSelectValue
  //             ) {
  //               this.arrayGeneratedButtons._results[i].selected = true;
  //             }
  //           }
  //         }

  //         this.optionButtons.push(this.arrayGeneratedButtons._results[i]);
  //       } else {
  //         this.optionButtons.push(this.arrayGeneratedButtons._results[i]);
  //       }
  //     }
  //   }
  //   if (this.contentProjectionButtons !== undefined) {
  //     const genLength = this.contentProjectionButtons._results.length;
  //     let i = 0;
  //     for (; i < genLength; i++) {
  //       const idx = this.optionButtons.findIndex(
  //         (x) => x.value === this.contentProjectionButtons._results[i].value
  //       );
  //       if (idx < 0) {
  //         this.optionButtons.push(this.contentProjectionButtons._results[i]);
  //       }
  //     }
  //   }
  // }

  setToBody(): void {
    const menu = this.selectMenu.nativeElement as HTMLElement;
    document.body
      .querySelector('.p-components-container')
      .insertAdjacentElement('beforeend', menu);
  }

  writeValue(obj: any): void {
    this.pSelectValue = obj;
    setTimeout(() => {
      if (!this.pSelectMultiple) {
        this.checkToSelectSingle(obj);
      } else {
        const isArr = Array.isArray(obj);
        if (isArr) {
          obj.forEach((x) => {
            this.checkToSelectMultiple(x);
          });
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
    backdrop.style.zIndex = '1005';
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
    this.optionButtons.forEach((x) => {
      x.selected = false;
    });
    const component = this.optionButtons.find((x) => x.value === value);
    this.selectedOption = component;
    if (component && value.length > 0) {
      const elementComp = component.el.nativeElement
        .firstChild as HTMLButtonElement;
      const text = elementComp.textContent.trim();
      this.selectInput.nativeElement.value = text;
      component.selected = true;
    } else {
      this.selectInput.nativeElement.value = '';
    }
  }

  checkToSelectMultiple(value: any): any[] {
    const input = this.selectInput.nativeElement as HTMLInputElement;
    const select = this.optionButtons.findIndex((o) => o.value === value);
    const opt = this.selectedOptions.find(
      (v) => v.value === this.optionButtons[select].value
    );
    if (opt === undefined) {
      if (select >= 0) {
        this.optionButtons[select].selected = true;
        this.selectedOptions.push(this.optionButtons[select]);
      }
    } else {
      const index = this.selectedOptions.indexOf(opt);
      this.selectedOptions.splice(index, 1);
      this.optionButtons[select].selected = false;
    }
    const allSelected = this.optionButtons.filter((x) => x.selected);
    if (allSelected.length > 0) {
      this.selectedOption = allSelected[0];
      input.value =
        allSelected[0].el.nativeElement.firstChild.textContent.trim();
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
    return this.multipleValues;
  }

  selectAll(event): void {
    this.optionButtons.forEach((x) => {
      if (event === true) {
        if (x.selected) {
          const idx = this.selectedOptions.findIndex(
            (c) => x.value === c.value
          );
          this.selectedOptions.splice(idx, 1);
        }
      }
      const selected = this.checkToSelectMultiple(x.value);
      this.setMultipleValue(selected);
    });
    this.allSelected = event;
  }

  isEverySelected(): void {
    this.allSelected = this.optionButtons.every((t) => t.selected);
  }

  indeterminateSelected(): boolean {
    return (
      this.optionButtons.filter((x) => x.selected).length > 0 &&
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
      console.log(this.optionButtons);
      selectedOpt = this.optionButtons[0].el.nativeElement
        .firstChild as HTMLElement;
    } else {
      selectedOpt = this.selectedOption.el.nativeElement
        .firstChild as HTMLElement;
    }

    const selectedOptHeight = selectedOpt.offsetHeight;

    // Gets the select content
    // <div class="p-select-content"></div>

    const select = this.selectMenu.nativeElement.firstChild
      .firstChild as HTMLDivElement;

    // Calculates the top distance in pixels, by subtracting the offsetHeight of the
    // selected option and the input, diving the result by two, and then subtracting
    // the DOMRect top from the input by the result of the division
    let topPosition =
      inputPositions.top - (selectedOptHeight - input.offsetHeight) / 2;

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

    let inputDifferece = Math.round(fieldset.width - input.offsetWidth - 24);

    let inputWidth = fieldset.width;

    if (inputDifferece === 0) {
      inputDifferece = 24;
      inputWidth = fieldset.width + inputDifferece;
    }

    let leftPos = inputPositions.left - inputDifferece / 2;

    if (this.pSelectMultiple) {
      leftPos = inputPositions.left - 52;
      if (leftPos < 0) {
        leftPos = 0;
      }
      inputWidth = fieldset.width + 52;
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

  searchOptions(): void {
    const value = this.searchText.toUpperCase();
    const li = this.optionContent.nativeElement as HTMLElement;
    const buttons = li.getElementsByTagName('p-option');

    let b = 0;
    for (; b < buttons.length; b++) {
      const opt = buttons[b] as HTMLElement;
      const buttonInsideOpt = opt.firstChild as HTMLButtonElement;
      const buttonValue = buttonInsideOpt.value.trim().toUpperCase();
      const textContent = buttonInsideOpt.innerText.trim().toUpperCase();

      if (value.length === 0) {
        opt.removeAttribute('style');
      } else {
        if (
          buttonValue.indexOf(value) >= 0 ||
          textContent.indexOf(value) >= 0
        ) {
          opt.style.display = '';
        } else {
          opt.style.display = 'none';
        }
      }
    }
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
    [disabled]="disabled"
    (click)="
      parent.pSelectMultiple
        ? selectMultiple($event.target.value)
        : selectSingleValue($event.target.value)
    "
  >
    <p-checkbox
      class="p-select-no-pointer-events"
      [(checked)]="selected"
      color="var(--primary)"
      *ngIf="parent.pSelectMultiple"
    ></p-checkbox>
    <ng-content></ng-content>
  </button>`,
})
export class SelectOptionComponent implements OnInit {
  @Input() value: any;
  @Input() disabled: boolean;

  selected: boolean;
  constructor(public parent: SelectComponent, public el: ElementRef) {}

  ngOnInit(): void {
    if (this.value === undefined) {
      this.value = this.el.nativeElement.firstChild.textContent.trim();
    }
  }

  selectSingleValue(value: any): void {
    this.selected = true;
    this.parent.setSingleValue(value);
  }

  selectMultiple(value: any): void {
    this.selected = !this.selected;
    const values = this.parent.checkToSelectMultiple(value);
    this.parent.setMultipleValue(values);
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

export class SelectDataModel {
  id: any;
  name: string;
  disabled?: boolean;
  selected?: boolean;
}
