import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon, p-icon',
  template: `<i
    [class]="
      pIconType === 'filled' ? 'material-icons' : 'material-icons-' + pIconType
    "
  >
    <ng-content></ng-content>
  </i>`,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'p-icon',
  },
})
export class IconComponent implements OnInit {
  @Input() pIconType =
    'filled' || 'outlined' || 'round' || 'sharp' || 'two-tone';
  constructor() {}

  ngOnInit() {}
}
