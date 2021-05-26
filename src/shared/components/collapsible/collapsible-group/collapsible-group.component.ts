import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-collapsible-group, p-collapsible-group',
  templateUrl: './collapsible-group.component.html',
  styleUrls: ['./collapsible-group.component.css'],
})
export class CollapsibleGroupComponent implements OnInit {
  active = [];
  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event'])
  onChanges(event): void {
    // TODO: Implement a way to remove the active status of a previous collapsible
  }
  ngOnInit() {}
}
