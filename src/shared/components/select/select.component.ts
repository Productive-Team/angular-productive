import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[app-select], [p-select], [pSelect]',
})
export class SelectDirective implements OnInit {
  constructor(private el: ElementRef, private comp: SelectComponent) {}
  ngOnInit(): void {
    // this.createCustomSelect();
  }

  @HostListener('click', ['$event']) openMenu(event): void {
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
      this.comp.pSelectItems.forEach((x) => {
        if (x.isDisabled) {
          const option = document.querySelectorAll('#option-' + x.id);
          let o = 0;
          for (; o < option.length; o++) {
            option[o].classList.add('disabled');
          }
        }
      });
    }, 0);
    setTimeout(() => {
      document.addEventListener('click', (ev) => {
        const tgt = ev.target as HTMLDivElement;
        if (tgt.classList.contains('backdrop')) {
          this.comp.isOpen = false;
          dropEl.style.opacity = '0';
          setTimeout(() => {
            sel.style.display = 'none';
            backdrop.remove();
          }, 150);
        }
      });
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

  isOpen = false;
  allAreSelected = false;
  private selectedItems = [];

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {}

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

  selectOne(option: SelectModel): void {
    option.isChecked = !option.isChecked;
    const checkbox = document.querySelectorAll('#check-' + option.id);
    let cb = 0;
    for (; cb < checkbox.length; cb++) {
      const check = checkbox[cb] as HTMLInputElement;
      check.checked = !check.checked;
    }
    const selectedItem = this.selectedItems.find((x) => x === option);
    if (selectedItem) {
      const index = this.selectedItems.indexOf(option);
      this.selectedItems.splice(index, index);
    } else {
      this.selectedItems.push(option);
    }
    console.log(this.selectedItems);
  }
}

export class SelectModel {
  id: any;
  option: any;
  isDisabled?: boolean;
  isChecked?: boolean;
}
