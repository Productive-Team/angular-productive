import { Component, OnInit } from '@angular/core';

declare var hljs: any;

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
  codeSection2 = `.ripple-example {
  margin: 15px 1rem;
  width: 250px;
  height: 250px;
  line-height: 250px;
  user-select: none;
  cursor: pointer;
  text-align: center;
  -webkit-tap-highlight-color: transparent;
}`;

  constructor() {
    document.addEventListener('DOMContentLoaded', (event) => {
      document.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
      });
    });
  }
}
