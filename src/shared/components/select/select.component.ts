/* eslint-disable @angular-eslint/no-host-metadata-property */
import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { CoerceBoolean } from 'src/shared/decorators/coerce-boolean-decorator';

const menuOpeningAnimation = trigger('menuOpeningAnimation', [
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
    animate('100ms cubic-bezier(.1,.5,.65,.99)', style({ opacity: 0 })),
  ]),
]);

@Component({
  selector: 'app-select, p-select',
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  animations: [menuOpeningAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(blur)': 'blur()',
    '(change)': 'change(this.value)',
  },
})
export class SelectComponent
  implements
    ControlValueAccessor,
    AfterViewInit,
    OnDestroy,
    AfterContentInit,
    OnChanges
{
  /**
   * Select Value
   */
  @Input()
  value: any;
  /**
   * Select Value change emitter
   */
  @Output()
  valueChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Input placeholder text
   */
  @Input() placeholder: string = '';

  /**
   * Disable select input
   */
  @CoerceBoolean()
  @Input()
  disabled: boolean;

  /**
   * Enables the search bar in componente
   */
  @CoerceBoolean()
  @Input()
  search: boolean;
  /**
   * Stops the default search function to be executed if set to true.
   */
  @Input()
  searchCustomFunction: boolean;
  /**
   * Search input value emitter
   */
  @Output()
  searchValueChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Allow for multiple options to be selected
   */
  @CoerceBoolean()
  @Input()
  multiple: boolean;

  /**
   * Enables the select all checkbox at the top of the menu
   */
  @CoerceBoolean()
  @Input()
  multipleAll: boolean;

  /**
   * Changes appearence when multiple options are selected
   */
  @Input()
  multipleValueAppearence: MultipleValueAppearence = 'extend';

  public openMenu: boolean;

  public selectAllCurrentOptions: boolean;

  public searchValue: string = '';

  public totalSelectedOptions: number = 0;

  private _mainSelectedOption: SelectOptionComponent;
  private _selectedOptions: SelectOptionComponent[] = [];

  private _searchTimeout: any;

  private _selectedOptionsValues: any[] = [];

  private _currentValue: any | any[];

  private _currentChangeSubscriber: Subscription;

  private _optionsLabels: SelectLabelData[] = [];

  @ViewChild('selectMenu') private _selectMenu: ElementRef<HTMLElement>;
  @ViewChild('mainInput') private _mainInput: ElementRef<HTMLInputElement>;
  @ViewChild('selectMenuBody') private _selectMenuBody: ElementRef<HTMLElement>;

  @ContentChildren(forwardRef(() => SelectOptionComponent))
  private _selectOptions: QueryList<SelectOptionComponent>;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _renderer2: Renderer2
  ) {}

  ngAfterViewInit(): void {
    this._setMenuToBody();
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      if (this.multiple) {
        if (Array.isArray(this.value)) {
          this.value.forEach((value) => {
            this.setMultipleValue(value);
          });
        } else {
          this.setMultipleValue(this.value);
        }
      } else {
        this.setSingleValue(this.value);
      }

      this._selectOptions.changes.pipe().subscribe(() => {
        this._selectOptions.toArray().map((option) => {
          if (!this._optionsLabels.find((x) => x.value === option.value)) {
            this._optionsLabels.push({
              value: option.value,
              label: option.elementRef.nativeElement.innerText,
            });
          }
        });
        setTimeout(() => {
          if (!this._currentValue) {
            this._currentValue = this.value;
          }

          if (this.multiple) {
            setTimeout(() => {
              this._selectedOptions = [];
              this._selectedOptionsValues = [];
              this._mainSelectedOption = undefined;
              this._selectOptions?.toArray().map((x) => (x.selected = false));

              if (Array.isArray(this._currentValue)) {
                this._currentValue.forEach((value) => {
                  this._setChangedMultipleValue(value);
                });
              } else {
                this._setChangedMultipleValue(this._currentValue);
              }
            }, 0);
          } else {
            this.setSingleValue(this._currentValue);
          }
        }, 0);
      });
    }, 0);
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if (!simpleChanges.value?.firstChange) {
      if (this.multiple) {
        setTimeout(() => {
          this._selectedOptions = [];
          this._selectedOptionsValues = [];
          this._mainSelectedOption = undefined;
          this._selectOptions?.toArray().map((x) => (x.selected = false));

          if (Array.isArray(simpleChanges.value?.currentValue)) {
            simpleChanges.value?.currentValue.forEach((value) => {
              this._setChangedMultipleValue(value);
            });
          } else {
            this._setChangedMultipleValue(simpleChanges.value?.currentValue);
          }
        }, 0);
      } else {
        this.setSingleValue(simpleChanges.value?.currentValue);
      }
    }
  }

  change = (_) => {};
  blur = (_) => {};

  registerOnChange(fn: any): void {
    this.change = fn;
  }

  registerOnTouched(fn: any): void {
    this.blur = fn;
  }

  writeValue(obj: any): void {
    this.value = obj;
    if (this.multiple) {
      this._selectedOptions = [];
      this._selectedOptionsValues = [];
      this._mainSelectedOption = undefined;
      this._selectOptions?.toArray().map((x) => (x.selected = false));

      if (Array.isArray(obj)) {
        obj.forEach((value) => {
          this._setChangedMultipleValue(value);
        });
      } else {
        this._setChangedMultipleValue(obj);
      }
    } else {
      this.setSingleValue(obj);
    }
  }

  setDisabledState(isDisabled?: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Opens the select menu
   */
  public openSelectMenu(): void {
    this.openMenu = true;
    this._setBackdrop();
    this._centerSelectedOption();
    this._setPositioning();
  }

  /**
   * Closes the select menu
   */
  public closeSelectMenu = (): void => {
    this.openMenu = false;
    this._changeDetectorRef.markForCheck();
    this._removeBackdrop();
  };

  /**
   * Emits values for single selection
   */
  public setSingleValue(newValue: any): void {
    this._changeDetectorRef.markForCheck();

    this.closeSelectMenu();

    this._currentValue = newValue;
    this._selectSingleOnly(newValue);
    this.change(newValue);
    this.valueChange.emit(newValue);
  }

  /**
   * Emits values for multiple selection
   */
  public setMultipleValue(newValue: any): void {
    this._changeDetectorRef.markForCheck();
    this._selectMultipleValue(newValue);

    this._areAllOptionsSelected();
    this._currentValue = this._selectedOptionsValues;
    this.change(this._selectedOptionsValues);
    this.valueChange.emit(this._selectedOptionsValues);
  }

  /**
   * Selects all avaliable options in current array
   */
  public handleSelectAll(event: boolean): void {
    const allOptions = this._selectOptions.toArray();
    this.selectAllCurrentOptions = event;

    allOptions.map((x) => {
      if (event) {
        if (
          x.selected ||
          (this._selectedOptionsValues.includes(x.value) &&
            this._selectedOptions.includes(x))
        ) {
          if (x.selected) x.selected = false;

          const selectedOptionIndex = this._selectedOptions?.findIndex(
            (y) => y.value === x.value
          );

          const selectedOptionValueIndex =
            this._selectedOptionsValues?.findIndex((z) => z === x.value);

          this._selectedOptions.splice(selectedOptionIndex, 1);
          this._selectedOptionsValues.splice(selectedOptionValueIndex, 1);
        }
      }
      if (!x.disabled) {
        this.setMultipleValue(x.value);
      }
    });
  }

  /**
   * Checks to see if only some of the avaliable options are selected
   */
  public isSelectAllIndeterminate(): boolean {
    return (
      this._selectOptions.toArray().filter((x) => x.selected && !x.disabled)
        .length > 0 && !this.selectAllCurrentOptions
    );
  }

  /**
   * Handles the search input event emit
   */
  public handleSearchInput(searchValue: string): void {
    this.searchValueChange.emit(searchValue);
    if (!this.searchCustomFunction) {
      if (searchValue !== this.searchValue) {
        this.searchValue = searchValue;
        clearTimeout(this._searchTimeout);
      }

      this._searchTimeout = setTimeout(() => {
        this._searchInArray(searchValue.toUpperCase());
      }, 300);
    }
  }

  /**
   * Searches value and text labels and hides the ones that are different than the informed value
   */
  private _searchInArray(value: string): void {
    this._selectOptions.toArray().map((x) => {
      const optionValue = x.value.toString().trim().toUpperCase();
      const textContent = x.elementRef.nativeElement.innerText
        .trim()
        .toUpperCase();

      if (value.length === 0) {
        x.elementRef.nativeElement.removeAttribute('style');
      } else {
        if (
          optionValue.indexOf(value) >= 0 ||
          textContent.indexOf(value) >= 0
        ) {
          x.elementRef.nativeElement.style.display = '';
        } else {
          x.elementRef.nativeElement.style.display = 'none';
        }
      }
    });
  }

  private _handleContentProjectionChange(): void {}

  /**
   * Checks if all avaliable options are selected
   */
  private _areAllOptionsSelected(): void {
    this.selectAllCurrentOptions = this._selectOptions
      ?.toArray()
      .filter((x) => !x.disabled)
      .every((t) => t.selected);
  }

  /**
   * Handles the change of multiple values when setting it from outside of component scope
   */
  private _setChangedMultipleValue(newValue: any): void {
    const selectValues = this._selectOptions?.toArray();

    const selectedOption = selectValues?.find(
      (x) => !x.disabled && x.value === newValue
    );

    if (selectedOption || newValue) {
      if (selectedOption) {
        selectedOption.selected = true;
        this._selectedOptions.push(selectedOption);
      }

      this._selectedOptionsValues.push(
        selectedOption ? selectedOption.value : newValue
      );

      this._mainSelectedOption = selectValues.filter((x) => x.selected)[0];

      this._handleMainLabel();
    } else {
      this._mainSelectedOption = undefined;
      this._handleInputValue('');
    }
    this.totalSelectedOptions = this._selectedOptionsValues.length - 1;
  }

  /**
   * Handles the label text shown inside the input
   */
  private _handleMainLabel(): void {
    const selectValues = this._selectOptions?.toArray();

    if (this.multipleValueAppearence === 'short') {
      if (this._mainSelectedOption) {
        const label = this._optionsLabels.find(
          (x) => x.value === this._mainSelectedOption.value
        );
        this._handleInputValue(label.label);
      } else if (this._selectedOptionsValues[0]) {
        const label = this._optionsLabels.find(
          (x) => x.value === this._selectedOptionsValues[0]
        );
        this._handleInputValue(
          label ? label.label : this._selectedOptionsValues[0].toString()
        );
      }
    } else {
      let innerTexts = [];
      let valuesOfSelected = [];
      const selectedOptions = selectValues.filter((x) => x.selected);

      selectedOptions.forEach((x) => {
        innerTexts.push(x.elementRef.nativeElement.innerText);
        valuesOfSelected.push(x.value);
      });

      if (this._selectedOptionsValues.length > valuesOfSelected.length) {
        const notIncludedOptions = this._selectedOptionsValues.filter(
          (x) => !valuesOfSelected.includes(x)
        );

        notIncludedOptions.forEach((x) => {
          const actualLabel = this._optionsLabels.find((y) => y.value === x);
          if (actualLabel) {
            innerTexts.push(actualLabel.label);
          } else {
            innerTexts.push(x);
          }
        });
      }

      this._handleInputValue(innerTexts.join(', '));
    }
  }

  /**
   * Handles selection of single option
   */
  private _selectSingleOnly(value: any): void {
    const selectOptions = this._selectOptions?.toArray();
    selectOptions?.map((option) => (option.selected = false));

    const selectedOption = selectOptions?.find((x) => x.value === value);

    if (selectedOption) {
      selectedOption.selected = true;
      this._mainSelectedOption = selectedOption;
      if (value) {
        this._handleInputValue(
          selectedOption.elementRef.nativeElement.innerText
        );
      } else {
        this._handleInputValue(null);
      }
    } else {
      this._mainSelectedOption = undefined;
      if (!value) {
        this._handleInputValue(null);
      } else {
        const label = this._optionsLabels.find((x) => x.value === value);
        this._handleInputValue(label ? label.label : value.toString());
      }
    }
  }

  /**
   * Handles selection of multiple options
   */
  private _selectMultipleValue(value: any): void {
    const selectOptions = this._selectOptions?.toArray();

    const selectedOption = selectOptions?.find((x) => x.value === value);

    if (selectedOption || value) {
      if (
        !this._selectedOptionsValues.includes(value) &&
        !this._selectedOptions.includes(selectedOption)
      ) {
        if (selectedOption && !selectedOption?.selected) {
          selectedOption.selected = true;
          this._selectedOptions.push(selectedOption);
        }

        this._selectedOptionsValues.push(
          selectedOption ? selectedOption.value : value
        );
      } else {
        if (selectedOption && selectedOption?.selected)
          selectedOption.selected = false;

        const selectedOptionIndex = this._selectedOptions?.findIndex(
          (x) => x?.value === value
        );

        const selectedOptionValueIndex = this._selectedOptionsValues?.findIndex(
          (x) => x === value
        );

        this._selectedOptions.splice(selectedOptionIndex, 1);
        this._selectedOptionsValues.splice(selectedOptionValueIndex, 1);
      }
      this._mainSelectedOption = selectOptions.filter((x) => x.selected)[0];

      this._handleMainLabel();
    } else {
      this._mainSelectedOption = undefined;
      this._handleInputValue('');
    }
    this.totalSelectedOptions = this._selectedOptionsValues.length - 1;
  }

  /**
   * Sets the text in the input
   */
  private _handleInputValue(showValue: string): void {
    const mainInput = this._mainInput?.nativeElement;

    if (mainInput) mainInput.value = showValue;
  }

  /**
   * Handles the custom positioning on menu
   */
  private _setPositioning(): void {
    this._changeDetectorRef.detectChanges();

    // Gets the closest fieldset element to be able to know input's width.
    // and also gets input's DOMRect allowing for top, left and width values to be used.
    const mainInputRect = this._getPositions(this._mainInput.nativeElement);
    const fiedsetElement = this._mainInput?.nativeElement.closest(
      '.fieldset'
    ) as HTMLElement;

    // Select menu is declared here, to be used on top calcuation.
    const selectMenu = this._selectMenu.nativeElement;

    // Gets the main option, beign the first option on the list, or the first selected option on the list
    // this is used later to calculate the translation Y value
    let mainOption: HTMLElement;
    if (this._mainSelectedOption) {
      mainOption = this._mainSelectedOption.elementRef.nativeElement;
    } else {
      mainOption = this._selectOptions.toArray()[0].elementRef.nativeElement;
    }

    // Gets the offset height of the main option
    const mainOptionHeight = mainOption.offsetHeight;

    // Declares the actual content of the select menu
    const selectContent = this._selectMenuBody.nativeElement as HTMLElement;

    // Calculates the "top" css value, dividing the value of the subtraction between the main option's height and
    // the input's offset height by two, and then subtracting that value from the top value of the inputRect
    // correctly calculates the positioning based on the selected value
    let topPositioning =
      mainInputRect.top -
      (mainOptionHeight - this._mainInput.nativeElement.offsetHeight) / 2;

    // Calculates the "translateY" css value, by subtracting the scrollTop value of the menu content from the main option's
    // offsetTop, it correctly calculates how much the menu shall translate vertically to acomodate the option's text,
    // independent of it's scrolling position, to the input text
    let translatePositioning = Math.abs(
      mainOption.offsetTop - selectContent.firstElementChild.scrollTop
    );

    // Gets the real distance between the select menu and the top of the viewport
    const realDistanceToTopViewPort = topPositioning - translatePositioning;

    // Sets the transform origin for animation purposes
    // selectContent.style.transformOrigin = ;
    this._renderer2.setStyle(
      selectContent,
      'transformOrigin',
      `50% ${translatePositioning + 9}px 0px`
    );

    // Calculates the amount of pixels missing between the input's width and fiedset's width
    let widthDifference = fiedsetElement.offsetWidth - mainInputRect.width;

    // Gets the "translateX" css value, by getting the offsetTop of the <span> element in the menu
    let horizontalTranslateValue = (
      mainOption.firstChild.lastChild as HTMLElement
    ).offsetLeft;

    // Checks to see if the select menu is not overflowing to the left side of the viewport
    if (mainInputRect.left - horizontalTranslateValue <= 0) {
      horizontalTranslateValue -= Math.abs(
        mainInputRect.left - horizontalTranslateValue
      );
    }

    // Adds the horizontalTranslate value to the widthDifference, to fill the remaining space
    widthDifference += horizontalTranslateValue;

    // Checks if the real distance is not overflowing outside of the top of the viewport
    if (realDistanceToTopViewPort <= 0) {
      topPositioning = 0;
      translatePositioning = 0;
    }

    // Checks if the real distance is not overflowing outside of the bottom of the viewport
    if (
      realDistanceToTopViewPort + selectMenu.offsetHeight >=
      window.innerHeight
    ) {
      topPositioning = window.innerHeight - selectMenu.offsetHeight;
      translatePositioning = 0;
    }

    this._renderer2.setStyle(selectContent, 'top', topPositioning + 'px');
    this._renderer2.setStyle(selectContent, 'left', mainInputRect.left + 'px');
    this._renderer2.setStyle(
      selectContent,
      'transform',
      `translateY(-${translatePositioning}px) translateX(-${horizontalTranslateValue}px)`
    );

    this._renderer2.setStyle(
      selectContent,
      'width',
      mainInputRect.width + widthDifference + 'px'
    );
  }

  /**
   * Centers selected option in select
   */
  private _centerSelectedOption(): void {
    this._changeDetectorRef.detectChanges();
    if (this._mainSelectedOption) {
      const scrollContainerMaxHeight = +getComputedStyle(
        this._selectMenuBody.nativeElement.firstElementChild
      ).maxHeight.match(/(\d+)/)[0];

      const scrollContainerHeight =
        this._selectMenuBody.nativeElement.offsetHeight;

      if (scrollContainerMaxHeight === scrollContainerHeight) {
        const scrollOpt: ScrollIntoViewOptions = {
          behavior: 'auto',
          block: 'center',
          inline: 'nearest',
        };
        this._mainSelectedOption.elementRef.nativeElement.scrollIntoView(
          scrollOpt
        );
      }
    }
  }

  /**
   * Creates and sets a backdrop DOM element
   */
  private _setBackdrop(): void {
    const backdrop = document.createElement('div') as HTMLElement;
    backdrop.classList.add('backdrop');

    backdrop.addEventListener('click', this.closeSelectMenu, { passive: true });

    document.body.insertAdjacentElement('beforeend', backdrop);
  }

  /**
   * Removes the click event listener and destroys the backdrop DOM element
   */
  private _removeBackdrop(): void {
    const backdrop = document.body.querySelector('.backdrop') as HTMLElement;

    if (backdrop) {
      backdrop.removeEventListener('click', this.closeSelectMenu);
      backdrop.remove();
    }
  }

  /**
   * Sets the menu element to outside the scope of the current component
   */
  private _setMenuToBody(): void {
    let documentDOM = document.body.querySelector(
      '.p-components-container'
    ) as HTMLElement;

    if (!documentDOM) documentDOM = document.body;

    documentDOM.appendChild(this._selectMenu.nativeElement);
  }

  /**
   * Returns rect value of an element
   */
  private _getPositions(element: any): DOMRect {
    return element.getBoundingClientRect();
  }

  ngOnDestroy(): void {
    this._changeDetectorRef.markForCheck();
    this._selectMenu?.nativeElement?.remove();
    this._currentChangeSubscriber.unsubscribe();
    this._removeBackdrop();
  }
}

@Component({
  selector: 'app-select-option, p-option',
  template: ` <button
    class="p_select_option"
    [class.option_selected]="selected"
    pRipple
    [value]="value"
    [disabled]="disabled"
    [pRippleDisabled]="disabled || noRipple"
    [attr.aria-value]="value"
    [attr.aria-disabled]="disabled"
    (click)="disabled ? false : handleSelect()"
  >
    <p-checkbox
      [color]="'var(--primary)'"
      [(checked)]="selected"
      [disabled]="disabled"
      *ngIf="parentComponent.multiple"
    ></p-checkbox>
    <span>
      <ng-content></ng-content>
    </span>
  </button>`,
})
export class SelectOptionComponent implements OnInit {
  /**
   * Value of the select option
   */
  @Input()
  value: any;

  /**
   * Disable select option
   */
  @CoerceBoolean()
  @Input()
  disabled?: boolean;

  /**
   * Removes ripple effect from select option
   */
  @CoerceBoolean()
  @Input()
  noRipple?: boolean;

  /**
   * Selects the option
   */
  public selected?: boolean;

  constructor(
    public parentComponent: SelectComponent,
    public elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    if (!this.value) {
      this.value = this.elementRef.nativeElement.textContent;
    }
  }

  public handleSelect(): void {
    if (this.parentComponent.multiple) {
      this.selected = !this.selected;
      this.parentComponent.setMultipleValue(this.value);
    } else {
      this.parentComponent.setSingleValue(this.value);
    }
  }
}

type MultipleValueAppearence = 'extend' | 'short';

class SelectLabelData {
  value: any;
  label: string;
}
