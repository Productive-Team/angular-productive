import { SelectModel } from './../../shared/components/select/select.component';
import { ModalComponent } from './../../shared/components/modal/modal.component';
import { SnackbarService } from './../../shared/services/snackbar.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-components',
  templateUrl: './all-components.component.html',
  styleUrls: ['./all-components.component.css'],
})
export class AllComponentsComponent implements OnInit {
  center = false;
  unbound = false;
  disabled = false;
  color: string;
  radius: number;

  snackTxt: string;
  snackDur: number;
  snackPosY: string;
  snackPosX: string;
  snackBtn = false;
  snackBtnTxt: string;

  tooltipPos = 'bottom';
  tooltipTxt = 'Tooltip';
  tooltipOnClick = false;
  tooltipClickDuration: number;

  testSelArr = [
    { id: 1, option: 'Option 1' },
    { id: 2, option: 'Option 2' },
    { id: 3, option: 'Option 3' },
    { id: 4, option: 'Disabled Option', isDisabled: true },
  ];
  testSelAllArr = [
    { id: 5, option: 'Option 1 Multi' },
    { id: 6, option: 'Option 2 Multi' },
    { id: 7, option: 'Option 3 Multi' },
    { id: 8, option: 'Option 4 Multi Disabled', isDisabled: true },
  ];

  singSel = '';
  selectItms: SelectModel[];
  constructor(private snackbar: SnackbarService) {}

  ngOnInit() {}

  centerA(event) {
    this.center = event;
  }
  unboundA(event) {
    this.unbound = event;
    const rip = document.querySelector('.ripple-example') as HTMLDivElement;
    if (this.unbound) {
      rip.classList.add('p-ripple-unbounded');
    } else {
      rip.classList.remove('p-ripple-unbounded');
    }
  }
  disableA(event) {
    this.disabled = event;
  }

  checkDis(event): void {
    const check = document.getElementById('Check2') as HTMLInputElement;
    if (event) {
      check.parentElement.parentElement.classList.add(
        'checkbox-layout-disabled'
      );
      check.disabled = true;
    } else {
      check.parentElement.parentElement.classList.remove(
        'checkbox-layout-disabled'
      );
      check.disabled = false;
    }
  }
  checkChk(event): void {
    const check = document.getElementById('Check2') as HTMLInputElement;
    check.checked = event;
  }
  checkInt(event): void {
    const check = document.getElementById('Check2') as HTMLInputElement;
    check.indeterminate = event;
  }

  switchDis(event): void {
    const switc = document.getElementById('Check') as HTMLInputElement;
    if (event) {
      switc.parentElement.parentElement.parentElement.classList.add(
        'checkbox-layout-switch-disabled'
      );
    } else {
      switc.parentElement.parentElement.parentElement.classList.remove(
        'checkbox-layout-switch-disabled'
      );
    }
  }
  switchChk(event): void {
    const swit = document.getElementById('Check') as HTMLInputElement;
    swit.checked = event;
  }

  snackBtnChg(event): void {
    this.snackBtn = event;
  }

  openSnack(): void {
    if (!this.snackTxt) {
      this.snackTxt = 'Snackbar Text';
    }
    if (this.snackBtn && !this.snackBtnTxt) {
      this.snackBtnTxt = 'Close';
    }
    this.snackbar.openSnackbar(
      this.snackPosY,
      this.snackPosX,
      this.snackTxt,
      this.snackDur,
      this.snackBtn,
      this.snackBtnTxt
    );
  }

  changeTooltipPost(): void {
    const sel = document.getElementById('tooltipPos') as HTMLInputElement;
    if (sel.value) {
      this.tooltipPos = sel.value;
    } else {
      this.tooltipPos = 'bottom';
    }
  }
  tooltipClick(event): void {
    this.tooltipOnClick = event;
  }

  seleSing(event): void {
    this.singSel = event.option;
  }

  recieveItems(event): void {
    this.selectItms = event;
  }
}
