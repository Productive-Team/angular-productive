import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-footer, p-card-footer',
  template: ` <ng-content></ng-content> `,
})
export class CardFooterComponent {
  constructor() {}

  @HostBinding('class.card-footer')
  get DefaultClass(): boolean {
    return true;
  }
}
