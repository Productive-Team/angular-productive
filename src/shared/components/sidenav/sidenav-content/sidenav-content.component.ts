import { Component, Input, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-sidenav-content, p-sidenav-content',
  template: `<div
    class="sidenav-container-content"
    [style]="sidenav.sidenavOpen ? '' : 'transform: translateX(-250px)'"
  >
    <ng-content></ng-content>
  </div>`,
})
export class SidenavContentComponent implements OnInit {
  @Input() sidenav: any;
  constructor(private el: ElementRef) {}

  ngOnInit() {}
}
