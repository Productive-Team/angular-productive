import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-section-code-header, p-section-code-header',
  template: ` <ng-content></ng-content> `,
})
export class SectionCodeHeaderComponent {
  constructor() {}

  @HostBinding('class.p-section-code-header')
  get DefaultClass() {
    return true;
  }
}
