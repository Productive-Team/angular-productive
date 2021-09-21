import {
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';

let columnSortable = [];

@Component({
  selector: 'app-table, p-table',
  template: `
    <table class="p-table">
      <thead
        [class]="
          pTableHeaderFixed
            ? 'p-table-header p-table-header-sticky'
            : 'p-table-header'
        "
      >
        <tr>
          <th *ngIf="pTableSelect">
            <p-checkbox
              *ngIf="pTableSelectMode === 'multiple'"
              [checked]="areAllSelected"
              (checkedChange)="selectAll($event)"
              [indeterminate]="checkIfSomeAreSelected()"
            ></p-checkbox>
          </th>
          <ng-content></ng-content>
        </tr>
      </thead>
      <tbody class="p-table-body">
        <ng-container *ngFor="let items of actualTableData.content">
          <tr (click)="pTableSelect ? selectInTable(items) : false">
            <td *ngIf="pTableSelect">
              <p-checkbox
                [checked]="items.selected"
                (click)="(false)"
              ></p-checkbox>
            </td>
            <td *ngFor="let hdr of actualTableData.header">
              <ng-container
                *ngIf="hdr.template !== undefined"
                [ngTemplateOutlet]="hdr.template"
                [ngTemplateOutletContext]="{ $implicit: items }"
              ></ng-container>
              {{ hdr.template !== undefined ? '' : items[hdr.prop] }}
            </td>
          </tr>
          <tr class="table-expanded-row" *ngIf="pTableExpands">
            <td [colSpan]="colSpanSet()">
              <div
                [class]="
                  tableExpandRow.isOpen
                    ? 'table-expanded-content'
                    : 'table-expanded-content hidden'
                "
              >
                <ng-container
                  *ngIf="tableExpandRow"
                  [ngTemplateOutlet]="tableExpandRow.expandedRowTemplate"
                  [ngTemplateOutletContext]="{ $implicit: items }"
                ></ng-container>
              </div>
            </td>
          </tr>
        </ng-container>
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
  @Input() pTableExpands: boolean;
  @Input() pTableSelect: boolean;
  @Input() pTableSelectMode: TableSelectMode = 'single';
  @Input() pTableHeaderFixed: boolean;
  @Input() pTableFooterFixed: boolean;

  @Input() pTableData: any[] = [];

  @Output() selectData: EventEmitter<any> = new EventEmitter<any>();

  actualTableData: TableData = new TableData();

  @ContentChildren(forwardRef(() => TableColumnComponent))
  tableColumns: any;

  @ContentChild(forwardRef(() => TableExpandedRowComponent))
  tableExpandRow: any;

  selectedItemsMultiple: any[] = [];

  areAllSelected: boolean;

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
      if (this.pTableSelect) {
        obj['selected'] = false;
      }
      contArr.push(obj);
    }
    this.actualTableData.content = contArr;
  }

  sortTable(state: TableSortState, columnName: string) {
    switch (state) {
      case 'asc':
        this.sortAsc(columnName);
        break;
      case 'dsc':
        this.sortDsc(columnName);
        break;
      case 'normal':
        this.configureTable();
        break;
    }
    if (columnSortable.length > 1) {
      let columnSort = this.tableColumns._results.find(
        (x) => x.columnProp === columnSortable[0]
      );
      columnSort.sortingState = 'normal';
    }
  }

  sortAsc(column: string): void {
    const content = this.actualTableData.content;
    content.sort((a, b) => {
      return a[column].localeCompare(b[column]);
    });
  }

  sortDsc(column: string): void {
    const content = this.actualTableData.content;
    content.sort((a, b) => {
      return b[column].localeCompare(a[column]);
    });
  }

  colSpanSet(): number {
    const columns = this.tableColumns;
    if (columns !== undefined) {
      return columns._results.length;
    }
  }

  selectInTable(data: any) {
    if (this.pTableSelectMode === 'single') {
      const isSelected = this.actualTableData.content.findIndex(
        (c) => c.selected
      );
      data.selected = !data.selected;
      if (isSelected > -1) {
        this.actualTableData.content[isSelected].selected = false;
      }
      if (data.selected) {
        this.selectData.emit(data);
      } else {
        this.selectData.emit(undefined);
      }
    } else {
      data.selected = !data.selected;
      const selectedItems = this.actualTableData.content.filter(
        (c) => c.selected
      );
      this.selectedItemsMultiple = selectedItems;
      this.checkIfAllAreSelected();
      this.selectData.emit(this.selectedItemsMultiple);
    }
  }

  checkIfAllAreSelected(): void {
    this.areAllSelected = this.actualTableData.content.every((t) => t.selected);
  }

  checkIfSomeAreSelected(): boolean {
    return (
      this.actualTableData.content.filter((x) => x.selected).length > 0 &&
      !this.areAllSelected
    );
  }

  selectAll(event: boolean): void {
    this.areAllSelected = event;
    this.actualTableData.content.forEach((x) => {
      x.selected = event;
    });
    const selectedItems = this.actualTableData.content.filter(
      (c) => c.selected
    );
    this.selectedItemsMultiple = selectedItems;
    this.selectData.emit(this.selectedItemsMultiple);
  }

  @HostBinding('class.table-expanded')
  get isExpanded() {
    return this.pTableExpands;
  }
}

@Component({
  selector: 'app-table-column, p-table-column',
  template: `
    <th *ngIf="!columnSort">{{ columnName }}</th>
    <th *ngIf="columnSort" (click)="sort()" class="p-column-sortable">
      <div class="dFlex align-items-center">
        {{ columnName }}
        <div class="spacer"></div>
        <i class="material-icons">{{
          sortingState === 'normal'
            ? ''
            : sortingState === 'asc'
            ? 'arrow_upward'
            : 'arrow_downward'
        }}</i>
      </div>
    </th>
  `,
})
export class TableColumnComponent {
  @Input() columnName: string;
  @Input() columnProp: string;
  @Input() columnSort: boolean;
  @Input() columnTemplate: TemplateRef<any>;
  @Input() customSortFunction: any;

  sortingState: TableSortState = 'normal';

  constructor(
    public parentComponent: TableComponent,
    public elementRef: ElementRef
  ) {}

  sort(): void {
    switch (this.sortingState) {
      case 'normal':
        this.sortingState = 'asc';
        columnSortable.push(this.columnProp);
        break;
      case 'asc':
        this.sortingState = 'dsc';
        break;
      case 'dsc':
        this.sortingState = 'normal';
        columnSortable.splice(0, 1);
        break;
    }
    if (this.customSortFunction === undefined) {
      this.parentComponent.sortTable(this.sortingState, this.columnProp);
    } else {
      this.customSortFunction();
    }
    this.checkClasses();
  }

  checkClasses(): void {
    if (columnSortable.length > 1) {
      columnSortable.splice(0, 1);
    }
  }

  @HostBinding('class.dContents')
  get DefaultClass() {
    return true;
  }
}

@Component({
  selector: 'app-table-expanded-row, p-table-expanded-row',
  template: ``,
})
export class TableExpandedRowComponent {
  @Input() expandedRowTemplate: TemplateRef<any>;

  isOpen: boolean;

  toggleExpandedContent(): void {
    this.isOpen = !this.isOpen;
  }

  @HostBinding('class.dContents')
  get DefaultClasses() {
    return true;
  }
}

@Directive({
  selector: '[appTableExpandedTrigger], [pTableExpandRowTrigger]',
})
export class TableExpandedTriggerDirective {
  @Input() triggerFor: TableExpandedRowComponent;

  @HostListener('click', ['$event'])
  toggleExpandedRow(): void {
    this.triggerFor.toggleExpandedContent();
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
type TableSelectMode = 'single' | 'multiple';
