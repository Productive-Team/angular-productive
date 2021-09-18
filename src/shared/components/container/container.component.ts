import { Component } from '@angular/core';

@Component({
  selector: 'app-container, p-container',
  template: `<ng-content></ng-content> `,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'p-container',
  },
})
export class ContainerComponent {
  constructor() {}
}
