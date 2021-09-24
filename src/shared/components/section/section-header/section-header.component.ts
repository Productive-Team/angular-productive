import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-section-header, p-section-header',
  template: ` <ng-content></ng-content> `,
})
export class SectionHeaderComponent {
  constructor() {}

  @HostBinding('class.p-section-header')
  get DefaultClass() {
    return true;
  }
}
