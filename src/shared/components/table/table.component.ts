import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
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
  SimpleChanges,
  TemplateRef,
} from '@angular/core';

let columnSortable = [];

const expandAnimation = trigger('expandAnimation', [
  state(
    'true',
    style({
      height: '*',
    })
  ),
  state(
    '*',
    style({
      height: '0px',
    })
  ),
  transition('* <=> true', animate('300ms cubic-bezier(0.07, 0.43, 0.38, 1)')),
]);

@Component({
  selector: 'app-table, p-table',
  animations: [expandAnimation],
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
        <ng-container *ngFor="let item of actualTableData.content">
          <tr (click)="pTableSelect ? selectInTable(item) : false">
            <td *ngIf="pTableSelect">
              <p-checkbox
                [checked]="item.selected"
                (click)="(false)"
              ></p-checkbox>
            </td>
            <td *ngFor="let header of actualTableData.header">
              <ng-container
                *ngIf="header.template !== undefined"
                [ngTemplateOutlet]="header.template"
                [ngTemplateOutletContext]="{ $implicit: item }"
              ></ng-container>
              {{
                header.template !== undefined
                  ? ''
                  : getPropByString(item, header.prop)
              }}
            </td>
          </tr>
          <tr class="table-expanded-row" *ngIf="pTableExpands">
            <td [colSpan]="colSpanSet()">
              <div
                class="table-expanded-content"
                [@expandAnimation]="item.expanded"
              >
                <ng-container
                  *ngIf="tableExpandRow"
                  [ngTemplateOutlet]="tableExpandRow.expandedRowTemplate"
                  [ngTemplateOutletContext]="{ $implicit: item }"
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

  @Input() selectedData: any | any[];
  @Output() selectedDataChange: EventEmitter<any> = new EventEmitter<any>();

  actualTableData: TableData = new TableData();

  @ContentChildren(forwardRef(() => TableColumnComponent))
  tableColumns: any;

  @ContentChild(forwardRef(() => TableExpandedRowComponent))
  tableExpandRow: any;

  areAllSelected: boolean;

  selectedOptions: any[] = [];

  constructor() {}

  ngOnInit() {
    if (this.pTableData.length > 0) {
      setTimeout(() => {
        this.configureTable();
      }, 0);
    }
  }

  ngOnChanges(event: SimpleChanges) {
    if (event.pTableData !== undefined) {
      if (!event.pTableData.firstChange) {
        this.configureTable();
      }
    }
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
      if (this.pTableExpands) {
        obj['expanded'] = false;
      }
      contArr.push(obj);
    }
    if (this.pTableSelect) {
      const isArray = Array.isArray(this.selectedData);
      if (isArray) {
        this.selectedData.forEach((c) => {
          c['selected'] = false;
          contArr.forEach((x) => {
            const t = this.deepEqual(c, x);
            if (t && !x.selected) {
              x.selected = true;
            } else if (!x.selected && !t) {
              x.selected = false;
            }
          });
        });
      } else {
        contArr.forEach((x) => {
          const eq = this.deepEqual(this.selectedData, x);
          if (eq) {
            x.selected = true;
          } else {
            x.selected = false;
          }
        });
      }
    }
    this.actualTableData.content = contArr;
  }

  getPropByString(obj, propString): any {
    if (!propString) return obj;

    let prop;
    let props = propString.split('.');

    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
      prop = props[i];

      let candidate = obj[prop];
      if (candidate !== undefined) {
        obj = candidate;
      } else {
        break;
      }
    }
    return obj[props[i]];
  }

  deepEqual(x, y) {
    const ok = Object.keys,
      tx = typeof x,
      ty = typeof y;
    return x && y && tx === 'object' && tx === ty
      ? ok(x).length === ok(y).length &&
          ok(x).every((key) => this.deepEqual(x[key], y[key]))
      : x === y;
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
      return this.getPropByString(a, column).localeCompare(
        this.getPropByString(b, column)
      );
    });
  }

  sortDsc(column: string): void {
    const content = this.actualTableData.content;
    content.sort((a, b) => {
      return this.getPropByString(b, column).localeCompare(
        this.getPropByString(a, column)
      );
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
      this.selectedData = data;
      if (isSelected > -1) {
        this.actualTableData.content[isSelected].selected = false;
      }
      if (data.selected) {
        this.selectedDataChange.emit(data);
      } else {
        this.selectedDataChange.emit(undefined);
      }
    } else {
      data.selected = !data.selected;
      const selectedItems = this.actualTableData.content.filter(
        (c) => c.selected
      );

      this.selectedData = selectedItems;
      this.checkIfAllAreSelected();
      this.selectedDataChange.emit(this.selectedData);
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
    this.selectedData = selectedItems;
    this.selectedDataChange.emit(this.selectedData);
  }

  @HostBinding('class.table-expanded')
  get isExpanded() {
    return this.pTableExpands;
  }
}

@Component({
  selector: 'app-table-column, p-table-column',
  template: `
    <th *ngIf="!columnSort" [width]="columnWidth">{{ columnName }}</th>
    <th
      *ngIf="columnSort"
      (click)="sort()"
      class="p-column-sortable"
      [width]="columnWidth"
    >
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
  @Input() columnWidth: number;
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

  @HostBinding('class.dContents')
  get DefaultClasses() {
    return true;
  }
}

@Directive({
  selector: '[appTableExpandedTrigger], [pTableExpandRowTrigger]',
})
export class TableExpandedTriggerDirective {
  @Input() triggerFor: any;

  @HostListener('click', ['$event'])
  toggleExpandedRow(): void {
    this.triggerFor.expanded = !this.triggerFor.expanded;
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
