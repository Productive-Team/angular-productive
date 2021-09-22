import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-content, p-card-content',
  template: ` <ng-content></ng-content> `,
})
export class CardContentComponent {
  constructor() {}

  @HostBinding('class.card-content')
  get DefaultClass(): boolean {
    return true;
  }
}
