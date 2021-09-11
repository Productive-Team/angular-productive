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
        <!-- <ng-content select="[table-header]"></ng-content> -->
        <tr>
          <th *ngFor="let item of data.header">{{ item.label }}</th>
        </tr>
      </thead>
      <tbody class="p-table-body">
        <!-- <ng-content select="[table-body]"></ng-content> -->
        <tr></tr>
        <tr *ngFor="let item of data.content">
          <td *ngFor="let hdr of data.header">{{ item[hdr.prop] }}</td>
        </tr>
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
  data;
  constructor() {}

  ngOnInit() {
    this.data = {
      header: [
        {
          label: 'id',
          prop: 'xavasca',
        },
        {
          label: 'name',
          prop: 'xa',
        },
      ],
      content: [
        {
          xa: 'heitor',
          xavasca: 123,
        },
      ],
    };
    console.log('##### datatable ', this.data.content[0]['name']);
  }

  @HostBinding('class.table-expanded')
  get isEx() {
    return this.pTableExpands;
  }
}
