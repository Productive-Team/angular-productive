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
  constructor() {}

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
    let styleString = '';

    const inputRect = this.getPositions(this.valueInput.nativeElement);
    const menu = this.menuWrapper.nativeElement;

    // menu.style.left = inputRect.left + 'px';

    let mainOption: HTMLElement;
    if (this.mainSelectedOption) {
      mainOption = this.mainSelectedOption.elementRef.nativeElement;
    } else {
      mainOption = this.allSelectOptions[0].elementRef.nativeElement;
    }

    const mainOptionHeight = mainOption.offsetHeight;

    const selectContent = this.menuWrapper.nativeElement
      .firstChild as HTMLElement;

    let topPositioning =
      inputRect.top -
      (mainOptionHeight - this.valueInput.nativeElement.offsetHeight) / 2;

    let translatePositioning = Math.abs(
      mainOption.offsetTop - selectContent.scrollTop
    );

    const realDistanceToViewPort = topPositioning - translatePositioning;

    selectContent.style.transformOrigin = `50% ${translatePositioning}px 0px`;
    console.log(mainOption.offsetHeight);

    styleString = `
      top: ${topPositioning}px;
      left: ${inputRect.left}px;
      transform: translateX(${mainOption.offsetWidth - 16}px) translateY(-${
      translatePositioning + 24
    }px);
      width: ${inputRect.width}px;
    `;
    this.styleString = styleString;
    // menu.style.top = `${topPositioning}px`;
    // menu.style.transform = `translateY(-${translatePositioning}px)`;
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
