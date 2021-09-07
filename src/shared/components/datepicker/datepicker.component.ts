import { animate, style, transition, trigger } from '@angular/animations';
import { formatDate } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Directive,
  HostBinding,
  HostListener,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector:
    '[p-datepicker-trigger], [pDatepickerTrigger], [appDatepickerTriggerDirective]',
  exportAs: 'pDatepicker',
})
export class DatepickerTriggerDirective {
  @Input() pTriggerFor: any;
  constructor() {}

  @HostBinding('class.picker-trigger')
  @HostBinding('attr.readonly')
  get clss() {
    return true;
  }

  @HostListener('click', ['$event'])
  open(): void {
    const element = this.pTriggerFor;
    element.isOpen = true;
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    const body = document.querySelector('body');
    body.insertAdjacentElement('beforeend', backdrop);
    backdrop.addEventListener('click', () => {
      this.closeDate();
    });
  }

  closeDate() {
    this.pTriggerFor.close();
  }
}

@Component({
  selector: 'app-datepicker, p-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  animations: [
    trigger('animationTrigger', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scaleY(0.95)' }),
        animate('100ms', style({ opacity: 1, transform: 'scaleY(1)' })),
      ]),
      transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class DatepickerComponent implements OnInit {
  @Input() pDatepickerType: string;
  @Input() pDate: any;
  @Output() pDateChange = new EventEmitter<any>();

  isOpen = false;

  years = [];
  months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  days = [];

  selectedDate;

  currMonth;
  currYear;

  showDays = true;
  showYears = false;
  showMonths = false;

  currentDate;

  selectedYear;
  constructor(private el: ElementRef) {}

  ngOnInit() {
    setTimeout(() => {
      this.currentDate = this.getCurrentDate();
    }, 0);
  }

  setDays(year: number, month: number): void {
    this.days = [];
    const allDays = new Date(year, month, 0).getDate();
    console.log(allDays);
    let i = 1;
    for (; i <= allDays; i++) {
      const obj = {
        day: i,
        // tslint:disable-next-line: object-literal-shorthand
        month: month,
        // tslint:disable-next-line: object-literal-shorthand
        year: year,
        selected: false,
      };
      this.days.push(obj);
    }
    setTimeout(() => {
      this.makeSureDayIsSelected();
    }, 0);
  }

  nextMonth() {
    this.currentDate.month++;
    if (this.currentDate.month - 1 > 11) {
      this.currentDate.month = 1;
      this.currentDate.year++;
      this.currYear = this.currentDate.year;
    }
    const index = this.currentDate.month - 1;
    this.currMonth = this.months[index];
    this.setDays(this.currentDate.year, this.currentDate.month);
  }

  previousMonth() {
    this.currentDate.month -= 1;
    if (this.currentDate.year !== 0) {
      if (this.currentDate.month - 1 < 0) {
        this.currentDate.month = 12;
        this.currentDate.year--;
        this.currYear = this.currentDate.year;
      }
      this.currMonth = this.months[this.currentDate.month - 1];
      this.setDays(this.currentDate.year, this.currentDate.month);
    }
  }

  makeSureDayIsSelected(): void {
    const sel = this.days.find(
      (x) =>
        x.day === this.selectedDate.day &&
        x.month === this.selectedDate.month &&
        x.year === this.selectedDate.year
    );
    if (sel) {
      sel.selected = true;
    }
  }

  selectDay(day): void {
    const oth = this.days.find((x) => x.selected === true);
    if (oth) {
      oth.selected = false;
    }
    const selDay = this.days.find((x) => x.day === day.day);
    selDay.selected = true;
    this.selectedDate = selDay;
    this.emitDate(day.year, day.month, day.day);
    this.close();
  }

  emitDate(year: number, month: number, day: number): Date {
    const dateObj = new Date(year, month - 1, day);
    this.pDateChange.emit(dateObj);
    return dateObj;
  }

  getCurrentDate(): any {
    const date = new Date();
    const obj = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
    this.setDays(obj.year, obj.month);
    this.currMonth = this.months[obj.month - 1];
    this.currYear = obj.year;
    this.selectDay(obj);
    return obj;
  }

  setYears(year: number): void {
    this.years = [];
    let currYear = new Date(year, 1, 1).getFullYear() - 1;
    currYear -= 10;
    let i = 0;
    for (; i < 20; i++) {
      currYear++;
      if (currYear > 0) {
        this.years.push(currYear);
      }
    }
  }

  previousYears(): void {
    let firstYear = this.years[0] - 21;
    const years = [];
    let i = 0;
    for (; i < 20; i++) {
      firstYear++;
      if (firstYear > 0) {
        years.push(firstYear);
      }
    }
    if (firstYear > 0) {
      this.years = years;
    }
  }

  nextYears(): void {
    let lastYear = this.years[this.years.length - 1];
    const years = [];
    let i = 0;
    for (; i < 20; i++) {
      lastYear++;
      years.push(lastYear);
    }
    this.years = years;
  }

  selectYear(year: number): void {
    this.selectedYear = year;
    this.currentDate.year = year;
    this.currYear = year;
    this.showYears = false;
    this.showMonths = true;
  }

  selectMonth(month: string): void {
    const monthIdx = this.months.indexOf(month) + 1;
    this.currMonth = month;
    this.currentDate.month = monthIdx;
    this.showDays = true;
    this.showMonths = false;
    this.setDays(this.currYear, monthIdx);
  }

  close(): void {
    this.isOpen = false;
    const backdrop = document.querySelector('.backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }
}
