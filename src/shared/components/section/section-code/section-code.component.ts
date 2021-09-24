import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-code, p-section-code',
  template: `
    <ng-container *ngIf="isShowing">
      <div class="p-section-code-header" *ngIf="hasHeader">
        <ng-content select="[code-header]"></ng-content>
      </div>
      <div class="p-section-code">
        <code>
          <ng-content></ng-content>
        </code>
      </div>
      <div class="p-section-code-footer" *ngIf="hasFooter">
        <ng-content select="[code-footer]"></ng-content>
      </div>
    </ng-container>
  `,
})
export class SectionCodeComponent {
  @Input() isShowing: boolean = true;
  @Input() hasFooter: boolean;
  @Input() hasHeader: boolean;
  constructor() {}
}
