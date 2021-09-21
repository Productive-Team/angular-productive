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
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'p-icon',
  },
})
export class IconComponent {
  @Input() pIconType: IconType = 'filled';
  constructor() {}
}

type IconType = 'filled' | 'outlined' | 'round' | 'sharp' | 'two-tone';
