import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  forwardRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-select-ref',
  templateUrl: './select-ref.component.html',
  styleUrls: ['./select-ref.component.css'],
})
export class SelectRefComponent implements AfterContentInit, OnDestroy {
  menuOpen: boolean;

  @Input() placeholder: string = '';
  @Input() search: boolean;
  @Input() selectMode: SelectMode = 'single';
  @Input() selectAllForMultiple: boolean;

  @Input() selectData: any[] = [];

  @ContentChildren(forwardRef(() => SelectOptComponent))
  projectedSelectOptions: QueryList<SelectOptComponent>;

  allSelectOptions: SelectOptComponent[] = [];

  mainSelectedOption: SelectOptComponent;
  allSelectedOption: SelectOptComponent[];

  @ViewChild('selectMenu') menuWrapper: ElementRef<HTMLElement>;
  @ViewChild('valueInput') valueInput: ElementRef<HTMLInputElement>;
  constructor() {}

  ngAfterContentInit(): void {
    this.setMenuToGlobalContainer();
    this.allSelectOptions = this.projectedSelectOptions.toArray();
  }

  openSelectMenu(): void {
    this.menuOpen = true;
    setTimeout(() => {
      this.setBackdrop();
      this.setSelectMenuPositioning();
    }, 0);
  }
  closeSelectMenu(): void {
    this.menuOpen = false;
    this.removeBackdrop();
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

    const inputRect = this.valueInput.nativeElement.getBoundingClientRect();
    const menu = this.menuWrapper.nativeElement;

    menu.style.left = inputRect.left + 'px';

    let mainOption: SelectOptComponent;
    if (this.mainSelectedOption) {
      mainOption = this.mainSelectedOption;
    } else {
      mainOption = this.allSelectOptions[0];
    }

    const mainOptionHeight = mainOption.elementRef.nativeElement.offsetHeight;

    const selectContent = this.menuWrapper.nativeElement
      .firstChild as HTMLElement;

    let topPositioning =
      inputRect.top -
      (mainOptionHeight - this.valueInput.nativeElement.offsetHeight) / 2;

    let translatePositioning = Math.abs(
      mainOption.elementRef.nativeElement.offsetTop - selectContent.scrollTop
    );

    const realDistanceToViewPort = topPositioning - translatePositioning;

    selectContent.style.transformOrigin = `50% ${
      translatePositioning + 9
    }px 0px`;

    menu.style.top = `${topPositioning}px`;
    menu.style.transform = `translateY(-${translatePositioning}px)`;
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
    const previouslySelectedElement =
      this.selectComponent.allSelectOptions.find((x) => x.selected);
    if (previouslySelectedElement) {
      previouslySelectedElement.selected = false;
    }
    const element = this.selectComponent.allSelectOptions.find(
      (x) => x === this
    );
    element.selected = true;
    this.selected = true;
    this.selectComponent.mainSelectedOption = this;
    this.selectComponent.closeSelectMenu();
  }

  selectMultiple(): void {}
}

type SelectMode = 'single' | 'multiple';
