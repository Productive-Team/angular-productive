import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ripple-ex',
  templateUrl: './ripple-ex.component.html',
  styleUrls: ['./ripple-ex.component.css'],
})
export class RippleExComponent {
  center = false;
  unbound = false;
  disabled = false;
  color: string;
  radius: number;
  duration: number;

  showCodeSection2: boolean;

  codeSection1 = `
  <div class="ripple-example elevation-p8" pRipple [pRippleTriggerFor]="rippleTrigger">Click Me!</div>
  <div class="ripple-example elevation-p8" #rippleTrigger></div>
  `;

  constructor() {}
}
