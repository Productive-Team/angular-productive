import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-section-content, p-section-content',
  template: ` <ng-content></ng-content> `,
})
export class SectionContentComponent {
  constructor() {}

  @HostBinding('class.p-section-content')
  get DefaultClass() {
    return true;
  }
}
