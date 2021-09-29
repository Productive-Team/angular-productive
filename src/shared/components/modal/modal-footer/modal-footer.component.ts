import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-modal-footer, p-modal-footer',
  template: ` <ng-content></ng-content> `,
})
export class ModalFooterComponent {
  constructor() {}

  @HostBinding('class.modal-footer')
  get DefaultClass() {
    return true;
  }
}
