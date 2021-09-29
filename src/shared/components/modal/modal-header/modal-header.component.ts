import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-modal-header, p-modal-header',
  template: ` <ng-content></ng-content> `,
})
export class ModalHeaderComponent {
  constructor() {}

  @HostBinding('class.modal-header')
  get DefaultClass() {
    return true;
  }
}
