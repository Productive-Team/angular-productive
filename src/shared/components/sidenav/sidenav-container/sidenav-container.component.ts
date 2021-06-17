import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav-container, p-sidenav-container',
  template: `<ng-content></ng-content> `,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'sidenav-container',
  },
})
export class SidenavContainerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
