import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon, p-icon',
  template: `<i class="material-icons">
    <ng-content></ng-content>
  </i>`,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'p-icon',
  },
})
export class IconComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
