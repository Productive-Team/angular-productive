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

  checkboxTreeHTMLCode = `
      <p-checkbox [checked]="allComplete" [indeterminate]="someCompleted()" (checkedChange)="setAll($event)">
        {{allComplete ? 'Deselect All' : 'Select All'}}
      </p-checkbox>
      <div style="margin-left: 30px;">
        <div *ngFor="let check of child">
          <p-checkbox [(ngModel)]="check.selected" color="{{check.color}}" (ngModelChange)="areCompleted()">
            {{check.label}}
          </p-checkbox>
        </div>
      </div>
  `;

  checkboxTreeTSCode = `
  areCompleted(): void {
    this.allComplete = this.child.every((t) => t.selected);
  }

  someCompleted(): boolean {
    return this.child.filter((x) => x.selected).length > 0 && !this.allComplete;
  }

  setAll(event): void {
    this.allComplete = event;
    this.child.forEach((x) => {
      x.selected = event;
    });
  }
  `;

  allComplete = false;

  constructor() {}

  areCompleted(): void {
    this.allComplete = this.child.every((t) => t.selected);
  }

  someCompleted(): boolean {
    return this.child.filter((x) => x.selected).length > 0 && !this.allComplete;
  }

  setAll(event): void {
    this.allComplete = event;
    this.child.forEach((x) => {
      x.selected = event;
    });
  }
}
