import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-sidenav-content, p-sidenav-content',
  template: `<div class="sidenav-container-content">
    <ng-content></ng-content>
  </div>`,
})
export class SidenavContentComponent {
  constructor() {}

  @HostBinding('class.dContents')
  get DefaultClass(): boolean {
    return true;
  }
}
