import { DatePipe } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import {
  Component,
  OnInit,
  ElementRef,
  Directive,
  Input,
  HostListener,
  ViewChild,
  Output,
  EventEmitter,
  forwardRef,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[p-date-trigger], [appDateTriggerDirective], [pDateTrigger]',
})
export class DatepickerTriggerDirective {
  @Input() triggerFor: DatepickerComponent;

  @HostListener('click', ['$event'])
  openPicker(): void {
    this.triggerFor.openPicker();
  }
}

const pickerAnim = trigger('datepickerAnim', [
  transition(':leave', [
    animate('150ms cubic-bezier(.3,.94,.47,.91)', style({ opacity: 0 })),
  ]),
]);

@Component({
  selector: 'app-datepicker, p-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./Datepicker.component.css'],
  animations: [pickerAnim],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
    DatePipe,
  ],
})
export class DatepickerComponent implements OnInit, OnChanges {
  isPickerOpen: boolean;

  currentDate: Date = new Date();
  selectedDate: Date;

  weekDaysShort: string[] = [];

  monthPage: number;
  yearMonthPage: number;

  selectedYearIndex: number;

  daysOfLastMonth: number[] = [];
  daysOfMonth: any[] = [];
  monthsOfYear: any[] = [];
  years: any[] = [];

  showYears: boolean;
  showMonths: boolean;

  // For more info about locales: https://www.science.co.il/language/Locale-codes.php
  @Input() locale = 'en-US';

  @Input() dateInput: HTMLInputElement;

  @Input() Date: Date;
  @Output() DateChange: EventEmitter<Date> = new EventEmitter<Date>();

  @ViewChild('datepickerPos') datepickerPosition: ElementRef;

  change = (_) => {};
  blur = (_) => {};

  constructor(private el: ElementRef, private datePipe: DatePipe) {}

  public openPicker(): void {
    this.isPickerOpen = true;
    this.setPickerPositions();
  }

  public closePicker(): void {
    this.isPickerOpen = false;
    this.removeBackdrop();
  }

  ngOnInit(): void {
    this.setToBody();
    this.setCurrentDate();
    // this.datepickerInputValue();
  }

  private setCurrentDate() {
    const currentDate = this.currentDate;
    this.setDaysOfMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);
    this.setWeekdays();
    this.setMonths(currentDate.getFullYear());
    this.setYears(currentDate.getFullYear());
  }

  private setDaysOfMonth(year: number, month: number) {
    this.daysOfMonth = [];

    const daysOfCurrentMonth = new Date(year, month, 0).getDate();
    const lastMonthDays = new Date(year, month - 1, 1).getDay();

    const lastMonthDaysArray = [];
    let c = 0;
    for (; c < lastMonthDays; c++) {
      lastMonthDaysArray.push(c);
    }
    this.daysOfLastMonth = lastMonthDaysArray;

    const currentYear = year;
    const currentMonth = month;

    let d = 1;
    for (; d <= daysOfCurrentMonth; d++) {
      const days = {
        day: d,
        selected: false,
        year: currentYear,
        month: currentMonth,
      };
      this.monthPage = currentMonth;
      this.yearMonthPage = currentYear;

      this.daysOfMonth.push(days);
    }
  }

  setWeekdays(): void {
    this.weekDaysShort = [];
    const current = this.currentDate;
    current.setDate(current.getDate() - current.getDay());
    for (let i = 0; i < 7; i++) {
      this.weekDaysShort.push(
        current.toLocaleDateString(this.locale, { weekday: 'narrow' })
      );
      current.setDate(current.getDate() + 1);
    }
  }

  setMonths(year: number): void {
    this.monthsOfYear = [];

    const monthList = [...Array(12).keys()];
    let m = 0;
    for (; m < monthList.length; m++) {
      const month = new Date(year, m).toLocaleString(this.locale, {
        month: 'short',
      });

      const obj = { monthName: month, yearMonth: year, selected: false };

      this.monthsOfYear.push(obj);
    }
  }

  setYears(currentYear: number): void {
    this.years = [];

    let minYear = currentYear;
    minYear -= 10;

    let yearQty = 20;

    let y = 0;
    for (; y < yearQty; y++) {
      minYear++;
      const yearFormat = new Date(minYear, 1, 1).toLocaleString(this.locale, {
        year: 'numeric',
      });
      const obj = { year: yearFormat, selected: false, yearNumber: minYear };
      if (minYear > 0) {
        this.years.push(obj);
      }
    }
    if (this.years.length < 20 && this.years.length > 0) {
      yearQty = 29;
      for (; y < yearQty; y++) {
        minYear++;
        const yearFormat = new Date(minYear, 1, 1).toLocaleString(this.locale, {
          year: 'numeric',
        });
        const obj = {
          year: yearFormat,
          selected: false,
          yearNumber: minYear,
        };
        if (minYear > 0) {
          this.years.push(obj);
        }
      }
    }
    const idx = this.years.find((v) => v.yearNumber === currentYear);
    this.selectedYearIndex = this.years.indexOf(idx);
  }

  selectDay(dayObj: any): void {
    const selectedDate = this.daysOfMonth.find((x) => x.selected);
    if (selectedDate) {
      selectedDate.selected = false;
    }

    const newSelDate = this.daysOfMonth.find(
      (c) =>
        c.day === dayObj.day &&
        c.month === dayObj.month &&
        c.year === dayObj.year
    );
    if (newSelDate) {
      newSelDate.selected = true;
      this.monthPage = newSelDate.month;
      this.yearMonthPage = newSelDate.year;
      this.selectedDate = new Date(
        newSelDate.year,
        newSelDate.month - 1,
        newSelDate.day
      );

      const idx = this.years.find((v) => v.yearNumber === newSelDate.year);
      const yearSel = this.years.find((b) => b.selected);
      if (yearSel) {
        yearSel.selected = false;
      }
      idx.selected = true;
      this.selectedYearIndex = this.years.indexOf(idx);

      this.emitDate(this.selectedDate);
    }
  }

  selectYear(yearObj: any): void {
    const selectedYear = this.years.find((c) => c.selected);
    if (selectedYear) {
      selectedYear.selected = false;
    }

    const newSelectedYear = this.years.find((v) => v.year === yearObj.year);
    if (newSelectedYear) {
      newSelectedYear.selected = true;
      this.yearMonthPage = newSelectedYear.yearNumber;
      this.selectedYearIndex = this.years.indexOf(newSelectedYear);
      this.showYears = false;
      this.showMonths = true;
      this.setMonths(newSelectedYear.yearNumber);
    }
  }

  selectMonth(monthObj: any): void {
    const selectedMonth = this.monthsOfYear.find((c) => c.selected);
    if (selectedMonth) {
      selectedMonth.selected = false;
    }

    const newSelectedMonth = this.monthsOfYear.find(
      (v) =>
        v.yearMonth === monthObj.yearMonth && v.monthName === monthObj.monthName
    );
    if (newSelectedMonth) {
      newSelectedMonth.selected = true;
      this.monthPage = this.monthsOfYear.indexOf(newSelectedMonth) + 1;
      this.showMonths = false;
      this.setDaysOfMonth(newSelectedMonth.yearMonth, this.monthPage);
    }
  }

  previousMonth(): void {
    this.daysOfMonth = [];
    this.monthPage--;
    if (this.monthPage <= 0) {
      this.monthPage = 12;
      this.yearMonthPage--;
      let idx = this.years.find((v) => v.yearNumber === this.yearMonthPage);
      if (idx === null) {
        this.previousYear();
        idx = this.years.find((v) => v.yearNumber === this.yearMonthPage);
      }
      this.selectedYearIndex = this.years.indexOf(idx);
    }
    this.setDaysOfMonth(this.yearMonthPage, this.monthPage);
    if (this.selectedDate) {
      const dateObj = {
        day: this.selectedDate.getDate(),
        selected: false,
        year: this.selectedDate.getFullYear(),
        month: this.selectedDate.getMonth() + 1,
      };
      this.selectDay(dateObj);
    }
  }

  nextMonth(): void {
    this.daysOfMonth = [];
    this.monthPage++;
    if (this.monthPage > 12) {
      this.monthPage = 1;
      this.yearMonthPage++;
      let idx = this.years.find((v) => v.yearNumber === this.yearMonthPage);
      if (idx === null) {
        this.nextYear();
        idx = this.years.find((v) => v.yearNumber === this.yearMonthPage);
      }
      this.selectedYearIndex = this.years.indexOf(idx);
    }
    this.setDaysOfMonth(this.yearMonthPage, this.monthPage);

    if (this.selectedDate) {
      const dateObj = {
        day: this.selectedDate.getDate(),
        selected: false,
        year: this.selectedDate.getFullYear(),
        month: this.selectedDate.getMonth() + 1,
      };
      this.selectDay(dateObj);
    }
  }

  nextYear(): void {
    const lastYear = this.years[this.years.length - 1].yearNumber + 10;
    this.setYears(lastYear);
  }

  previousYear(): void {
    const firstYear = this.years[0].yearNumber - 11;
    if (firstYear > 100) {
      this.setYears(firstYear);
    }
  }

  previousYearsInMonths(): void {
    this.yearMonthPage--;
    let idx = this.years.find((v) => v.yearNumber === this.yearMonthPage);
    if (!idx) {
      this.previousYear();
      idx = this.years.find((v) => v.yearNumber === this.yearMonthPage);
    }
    this.selectedYearIndex = this.years.indexOf(idx);
  }

  nextYearsInMonths(): void {
    this.yearMonthPage++;
    let idx = this.years.find((v) => v.yearNumber === this.yearMonthPage);
    if (!idx) {
      this.nextYear();
      idx = this.years.find((v) => v.yearNumber === this.yearMonthPage);
    }
    this.selectedYearIndex = this.years.indexOf(idx);
  }

  pageChangeNext(): void {
    if (this.showYears && !this.showMonths) {
      this.nextYear();
    } else if (!this.showYears && this.showMonths) {
      this.nextYearsInMonths();
    } else if (!this.showYears && !this.showMonths) {
      this.nextMonth();
    }
  }

  pageChangePrevious(): void {
    if (this.showYears && !this.showMonths) {
      this.previousYear();
    } else if (!this.showYears && this.showMonths) {
      this.previousYearsInMonths();
    } else if (!this.showYears && !this.showMonths) {
      this.previousMonth();
    }
  }

  toggleVisibility(): void {
    this.showYears = !this.showYears;
    this.showMonths = false;
    this.setDaysOfMonth(this.yearMonthPage, this.monthPage);
  }

  emitDate(date: Date): void {
    this.DateChange.emit(date);
    this.change(date);
    if (this.dateInput) {
      // TODO: IMPLEMENT DYNAMIC LOCALE TO DATEPIPE
      const formatted = this.datePipe.transform(date, 'MM/dd/yyyy');
      this.dateInput.value = formatted;

      const dateObj = {
        day: date.getDate(),
        selected: false,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
      };
      this.selectDay(dateObj);
    }
  }

  // datepickerInputValue(): void {
  //   if (this.dateInput) {
  //     const input = this.dateInput;
  //     input.addEventListener('change', (v) => {
  //       const date = this.searchAndReturnDateObj(input.value);
  //       this.emitDate(date);
  //     });
  //   }
  // }

  searchAndReturnDateObj(dateString: string): Date {
    const date = new Date(dateString);

    if (date.toString() === 'Invalid Date') {
      return new Date();
    }

    return date;
  }

  writeValue(obj: Date): void {
    this.Date = obj;
    if (this.Date) {
      const dateSearched = this.searchAndReturnDateObj(this.Date.toString());
      if (dateSearched) {
        this.Date = dateSearched;
      }
      const dateObj = {
        day: this.Date.getDate(),
        selected: false,
        year: this.Date.getFullYear(),
        month: this.Date.getMonth() + 1,
      };
      this.selectDay(dateObj);
    }
  }

  registerOnChange(fn: any): void {
    this.change = fn;
  }

  registerOnTouched(fn: any): void {
    this.blur = fn;
  }

  private setPickerPositions(): void {
    const wrap = this.datepickerPosition.nativeElement as HTMLElement;
    const input = this.el.nativeElement.closest('.fieldset') as HTMLElement;
    const inputPos = input.getBoundingClientRect();
    wrap.style.top = inputPos.top + input.offsetHeight + 'px';
    wrap.style.left = inputPos.left + 'px';

    setTimeout(() => {
      if (inputPos.top + wrap.offsetHeight > window.innerHeight) {
        let pos = inputPos.top - wrap.offsetHeight + input.offsetHeight;
        (wrap.firstChild as HTMLElement).classList.add('bottom');
        if (pos < 0) {
          pos = 0;
        }
        wrap.style.top = pos + 'px';
      }
    }, 0);

    this.setBackdrop();
  }

  private setBackdrop(): void {
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    document.body.insertAdjacentElement('beforeend', backdrop);
    backdrop.addEventListener('click', (v) => {
      this.closePicker();
    });
  }

  private removeBackdrop(): void {
    const backdrop = document.querySelector('.backdrop');
    backdrop.remove();
  }

  private setToBody(): void {
    const datepicker = this.el.nativeElement.firstChild as HTMLElement;
    const body = document.body.querySelector('.p-components-container');
    body.insertAdjacentElement('beforeend', datepicker);
  }

  ngOnChanges(event: SimpleChanges): void {
    console.log(event.locale);
    if (!event.locale.isFirstChange()) {
      this.setCurrentDate();
    }
  }
}
