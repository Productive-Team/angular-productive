import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, HostBinding, Input, OnInit } from '@angular/core';

const collapseAnimation = trigger('collapseAnimation', [
  state(
    'open',
    style({
      height: '*',
    })
  ),
  state(
    'closed',
    style({
      height: '0px',
      padding: '0 1rem',
    })
  ),
  transition(
    'closed <=> open',
    animate('150ms cubic-bezier(0.07, 0.43, 0.38, 1)')
  ),
]);

@Component({
  selector: 'app-collapsible, p-collapsible',
  templateUrl: './collapsible.component.html',
  animations: [collapseAnimation],
})
export class CollapsibleComponent implements OnInit {
  @Input() CollapsibleOpen: boolean;
  @Input() CollapisbleIcon: boolean = true;

  state: CollapsibleState = 'closed';

  isOpen: boolean = false;

  ngOnInit(): void {
    if (this.CollapsibleOpen) {
      this.toggleVisibility();
    }
  }

  constructor() {}

  toggleVisibility(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.state = 'open';
    } else {
      this.state = 'closed';
    }
  }

  @HostBinding('class.collapsible')
  get DefaultClass() {
    return true;
  }
}

type CollapsibleState = 'closed' | 'open';
