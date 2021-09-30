import { Component, Input, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-sidenav-content, p-sidenav-content',
  template: `<div class="sidenav-container-content">
    <ng-content></ng-content>
  </div>`,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    style: 'width: calc(100% - 250px); box-sizing: border-box;',
  },
})
export class SidenavContentComponent {
  constructor() {}
}
