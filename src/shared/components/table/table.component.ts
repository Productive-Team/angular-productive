import {
  Component,
  ContentChildren,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  TemplateRef,
} from '@angular/core';

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
        <tr>
          <ng-content></ng-content>
        </tr>
      </thead>
      <tbody class="p-table-body">
        <tr *ngFor="let items of actualTableData.content">
          <td *ngFor="let hdr of actualTableData.header">
            <ng-container
              *ngIf="hdr.template !== undefined"
              [ngTemplateOutlet]="hdr.template"
              [ngTemplateOutletContext]="{ $implicit: items }"
            ></ng-container>
            {{ hdr.template !== undefined ? '' : items[hdr.prop] }}
          </td>
        </tr>
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
export class TableComponent implements OnInit, OnChanges {
  @Input() pTableElevated = true;
  @Input() pTableExpands = false;
  @Input() pTableHeaderFixed = false;
  @Input() pTableFooterFixed = false;

  @Input() pTableData: any[] = [];

  actualTableData: TableData = new TableData();

  @ContentChildren(forwardRef(() => TableColumnComponent))
  tableColumns: any;

  constructor() {}

  ngOnInit() {
    if (this.pTableData.length > 0) {
      setTimeout(() => {
        this.configureTable();
      }, 0);
    }
  }

  ngOnChanges() {
    this.configureTable();
  }

  configureTable(): void {
    if (this.tableColumns !== undefined) {
      const hdrArr = [];
      this.tableColumns._results.forEach((v) => {
        const obj: TableDataHeader = {
          name: v.columnName,
          template: v.columnTemplate,
          prop: v.columnProp,
        };
        hdrArr.push(obj);
      });
      this.actualTableData.header = hdrArr;
    }
    const contArr = [];
    let i = 0;
    for (; i < this.pTableData.length; i++) {
      const keys = Object.keys(this.pTableData[i]);
      let obj = {};
      keys.forEach((v) => {
        obj[v] = this.pTableData[i][v];
      });
      contArr.push(obj);
    }
    this.actualTableData.content = contArr;
  }

  sortTable(state: TableSortState = 'normal') {}

  @HostBinding('class.table-expanded')
  get isEx() {
    return this.pTableExpands;
  }
}

@Component({
  selector: 'app-table-column, p-table-column',
  template: `
    <th *ngIf="!columnSort">{{ columnName }}</th>
    <th
      *ngIf="columnSort"
      pTableSort
      [pTableColumnForSort]="columnProp"
      [pTableData]="parentComponent.pTableData"
    >
      {{ columnName }}
    </th>
  `,
})
export class TableColumnComponent {
  @Input() columnName: string;
  @Input() columnProp: string;
  @Input() columnSort: boolean;
  @Input() columnTemplate: TemplateRef<any>;

  sortingState: TableSortState;

  constructor(public parentComponent: TableComponent) {}

  @HostBinding('class.dContents')
  get DefaultClass() {
    return true;
  }
}

export class TableData {
  header: TableDataHeader[] = [];
  content: any[] = [];
}

export class TableDataHeader {
  name: string;
  template: TemplateRef<any>;
  prop: string;
}

type TableSortState = 'normal' | 'asc' | 'dsc';
