import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ripple-ex',
  templateUrl: './ripple-ex.component.html',
  styleUrls: ['./ripple-ex.component.css'],
})
export class RippleExComponent implements OnInit {
  centerb = false;
  center = false;
  unbound = false;
  unboundb = false;
  disabled = false;
  color: string;
  radius: number;

  constructor() {}

  ngOnInit() {}

  centerA(event) {
    this.center = event;
  }
  centerB(event) {
    this.centerb = event;
  }
  unboundA(event) {
    this.unbound = event;
    const rip = document.querySelector('#rip-ex-1') as HTMLDivElement;
    if (this.unbound) {
      rip.classList.add('p-ripple-unbounded');
    } else {
      rip.classList.remove('p-ripple-unbounded');
    }
  }

  disableA(event) {
    this.disabled = event;
  }
}
