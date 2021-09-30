import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-section-code-footer, p-section-code-footer',
  template: ` <ng-content></ng-content> `,
})
export class SectionCodeFooterComponent {
  constructor() {}

  @HostBinding('class.p-section-code-footer')
  get DefaultClass() {
    return true;
  }
}
