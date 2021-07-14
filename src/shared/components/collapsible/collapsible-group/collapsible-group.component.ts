import { CollapsibleComponent } from './../collapsible/collapsible.component';
import {
  Component,
  ContentChildren,
  ElementRef,
  forwardRef,
  HostListener,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-collapsible-group, p-collapsible-group',
  templateUrl: './collapsible-group.component.html',
  styleUrls: ['./collapsible-group.component.css'],
})
export class CollapsibleGroupComponent implements OnInit {
  active = [];
  constructor(private el: ElementRef) {}

  @ContentChildren(forwardRef(() => CollapsibleComponent), {
    descendants: true,
  })
  collapses: any;

  ngOnInit() {
    this.collapses.forEach((x) => {
      this.active.push(x);
    });
  }

  @HostListener('click', ['$event'])
  onChanges(event): void {
    // TODO: Implement a way to remove the active status of a previous collapsible
  }
}
