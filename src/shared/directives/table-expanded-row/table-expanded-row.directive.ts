import {
  Directive,
  Input,
  HostListener,
  ElementRef,
  OnInit,
  AfterViewInit,
} from '@angular/core';

@Directive({
  selector: '[appTableExpandedRowTrigger], [pTableExpandedRowTrigger]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'table-expanded-row-trigger',
  },
})
export class TableExpandedRowTriggerDirective {
  @Input() TriggerFor: any;
  constructor() {}

  @HostListener('click', ['$event'])
  trigger() {
    if (!this.TriggerFor.isOpen) {
      this.open();
    } else {
      this.close();
    }
  }

  open(): void {
    this.TriggerFor.isOpen = true;
    this.TriggerFor.classList.remove('hidden');
  }

  close(): void {
    this.TriggerFor.isOpen = false;
    this.TriggerFor.classList.add('hidden');
  }
}

@Directive({
  selector: '[appTableExpandedRow], [pTableExpandedRow]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'table-expanded-row hidden',
  },
})
export class TableExpandedRowDirective implements OnInit {
  isOpen = false;
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.checkColSpan();
  }

  checkColSpan(): void {
    const element = this.el.nativeElement as HTMLElement;
    const headerColumns =
      element.parentElement.previousSibling.firstChild.childNodes.length;
    const children = element.firstChild as HTMLTableDataCellElement;
    children.setAttribute('colspan', headerColumns.toString());
  }
}

@Directive({
  selector: '[appTableExpandedRowContent], [pTableExpandedRowContent]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'table-expanded-content hidden',
  },
})
export class TableExpandedRowContentDirective implements AfterViewInit {
  isOpen = false;
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.setVariable();
  }

  setVariable(): void {
    const el = this.el.nativeElement as HTMLDivElement;
    el.style.setProperty('--scrollHeightForTable', el.scrollHeight + 'px');
  }
}
