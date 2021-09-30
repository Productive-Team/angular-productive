import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-code, p-section-code',
  template: `
    <ng-container *ngIf="isShowing">
      <ng-content></ng-content>
    </ng-container>
  `,
})
export class SectionCodeComponent {
  @Input() isShowing: boolean = true;
  constructor() {}
}
