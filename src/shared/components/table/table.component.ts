import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table, p-table',
  template: `
    <table [class]="pTableElevated ? 'p-table elevation' : 'p-table'">
      <thead
        [class]="
          pTableHeaderFixed
            ? 'p-table-header p-table-header-sticky'
            : 'p-table-header'
        "
      >
        <ng-content select="[table-header]"></ng-content>
      </thead>
      <tbody class="p-table-body">
        <ng-content select="[table-body]"></ng-content>
      </tbody>
      <tfoot
        [class]="
          pTableFooterFixed
            ? 'p-table-footer p-table-footer-sticky'
            : 'p-table-footer'
        "
      >
        <ng-content select="[table-footer]"></ng-content>
      </tfoot>
    </table>
  `,
})
export class TableComponent implements OnInit {
  @Input() pTableElevated = true;
  @Input() pTableExpands = false;
  @Input() pTableHeaderFixed = false;
  @Input() pTableFooterFixed = false;
  constructor() {}

  ngOnInit() {}

  @HostBinding('class.table-expanded')
  get isEx() {
    return this.pTableExpands;
  }
}
