import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table, p-table',
  template: `
    <table [class]="pTableElevated ? 'p-table elevation' : 'p-table'">
      <thead class="p-table-header">
        <ng-content select="[table-header]"></ng-content>
      </thead>
      <tbody class="p-table-body">
        <ng-content select="[table-body]"></ng-content>
      </tbody>
      <tfoot>
        <ng-content select="[table-footer]"></ng-content>
      </tfoot>
    </table>
  `,
})
export class TableComponent implements OnInit {
  @Input() pTableElevated = true;
  @Input() pTableExpands = false;
  constructor() {}

  ngOnInit() {}

  @HostBinding('class.table-expanded')
  get isEx() {
    return this.pTableExpands;
  }
}
