import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-section-footer, p-section-footer',
  template: ` <ng-content></ng-content> `,
})
export class SectionFooterComponent {
  constructor() {}

  @HostBinding('class.p-section-footer')
  get DefaultClass() {
    return true;
  }
}
