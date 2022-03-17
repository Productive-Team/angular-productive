import {
  state,
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
import {
  AfterContentInit,
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';

const selectMenuAnimation = trigger('menuAnimation', [
  transition(':enter', [
    style({
      opacity: 0,
    }),
    animate(
      '150ms cubic-bezier(0,0,0.8,1)',
      style({
        opacity: 1,
      })
    ),
  ]),
  transition(':leave', [
    animate('100ms cubic-bezier(0,0,0.8,1)', style({ opacity: 0 })),
  ]),
]);

@Component({
  selector: 'app-select-ref',
  templateUrl: './select-ref.component.html',
  animations: [selectMenuAnimation],
})
export class SelectRefComponent
  implements AfterContentInit, OnDestroy, OnChanges, AfterViewChecked
{
  menuOpen: boolean;

  /**
   * Adds a placeholder text to the select input
   */
  @Input() placeholder: string = '';
  /**
   * Adds a search bar to the top of the select menu, that lets the user filter through option title and value
   */
  @Input() search: boolean;
  /**
   * The mode of the select input, accepts either 'single' or 'multiple' values
   */
  @Input() selectMode: SelectMode = 'single';
  /**
   * The mode that shows the selected options when the input is set to multiple
   *
   * Can be either length or extend
   */
  @Input() selectMultipleInputMode: SelectMultipleInputMode = 'length';
  /**
   * Adds a checkbox that selects all the options avaliable for multi-select, except disabled options
   */
  @Input() selectAllForMultiple: boolean;

  /**
   * Creates options based on SelectData array
   */
  @Input() selectData: SelectData[] = [];

  /**
   * The current value of the select component
   */
  @Input() selectValue: any;
  /**
   * Change event for when the value changes
   */
  @Output() selectValueChange: EventEmitter<any> = new EventEmitter<any>();

  @ContentChildren(forwardRef(() => SelectOptComponent))
  projectedSelectOptions: QueryList<SelectOptComponent>;

  selectGeneratedOptions: QueryList<SelectOptComponent>;
  @ViewChildren(forwardRef(() => SelectOptComponent)) set content(
    content: QueryList<SelectOptComponent>
  ) {
    if (content) {
      this.selectGeneratedOptions = content;
      this.allSelectOptions = this.selectGeneratedOptions.toArray();
    }
  }

  allSelectOptions: SelectOptComponent[] = [];

  mainSelectedOption: SelectOptComponent;
  allSelectedOption: SelectOptComponent[];

  @ViewChild('selectMenu') menuWrapper: ElementRef<HTMLElement>;
  @ViewChild('valueInput') valueInput: ElementRef<HTMLInputElement>;

  styleString: string;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterContentInit(): void {
    this.setMenuToGlobalContainer();
    this.changeDetectorRef.detectChanges();
    this.allSelectOptions = this.projectedSelectOptions.toArray();
  }

  openSelectMenu(): void {
    this.menuOpen = true;
    this.changeDetectorRef.detectChanges();
    this.scrollOptionIntoView();
    this.setBackdrop();
    this.setSelectMenuPositioning();
  }

  closeSelectMenu(): void {
    this.menuOpen = false;
    this.removeBackdrop();
  }

  handleSingleSelect(selectedOption?: SelectOptComponent): void {
    const previouslySelected = this.allSelectOptions.find((x) => x.selected);
    if (previouslySelected) {
      previouslySelected.selected = false;
    }
    if (selectedOption) {
      selectedOption.selected = true;
      this.selectValueChange.emit(selectedOption.value);
    } else {
      this.selectValueChange.emit(this.selectValue);
    }
    this.mainSelectedOption = selectedOption;

    this.setInputShowValue();

    if (this.menuOpen) {
      this.closeSelectMenu();
    }
  }

  handleMultipleSelect(selectedOption: SelectOptComponent): void {
    if (selectedOption) {
      selectedOption.selected = !selectedOption.selected;
    }
    setTimeout(() => {
      const allSelectedOptions = this.allSelectOptions.filter(
        (x) => x.selected
      );
      this.allSelectedOption = allSelectedOptions;
      let allSelectedValues = [];
      this.allSelectedOption.forEach((x) => {
        allSelectedValues.push(x.value);
      });
      this.mainSelectedOption = this.allSelectedOption[0];
      this.setInputShowValue();

      this.selectValueChange.emit(allSelectedValues);
    }, 0);
  }

  setInputShowValue(): void {
    const input = this.valueInput.nativeElement;
    if (this.selectMode === 'multiple') {
      if (this.selectMultipleInputMode === 'extend') {
        let allValues = [];
        this.allSelectedOption.forEach((x) => {
          allValues.push(x.elementRef.nativeElement.textContent);
        });
        input.value = allValues.join(', ');
      } else {
        input.value =
          this.mainSelectedOption?.elementRef.nativeElement.textContent;
        if (!this.mainSelectedOption?.value) {
          input.value = '';
        }
      }
    } else {
      input.value =
        this.mainSelectedOption?.elementRef.nativeElement.textContent;
      if (!this.mainSelectedOption?.value) {
        input.value = '';
      }
    }
  }

  setMenuToGlobalContainer(): void {
    setTimeout(() => {
      const globalContainer = document.querySelector('.p-components-container');
      globalContainer.insertAdjacentElement(
        'beforeend',
        this.menuWrapper.nativeElement
      );
    }, 0);
  }

  setBackdrop(): void {
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    backdrop.addEventListener('click', () => {
      this.closeSelectMenu();
    });
    document.body.insertAdjacentElement('beforeend', backdrop);
  }

  removeBackdrop(): void {
    const backdrop = document.querySelector('.backdrop');
    backdrop.remove();
  }

  setSelectMenuPositioning(): void {
    // Creates an empty string to store future styling values.
    let styleString = '';

    // Gets the closest fieldset element to be able to know input's width.
    // and also gets input's DOMRect allowing for top, left and width values to be used.
    const inputRect = this.getPositions(this.valueInput.nativeElement);
    const fiedsetElement = this.elementRef.nativeElement.closest(
      '.fieldset'
    ) as HTMLElement;

    // Select menu is declared here, to be used on top calcuation.
    const menu = this.menuWrapper.nativeElement;

    // Gets the main option, beign the first option on the list, or the first selected option on the list
    // this is used later to calculate the translation Y value
    let mainOption: HTMLElement;
    if (this.mainSelectedOption) {
      mainOption = this.mainSelectedOption.elementRef.nativeElement;
    } else {
      mainOption = this.allSelectOptions[0].elementRef.nativeElement;
    }

    // Gets the offset height of the main option
    const mainOptionHeight = mainOption.offsetHeight;

    // Declares the actual content of the select menu
    const selectContent = this.menuWrapper.nativeElement
      .firstChild as HTMLElement;

    // Calculates the "top" css value, dividing the value of the subtraction between the main option's height and
    // the input's offset height by two, and then subtracting that value from the top value of the inputRect
    // correctly calculates the positioning based on the selected value
    let topPositioning =
      inputRect.top -
      (mainOptionHeight - this.valueInput.nativeElement.offsetHeight) / 2;

    // Calculates the "translateY" css value, by subtracting the scrollTop value of the menu content from the main option's
    // offsetTop, it correctly calculates how much the menu shall translate vertically to acomodate the option's text,
    // independent of it's scrolling position, to the input text
    let translatePositioning = Math.abs(
      mainOption.offsetTop - selectContent.scrollTop
    );

    // Gets the real distance between the select menu and the top of the viewport
    const realDistanceToTopViewPort = topPositioning - translatePositioning;

    // Sets the transform origin for animation purposes
    selectContent.style.transformOrigin = `50% ${
      translatePositioning + 9
    }px 0px`;

    // Calculates the amount of pixels missing between the input's width and fiedset's width
    let widthDifference = fiedsetElement.offsetWidth - inputRect.width;

    // Gets the "translateX" css value, by getting the offsetTop of the <span> element in the menu
    let horizontalTranslateValue = (
      mainOption.firstChild.lastChild as HTMLElement
    ).offsetLeft;

    // Checks to see if the select menu is not overflowing to the left side of the viewport
    if (inputRect.left - horizontalTranslateValue <= 0) {
      horizontalTranslateValue -= Math.abs(
        inputRect.left - horizontalTranslateValue
      );
    }

    // Adds the horizontalTranslate value to the widthDifference, to fill the remaining space
    widthDifference += horizontalTranslateValue;

    // Checks if the real distance is not overflowing outside of the top of the viewport
    if (realDistanceToTopViewPort <= 0) {
      topPositioning = 0;
      translatePositioning = -24;
    }

    // Checks if the real distance is not overflowing outside of the bottom of the viewport
    if (realDistanceToTopViewPort + menu.offsetHeight >= window.innerHeight) {
      topPositioning = window.innerHeight - menu.offsetHeight;
      translatePositioning = -24;
    }

    // Sets all styles to the previously declared styleString
    styleString = `
      top: ${topPositioning}px;
      left: ${inputRect.left}px;
      transform: translateX(${
        mainOption.offsetWidth - horizontalTranslateValue
      }px) translateY(-${translatePositioning + 24}px);
      width: ${inputRect.width + widthDifference}px;
    `;

    // Sets private let variable to global variable, to properly set it in the select menu
    this.styleString = styleString;
  }

  scrollOptionIntoView(): void {
    if (this.mainSelectedOption) {
      const containerMaxHeight = Number(
        getComputedStyle(
          this.mainSelectedOption?.elementRef.nativeElement.parentElement
            .parentElement
        ).maxHeight.substring(0, 3)
      );

      const containerHeight =
        this.mainSelectedOption?.elementRef.nativeElement.parentElement
          .parentElement.offsetHeight;
      if (containerMaxHeight === containerHeight) {
        const element = this.mainSelectedOption.elementRef
          .nativeElement as HTMLElement;
        const scrollOpt: ScrollIntoViewOptions = {
          behavior: 'auto',
          block: 'center',
          inline: 'nearest',
        };
        element.scrollIntoView(scrollOpt);
      }
    }
  }

  private getPositions(element: any): DOMRect {
    return element.getBoundingClientRect();
  }

  ngOnChanges(event: SimpleChanges): void {
    if (event.selectValue !== undefined) {
      if (!event.selectValue?.isFirstChange()) {
        if (this.selectMode === 'single') {
          const selectedOption = this.allSelectOptions.find(
            (x) => x.value === event.selectValue.currentValue
          );
          this.handleSingleSelect(selectedOption);
        } else {
          const isArray = Array.isArray(event.selectValue.currentValue);
          let allSelectOptions = [];
          if (isArray) {
            event.selectValue.currentValue.forEach((x) => {
              const option = this.allSelectOptions.find((c) => c.value === x);
              allSelectOptions.push(option);
            });
          } else {
            allSelectOptions = [
              this.allSelectOptions.find(
                (x) => x.value === event.selectValue.currentValue
              ),
            ];
          }
          allSelectOptions.forEach((c) => {
            if (c?.selected) {
              c.selected = false;
            }
            this.handleMultipleSelect(c);
          });
        }
      }
    }
  }

  ngAfterViewChecked(): void {
    this.projectedSelectOptions.changes.subscribe(
      (queryList: QueryList<SelectOptComponent>) => {
        if (queryList) {
          this.allSelectOptions = queryList.toArray();
        }
      }
    );
  }

  @HostBinding('class.p-select-focusable')
  get DefaultClass(): boolean {
    return true;
  }

  ngOnDestroy(): void {
    this.menuWrapper.nativeElement.remove();
  }
}

@Component({
  selector: 'app-opt',
  template: `
    <div
      pRipple
      class="p-select-opt-new"
      [pRippleDisabled]="disabled"
      [class.selected]="selected"
      [class.disabled]="disabled"
      [attr.aria-value]="value"
      [attr.disabled]="disabled"
      (click)="disabled ? false : selectOption()"
    >
      <p-checkbox
        class="no-click-events"
        *ngIf="selectComponent.selectMode === 'multiple'"
        color="var(--primary)"
        (click)="(false)"
        [checked]="selected"
        [disabled]="disabled"
      ></p-checkbox>
      <span>
        <ng-content></ng-content>
      </span>
    </div>
  `,
})
export class SelectOptComponent implements OnInit {
  /**
   * Value of the select option
   */
  @Input() value: any;
  /**
   * Sets the option to be disabled
   */
  @Input() disabled: boolean;
  selected: boolean;

  constructor(
    public elementRef: ElementRef<HTMLElement>,
    public selectComponent: SelectRefComponent
  ) {}

  ngOnInit(): void {
    if (this.value === undefined) {
      this.value = this.elementRef.nativeElement.textContent;
    }
  }

  selectOption(): void {
    if (this.selectComponent.selectMode === 'single') {
      this.selectSingle();
    } else {
      this.selectMultiple();
    }
  }

  selectSingle(): void {
    this.selectComponent.handleSingleSelect(this);
  }

  selectMultiple(): void {
    this.selectComponent.handleMultipleSelect(this);
  }
}

type SelectMode = 'single' | 'multiple';
type SelectMultipleInputMode = 'length' | 'extend';

export class SelectData {
  value: any;
  label: string;
}
