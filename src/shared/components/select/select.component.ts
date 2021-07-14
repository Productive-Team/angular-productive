import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const labelActive = [];
@Directive({
  selector: '[app-select], [p-select], [pSelect]',
})
export class SelectDirective {
  constructor(private el: ElementRef, private comp: SelectComponent) {}

  @HostListener('focus', ['$event']) onFocus(event) {
    const input = event.target as HTMLInputElement;
    const label = document.getElementById(
      input.id + '-label'
    ) as HTMLDivElement;
    label.classList.add('active');
  }
  @HostListener('focusout', ['$event']) onFocusOut(event) {
    const input = event.target as HTMLInputElement;
    this.removeActiveFromLabel(input);
  }

  removeActiveFromLabel(input) {
    setTimeout(() => {
      const activeInp = labelActive.find((x) => x === input);
      const label = document.getElementById(
        input.id + '-label'
      ) as HTMLDivElement;
      if (
        (input.value === '' && activeInp === undefined && !this.comp.isOpen) ||
        (input.value === undefined &&
          activeInp === undefined &&
          !this.comp.isOpen) ||
        (input.value === null && activeInp === undefined && !this.comp.isOpen)
      ) {
        label.classList.remove('active');
      }
    }, 150);
  }

  @HostListener('click', ['$event']) openMenu(event): void {
    this.openDropMenu(event);
  }

  openDropMenu(event): void {
    this.comp.isOpen = true;
    const body = document.querySelector('body');
    const sel = document.getElementById(this.comp.pSelectId + '-wrapper');
    const dropEl = document.getElementById(this.comp.pSelectId + '-container');
    dropEl.style.opacity = '1';
    sel.style.display = 'flex';
    this.setWrapperPosition(event.target, event.clientY, sel, dropEl);
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    backdrop.style.backgroundColor = 'transparent';
    body.insertAdjacentElement('beforeend', backdrop);
    setTimeout(() => {
      this.addDisabledClassToOption();
    }, 10);
    setTimeout(() => {
      this.addListenerToCloseMenu(dropEl, sel, backdrop);
    }, 150);
  }

  addDisabledClassToOption(): void {
    this.comp.pSelectItems.forEach((x) => {
      if (x.isDisabled) {
        const option = document.querySelectorAll('#option-' + x.id);
        let o = 0;
        for (; o < option.length; o++) {
          option[o].classList.add('disabled');
        }
      }
    });
  }

  addListenerToCloseMenu(
    dropEl: HTMLElement,
    sel: HTMLElement,
    backdrop: HTMLElement
  ): void {
    document.addEventListener('click', (ev) => {
      const tgt = ev.target as HTMLDivElement;
      if (
        tgt.classList.contains('backdrop') ||
        tgt.classList.contains('p-select-item')
      ) {
        this.comp.isOpen = false;
        dropEl.style.opacity = '0';
        const input = document.getElementById(
          this.comp.pSelectId
        ) as HTMLInputElement;
        this.removeActiveFromLabel(input);
        setTimeout(() => {
          sel.style.display = 'none';
          backdrop.remove();
        }, 250);
      }
    });
  }

  setWrapperPosition(
    target: HTMLElement,
    clientY: number,
    wrapper: HTMLElement,
    dropdownElement: HTMLElement
  ): void {
    const positions = target.getBoundingClientRect();
    const height = window.innerHeight / 1.5;
    wrapper.style.left = null;
    wrapper.style.top = null;
    wrapper.style.bottom = null;
    dropdownElement.style.width = positions.width + 'px';
    if (height > clientY) {
      wrapper.style.left = positions.left + 'px';
      wrapper.style.top = positions.top + 'px';
      dropdownElement.classList.remove('bottom');
      dropdownElement.classList.add('top');
    } else if (height < clientY) {
      wrapper.style.left = positions.left + 'px';
      wrapper.style.bottom =
        height * 1.5 - positions.top - positions.height + 'px';
      dropdownElement.classList.remove('top');
      dropdownElement.classList.add('bottom');
    }
  }
}

@Component({
  selector: 'app-select, p-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements OnInit, AfterViewInit {
  @Input() pSelectLabelText: string;
  @Input() pSelectId: string;
  @Input() labelIconRight: string;
  @Input() labelIconLeft: string;
  @Input() pSelectItems: SelectModel[];
  @Input() pSelectAll = false;
  @Input() pSingleSelect = true;
  @Input() pSelectSearch = false;
  @Input() pSelectInputType: string;
  @Input() pSelectAllText = 'Select All';
  @Input() pDeselectAllText = 'Deselect All';
  @Input() pSelectSearchPlaceholder = 'Search';
  @Input() pSelectSearchNotFoundMessage = 'Not Found';

  @Output() pSingleSelectedItem = new EventEmitter<SelectModel>();
  @Output() pMultipleSelectedItem = new EventEmitter<SelectModel[]>();

  isOpen = false;
  allAreSelected = false;
  filteredItems: SelectModel[];
  filterValue: string;

  selectedItem: any;
  private selArr = [];
  private selTxtArr = [];

  constructor() {}

  change = () => {};
  blur = (_) => {};

  writeValue(obj: any): void {
    this.selectedItem = obj;
  }

  registerOnChange(fn: any): void {
    this.change = fn;
  }

  registerOnTouched(fn: any): void {
    this.blur = fn;
  }

  ngOnInit() {
    this.filteredItems = this.pSelectItems;
  }

  setInputType(): void {
    const input = document.getElementById(this.pSelectId);
    switch (this.pSelectInputType) {
      case 'outlined':
        input.classList.add('outlined');
        break;
      case 'classic':
        input.classList.add('classic');
        break;
      default:
    }
  }

  ngAfterViewInit(): void {
    this.setInputType();
  }

  selectAll(event): void {
    this.allAreSelected = event;
    this.pSelectItems.forEach((x) => {
      x.isChecked = event;
      setTimeout(() => {
        const checkboxes = document.querySelectorAll('#check-' + x.id);
        let c = 0;
        for (; c < checkboxes.length; c++) {
          const check = checkboxes[c] as HTMLInputElement;
          check.checked = event;
        }
      }, 0);
    });
    this.setAllItemsAfterSelectAll(this.pSelectItems);
  }

  setAllItemsAfterSelectAll(item: SelectModel[]): void {
    const input = document.querySelector(
      '#' + this.pSelectId
    ) as HTMLInputElement;
    item.forEach((x) => {
      const dupItm = this.selArr.find((y) => y === x);
      // const dupTxt = this.selTxtArr.find((z) => z === x.option);
      if (x.isChecked && !dupItm) {
        this.selArr.push(x);
        this.selTxtArr.push(x.option);
        input.value = this.selTxtArr.join(', ');
      } else if (!x.isChecked) {
        this.selArr = [];
        this.selTxtArr = [];
        input.value = this.selTxtArr.join('');
        // const indexDup = this.selArr.indexOf(dupItm);
        // const indexTxt = this.selTxtArr.indexOf(dupTxt);
        // if (indexDup === 0) {
        //   this.selArr.splice(0, 1);
        // } else {
        //   this.selArr.splice(indexDup, indexDup);
        // }
        // if (indexTxt === 0) {
        //   this.selTxtArr.splice(0, 1);
        // } else {
        //   this.selTxtArr.splice(indexTxt, indexTxt);
        // }
        // input.value = this.selTxtArr.join(', ');
      }
    });
    this.pMultipleSelectedItem.emit(this.selArr);
  }

  filterInArray(value: string): void {
    let val = '';
    if (value !== undefined) {
      val = value.toUpperCase();
    }
    if (val.length > 0) {
      this.filteredItems = this.pSelectItems.filter((x) =>
        x.option.toUpperCase().includes(val)
      );
    } else {
      this.filteredItems = this.pSelectItems;
    }
    if (!this.pSingleSelect) {
      setTimeout(() => {
        this.selArr.forEach((x) => {
          const checkbox = document.querySelectorAll('#check-' + x.id);
          let cb = 0;
          for (; cb < checkbox.length; cb++) {
            const check = checkbox[cb] as HTMLInputElement;
            check.checked = true;
          }
        });
      }, 0);
    }
  }

  setInputValue(item: SelectModel): void {
    const input = document.getElementById(this.pSelectId) as HTMLInputElement;
    input.value = item.option;
    this.pSingleSelectedItem.emit(item);
  }

  selectOne(option: SelectModel): void {
    option.isChecked = !option.isChecked;
    const checkbox = document.querySelectorAll('#check-' + option.id);
    let cb = 0;
    for (; cb < checkbox.length; cb++) {
      const check = checkbox[cb] as HTMLInputElement;
      check.checked = !check.checked;
    }
    this.setMultipleSelectedValues(option);
    if (this.pSelectAll) {
      const selAllCheckbox = document.getElementById(
        'selAll'
      ) as HTMLInputElement;
      const allOpt = this.pSelectItems.length;
      const selOpt = this.selArr.length;
      if (selOpt === 0) {
        selAllCheckbox.checked = false;
        selAllCheckbox.indeterminate = false;
        this.allAreSelected = false;
      } else if (allOpt === selOpt) {
        selAllCheckbox.checked = true;
        selAllCheckbox.indeterminate = false;
        this.allAreSelected = true;
      } else if (selOpt < allOpt) {
        selAllCheckbox.checked = false;
        selAllCheckbox.indeterminate = true;
        this.allAreSelected = false;
      }
    }
  }

  setMultipleSelectedValues(item: SelectModel): void {
    const input = document.querySelector(
      '#' + this.pSelectId
    ) as HTMLInputElement;
    const dupItm = this.selArr.find((x) => x === item);
    const dupTxt = this.selTxtArr.find((x) => x === item.option);
    if (item.isChecked && !dupItm) {
      this.selArr.push(item);
      this.selTxtArr.push(item.option);
      input.value = this.selTxtArr.join(', ');
    } else {
      const indexDup = this.selArr.indexOf(dupItm);
      const indexTxt = this.selTxtArr.indexOf(dupTxt);
      if (indexDup === 0) {
        this.selArr.splice(0, 1);
      } else {
        this.selArr.splice(indexDup, indexDup);
      }
      if (indexTxt === 0) {
        this.selTxtArr.splice(0, 1);
      } else {
        this.selTxtArr.splice(indexTxt, indexTxt);
      }
      input.value = this.selTxtArr.join(', ');
    }
    this.pMultipleSelectedItem.emit(this.selArr);
  }
}

@Component({
  selector: 'app-option, p-option',
  styleUrls: ['./select.component.css'],
  template: ` <button
    [value]="value"
    class="p-select-option"
    pRipple
    (click)="exvalexport($event.target.value)"
  >
    <ng-content></ng-content>
  </button>`,
})
export class SelectOptionComponent {
  @Input() value: any;
  constructor() {}

  exvalexport(value) {
    console.log(value);
  }
}

export class SelectModel {
  id: any;
  option: any;
  isDisabled?: boolean;
  isChecked?: boolean;
}
