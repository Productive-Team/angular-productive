import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-section-code-content, p-section-code-content',
  template: `
    <code>
      <ng-content></ng-content>
    </code>
  `,
})
export class SectionCodeContentComponent {
  constructor() {}

  @HostBinding('class.p-section-code')
  get DefaultClass() {
    return true;
  }
}
