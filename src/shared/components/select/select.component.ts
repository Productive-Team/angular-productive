import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';

const labelActive = [];
@Directive({
  selector: '[app-select], [p-select], [pSelect]',
})
export class SelectDirective implements OnInit {
  constructor(private el: ElementRef, private comp: SelectComponent) {}
  ngOnInit(): void {
    // this.createCustomSelect();
  }

  @HostListener('focus', ['$event']) onFocus(event) {
    const input = event.target as HTMLInputElement;
    const label = document.getElementById(
      input.id + '-label'
    ) as HTMLDivElement;
    label.classList.add('active');
  }
  @HostListener('focusout', ['$event']) onFocusOut(event) {
    setTimeout(() => {
      const input = event.target as HTMLInputElement;
      const activeInp = labelActive.find((x) => x === input);
      const label = document.getElementById(
        input.id + '-label'
      ) as HTMLDivElement;
      if (
        (input.value === '' && activeInp === undefined) ||
        (input.value === undefined && activeInp === undefined) ||
        (input.value === null && activeInp === undefined)
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
})
export class SelectComponent implements OnInit, AfterViewInit {
  @Input() pSelectLabelText: string;
  @Input() pSelectId: string;
  @Input() labelIconRight: string;
  @Input() labelIconLeft: string;
  @Input() hasHelperText = false;
  @Input() helperState: string;
  @Input() helperText: string;
  @Input() pSelectItems: SelectModel[];
  @Input() pSelectAll = false;
  @Input() pSingleSelect = true;
  @Input() pSelectSearch = false;
  @Input() pSelectInputType: string;

  @Output() pSingleSelectedItem = new EventEmitter<SelectModel>();
  @Output() pMultipleSelectedItem = new EventEmitter<SelectModel[]>();

  isOpen = false;
  allAreSelected = false;
  filteredItems: SelectModel[];
  filterValue: string;
  private selArr = [];
  private selTxtArr = [];

  constructor() {}

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
  }

  filterInArray(value: string): void {
    // TODO: proper in-array filteting
    if (value.length > 0) {
      this.filteredItems = this.filteredItems.filter((x) =>
        x.option.includes(value)
      );
    } else {
      this.filteredItems = this.pSelectItems;
    }
  }

  setInputValue(item: SelectModel): void {
    const input = document.querySelector(
      '#' + this.pSelectId
    ) as HTMLInputElement;
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
  }

  setMultipleSelectedValues(item: SelectModel): void {
    const input = document.querySelector(
      '#' + this.pSelectId
    ) as HTMLInputElement;
    if (item.isChecked) {
      this.selArr.push(item);
      this.selTxtArr.push(item.option);
      input.value = this.selTxtArr.join(', ');
    } else {
      const dupItm = this.selArr.find((x) => x === item);
      const dupTxt = this.selTxtArr.find((x) => x === item.option);
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

export class SelectModel {
  id: any;
  option: any;
  isDisabled?: boolean;
  isChecked?: boolean;
}
