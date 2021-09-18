import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav-container, p-sidenav-container',
  template: `
    <div class="p-sidenav-full-wrap">
      <ng-content></ng-content>
    </div>
  `,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'sidenav-container',
  },
})
export class SidenavContainerComponent {
  constructor() {}
}
