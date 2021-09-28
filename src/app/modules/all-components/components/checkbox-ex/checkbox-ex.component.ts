import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkbox-ex',
  templateUrl: './checkbox-ex.component.html',
  styleUrls: ['./checkbox-ex.component.css'],
})
export class CheckboxExComponent {
  dis = false;
  indet = false;
  chck = false;

  labelDir = 'right';

  child = [
    {
      label: 'Item 1',
      color: 'var(--primary)',
      selected: false,
    },
    {
      label: 'Item 2',
      color: 'var(--secondary)',
      selected: false,
    },
    {
      label: 'Item 3',
      color: '#ab0000',
      selected: false,
    },
  ];

  allComplete = false;

  constructor() {}

  areCompleted(): void {
    this.allComplete = this.child.every((t) => t.selected);
  }

  someCompleted(): boolean {
    return this.child.filter((x) => x.selected).length > 0 && !this.allComplete;
  }

  setAll(event): void {
    console.log(event);
    this.allComplete = event;
    this.child.forEach((x) => {
      x.selected = event;
    });
  }
}
