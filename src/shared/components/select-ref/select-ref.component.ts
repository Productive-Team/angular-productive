import {
  state,
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
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
  styleUrls: ['./select-ref.component.css'],
  animations: [selectMenuAnimation],
})
export class SelectRefComponent implements AfterContentInit, OnDestroy {
  menuOpen: boolean;

  @Input() placeholder: string = '';
  @Input() search: boolean;
  @Input() selectMode: SelectMode = 'single';
  @Input() selectMultipleInputMode: SelectMultipleInputMode = 'length';
  @Input() selectAllForMultiple: boolean;

  @Input() selectData: SelectData[] = [];

  @Input() selectValue: any;
  @Output() selectValueChange: EventEmitter<any> = new EventEmitter<any>();

  @ContentChildren(forwardRef(() => SelectOptComponent))
  projectedSelectOptions: QueryList<SelectOptComponent>;

  allSelectOptions: SelectOptComponent[] = [];

  mainSelectedOption: SelectOptComponent;
  allSelectedOption: SelectOptComponent[];

  @ViewChild('selectMenu') menuWrapper: ElementRef<HTMLElement>;
  @ViewChild('valueInput') valueInput: ElementRef<HTMLInputElement>;

  styleString: string;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngAfterContentInit(): void {
    this.setMenuToGlobalContainer();
    setTimeout(() => {
      console.log(this.projectedSelectOptions);
    }, 0);
    this.allSelectOptions = this.projectedSelectOptions.toArray();
  }

  openSelectMenu(): void {
    this.menuOpen = true;
    this.scrollOptionIntoView();
    this.setBackdrop();
    setTimeout(() => {
      this.setSelectMenuPositioning();
    }, 0);
  }
  closeSelectMenu(): void {
    this.menuOpen = false;
    this.removeBackdrop();
  }

  handleSingleSelect(selectedOption: SelectOptComponent): void {
    const previouslySelected = this.allSelectOptions.find((x) => x.selected);
    if (previouslySelected) {
      previouslySelected.selected = false;
    }
    selectedOption.selected = true;
    this.mainSelectedOption = selectedOption;
    this.setInputShowValue();

    this.selectValueChange.emit(selectedOption.value);

    this.closeSelectMenu();
  }

  handleMultipleSelect(selectedOption: SelectOptComponent): void {
    selectedOption.selected = !selectedOption.selected;

    const allSelectedOptions = this.allSelectOptions.filter((x) => x.selected);
    this.allSelectedOption = allSelectedOptions;
    let allSelectedValues = [];
    this.allSelectedOption.forEach((x) => {
      allSelectedValues.push(x.value);
    });
    this.mainSelectedOption = this.allSelectedOption[0];
    this.setInputShowValue();

    this.selectValueChange.emit(allSelectedValues);
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
          this.mainSelectedOption.elementRef.nativeElement.textContent;
      }
    } else {
      input.value =
        this.mainSelectedOption.elementRef.nativeElement.textContent;
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
    setTimeout(() => {
      if (this.mainSelectedOption) {
        const element = this.mainSelectedOption.elementRef
          .nativeElement as HTMLElement;
        const scrollOpt: ScrollIntoViewOptions = {
          behavior: 'auto',
          block: 'center',
          inline: 'nearest',
        };
        element.scrollIntoView(scrollOpt);
      }
    }, 0);
  }

  private getPositions(element: any): DOMRect {
    return element.getBoundingClientRect();
  }

  @HostBinding('class.p-select-focusable')
  get DefaultClass() {
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
      [class.selected]="selected"
      [attr.aria-value]="value"
      [attr.disabled]="disabled"
      (click)="selectOption()"
    >
      <p-checkbox
        class="no-click-events"
        *ngIf="selectComponent.selectMode === 'multiple'"
        color="var(--primary)"
        (click)="(false)"
        [checked]="selected"
      ></p-checkbox>
      <span>
        <ng-content></ng-content>
      </span>
    </div>
  `,
})
export class SelectOptComponent implements OnInit {
  @Input() value: any;
  @Input() disabled: boolean;
  selected: boolean;

  constructor(
    public elementRef: ElementRef<HTMLElement>,
    public selectComponent: SelectRefComponent
  ) {}

  ngOnInit(): void {
    if (!this.value) {
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
