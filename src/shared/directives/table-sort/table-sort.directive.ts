import {
  Directive,
  HostListener,
  Input,
  ElementRef,
  HostBinding,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appTableSort], [pTableSort]',
})
export class TableSortDirective implements OnInit {
  @Input() pTableData: any[];
  @Input() pTableColumnForSort: any;

  sortingState = 'normal';
  tableDataNormal: any[];

  constructor(private el: ElementRef) {}
  mainEl = this.el.nativeElement as HTMLTableHeaderCellElement;

  ngOnInit(): void {
    this.tableDataNormal = this.pTableData.slice();
    console.log(this.tableDataNormal);
  }

  @HostListener('click', ['$event'])
  sortColumns() {
    switch (this.sortingState) {
      case 'normal':
        this.sortAsc(this.pTableColumnForSort);
        break;
      case 'asc':
        this.sortDsc(this.pTableColumnForSort);
        break;
      case 'dsc':
        this.sortAsc(this.pTableColumnForSort);
        break;
    }
  }

  sortAsc(col): any[] {
    this.sortingState = 'asc';
    this.pTableData.sort((a, b) => {
      return a[col].localeCompare(b[col]);
    });
    this.mainEl.classList.add('asc');
    return this.pTableData;
  }

  sortDsc(col): any[] {
    this.sortingState = 'dsc';
    this.pTableData.sort((a, b) => {
      return b[col].localeCompare(a[col]);
    });
    this.mainEl.classList.remove('asc');
    this.mainEl.classList.add('dsc');
    return this.pTableData;
  }

  sortNormal(): any[] {
    this.sortingState = 'normal';
    this.pTableData.sort((a, b) => {
      return 0;
    });
    console.log(this.pTableData);
    this.mainEl.classList.remove('dsc');
    return this.pTableData;
  }

  @HostBinding('class.p-table-header-sort')
  get val() {
    return true;
  }
}
