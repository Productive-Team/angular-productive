import { style } from '@angular/animations';
import { Component, Input, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-sidenav-content, p-sidenav-content',
  template: `<div class="sidenav-container-content">
    <ng-content></ng-content>
  </div>`,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    style: 'width: 100%; box-sizing: border-box;',
  },
})
export class SidenavContentComponent implements OnInit {
  @Input() sidenav: any;
  constructor(private el: ElementRef) {}

  ngOnInit() {}
}
