import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-code, p-section-code',
  template: `
    <ng-container>
      <ng-content></ng-content>
    </ng-container>
  `,
})
export class SectionCodeComponent {
  constructor() {}
}
