import {
  AfterViewInit,
  Component,
  ContentChildren,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { CollapsibleComponent } from '../collapsible/collapsible.component';

@Component({
  selector: 'app-collapsible-group, p-collapsible-group',
  template: `
    <div class="collapsible-wrap">
      <ng-content></ng-content>
    </div>
  `,
})
export class CollapsibleGroupComponent {
  @Input() MultipleCollapse: boolean;

  @ContentChildren(forwardRef(() => CollapsibleComponent))
  collapsibles: QueryList<CollapsibleComponent>;

  openedCollapes: CollapsibleComponent[] = [];

  constructor() {}

  @HostListener('click', ['$event'])
  clickCheck(event) {
    if (!this.MultipleCollapse) {
      this.collapsibles.forEach((x) => {
        if (x.state === 'open') {
          const idx = this.openedCollapes.findIndex((y) => y === x);
          if (idx < 0) {
            this.openedCollapes.push(x);
          }
        } else {
          const idx = this.openedCollapes.findIndex((y) => y === x);
          if (idx >= 0) {
            this.openedCollapes.splice(idx, 1);
          }
        }
      });
      if (this.openedCollapes.length > 1) {
        this.openedCollapes[0].state = 'closed';
        this.openedCollapes[0].isOpen = false;
        this.openedCollapes.splice(0, 1);
      }
    }
  }
}
