import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-components',
  templateUrl: './all-components.component.html',
  styleUrls: ['./all-components.component.css'],
})
export class AllComponentsComponent implements OnInit {
  center = false;
  unbound = false;
  color: string;
  radius: number;
  constructor() {}

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
}
