import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkbox-ex',
  templateUrl: './checkbox-ex.component.html',
  styleUrls: ['./checkbox-ex.component.css'],
})
export class CheckboxExComponent implements OnInit {
  dis = false;
  indet = false;
  chck = false;

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

  comp = false;

  constructor() {}

  ngOnInit() {}

  areComp(): void {
    this.comp = this.child.every((t) => t.selected);
  }

  someComp(): boolean {
    return this.child.filter((x) => x.selected).length > 0 && !this.comp;
  }

  setAll(event): void {
    this.comp = event;
    this.child.forEach((x) => {
      x.selected = event;
    });
  }
}
