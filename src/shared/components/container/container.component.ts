import { Component } from '@angular/core';

@Component({
  selector: 'app-container, p-container',
  template: `<ng-content></ng-content> `,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'p-container',
  },
})
export class ContainerComponent {
  constructor() {}
}
