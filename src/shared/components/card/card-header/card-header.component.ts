import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-card-header, p-card-header',
  template: ` <ng-content></ng-content> `,
})
export class CardHeaderComponent {
  constructor() {}

  @HostBinding('class.card-header')
  get DefaultClass(): boolean {
    return true;
  }
}
