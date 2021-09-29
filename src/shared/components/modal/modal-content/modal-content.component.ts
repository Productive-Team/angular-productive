import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-modal-content, p-modal-content',
  template: ` <ng-content></ng-content> `,
})
export class ModalContentComponent {
  constructor() {}

  @HostBinding('class.modal-content')
  get DefaultClass() {
    return true;
  }
}
