import {
  Directive,
  HostListener,
  Input,
  ElementRef,
  HostBinding,
  OnInit,
} from '@angular/core';

const isSorting = [];
const columns = [];

@Directive({
  selector: '[appTableSort], [pTableSort]',
})
export class TableSortDirective implements OnInit {
  @Input() pTableData: any[];
  @Input() pTableColumnForSort: any;

  sortingState = 'normal';
  tableDataNormal: any[];

  columnSort: any = {};

  constructor(private el: ElementRef) {}
  mainEl = this.el.nativeElement as HTMLTableHeaderCellElement;

  ngOnInit(): void {
    this.setIcon();
    this.configureTable();
  }

  @HostListener('click', ['$event'])
  sortColumns(event) {
    const obj = columns.find((x) => x.column === event.target.classList[0]);
    const idx1 = columns.indexOf(obj);
    switch (columns[idx1].sortingState) {
      case 'normal':
        this.sortAsc(this.pTableColumnForSort);
        break;
      case 'asc':
        this.sortDsc(this.pTableColumnForSort);
        break;
      case 'dsc':
        this.sortNormal();
        break;
    }
    this.hasCls();
    console.log(isSorting);
  }

  private sortAsc(col): any[] {
    this.pTableData.sort((a, b) => {
      return a[col].toString().localeCompare(b[col]);
    });
    this.mainEl.classList.add('asc');
    this.mainEl.classList.add('isSorting');
    isSorting.push(this.mainEl);
    console.log(isSorting);
    const obj = columns.find((x) => x.column === isSorting[0].classList[0]);
    const idx = columns.indexOf(obj);
    columns[idx].sortingState = 'asc';
    return this.pTableData;
  }

  private sortDsc(col): any[] {
    const obj = columns.find((x) => x.column === isSorting[0].classList[0]);
    const idx = columns.indexOf(obj);
    columns[idx].sortingState = 'dsc';
    this.pTableData.sort((a, b) => {
      return b[col].toString().localeCompare(a[col]);
    });
    this.mainEl.classList.remove('asc');
    this.mainEl.classList.add('dsc');
    return this.pTableData;
  }

  private sortNormal(): any[] {
    const obj = columns.find((x) => x.column === isSorting[0].classList[0]);
    const idx1 = columns.indexOf(obj);
    columns[idx1].sortingState = 'normal';
    this.pTableData.sort((a, b) => {
      return a.origiIdx.toString().localeCompare(b.origiIdx);
    });
    const idx = isSorting.find((x) => x === this.mainEl);
    isSorting.splice(idx, 1);
    this.mainEl.classList.remove('dsc');
    this.mainEl.classList.remove('isSorting');
    return this.pTableData;
  }

  @HostBinding('class.p-table-header-sort')
  get val() {
    return true;
  }

  private setIcon(): void {
    const icon = document.createElement('i');
    icon.innerHTML = 'arrow_upward';
    icon.classList.add('material-icons');
    this.mainEl.insertAdjacentElement('beforeend', icon);
  }

  private configureTable(): void {
    this.tableDataNormal = this.pTableData.slice();
    this.pTableData.forEach((x, y) => {
      x.origiIdx = y;
    });
    const obj = {
      sortingState: 'normal',
      column: this.pTableColumnForSort,
    };
    this.columnSort = obj;
    this.mainEl.classList.add(obj.column);
    columns.push(obj);
  }

  private hasCls(): void {
    if (isSorting.length > 1) {
      isSorting[0].classList.remove('dsc', 'isSorting', 'asc');
      isSorting.splice(0, 1);
      const obj = columns.find((x) => x.column === isSorting[0].classList[0]);
      const idx = columns.indexOf(obj);
      columns[idx].sortingState = 'normal';
      console.log(columns[idx]);
    }
  }
}
