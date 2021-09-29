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
  HostBinding,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector:
    '[p-datepicker-trigger], [appDatepickerTriggerDirective], [pDatepickerTrigger]',
})
export class DatepickerTriggerDirective implements OnInit {
  @Input() pDatepickerTrigger: DatepickerComponent;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const isInputText = this.el.nativeElement instanceof HTMLInputElement;
    if (isInputText) {
      this.pDatepickerTrigger.dateInput = this.el.nativeElement;
    }
  }

  @HostListener('click', ['$event'])
  openPicker(): void {
    this.pDatepickerTrigger.triggerOrigin = this.el.nativeElement;
    this.pDatepickerTrigger.openPicker();
  }

  @HostBinding('class.calendar-trigger')
  get setDefaultClass() {
    return true;
  }
}

const pickerAnim = trigger('datepickerAnim', [
  transition(':leave', [
    animate('150ms cubic-bezier(.3,.94,.47,.91)', style({ opacity: 0 })),
  ]),
]);

/**
 * @title Datepicker Component
 */
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
  daysOfMonth: DayObject[] = [];
  monthsOfYear: MonthObject[] = [];
  years: YearObject[] = [];

  showYears: boolean;
  showMonths: boolean;

  triggerOrigin: any;

  leftChevronDisabled: boolean;
  rightChevronDisabled: boolean;

  /**
   * Sets the locale of the datepicker, allowing it to easily translate into other languages
   *
   * For more info about locales see: https://www.science.co.il/language/Locale-codes.php
   */
  @Input() locale = 'en-US';

  /**
   * Sets an HTMLInput to attach a search change event,
   * being able to search a date and select it automatically
   */
  @Input() dateInput: HTMLInputElement;

  /**
   * Sets a minimum date, disabling all previous dates to be selected
   */
  @Input() minDate: Date;
  /**
   * Sets a maximum date, disabling all later dates to be selected
   */
  @Input() maxDate: Date;

  /**
   * Disables specific dates that are passed through the array
   */
  @Input() disabledDates: Date[] = [];

  /**
   * Disables specific days of the week in every month
   *
   * The number go from 0 to 6;
   */
  @Input() disabledDaysOfTheWeek: number[] = [];

  /**
   * Selected date value
   */
  @Input() date: Date;
  /**
   * Change event for date input
   */
  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();

  @ViewChild('datepickerPos') datepickerPosition: ElementRef;

  change = (_) => {};
  blur = (_) => {};

  // TODO: Implement a range picker and modal option

  constructor(private el: ElementRef) {}

  public openPicker(): void {
    this.isPickerOpen = true;
    this.setPickerPositions();
  }

  public closePicker(): void {
    this.isPickerOpen = false;
    this.removeBackdrop();
  }

  ngOnInit(): void {
    // Sets Datepicker general structure to .component-container div, so it can
    // work independent of overflow in the parents
    this.setToBody();
    // Sets a change event listener to the datepicker input in question, so it can update
    this.datepickerInputValue();
    // Set the date of the calendar based on current date
    // and selects the day
    this.setDates(this.date);
    if (this.dateInput) {
      setTimeout(() => {
        if (this.date) {
          const dateObj: DayObject = {
            day: this.date.getDate(),
            selected: false,
            year: this.date.getFullYear(),
            month: this.date.getMonth() + 1,
          };
          this.selectDay(dateObj);
        }
      }, 0);
    }
  }

  private setDates(date?: Date) {
    let currentDate = date;
    if (!date) {
      currentDate = this.currentDate;
    }
    this.setWeekdays();
    this.setMonths(currentDate.getFullYear());
    this.setYears(currentDate.getFullYear());
    this.setDaysOfMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }

  private setDaysOfMonth(year: number, month: number): void {
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

    this.monthPage = currentMonth;
    this.yearMonthPage = currentYear;

    let d = 1;
    for (; d <= daysOfCurrentMonth; d++) {
      const days: DayObject = {
        day: d,
        selected: false,
        year: currentYear,
        month: currentMonth,
      };

      const dateConversion = new Date(days.year, days.month - 1, days.day);
      if (this.minDate !== undefined) {
        if (dateConversion < this.minDate) {
          days.disabled = true;
        }
      }
      if (this.maxDate !== undefined) {
        if (dateConversion > this.maxDate) {
          days.disabled = true;
        }
      }

      this.disabledDates.forEach((y) => {
        if (
          y.getFullYear() === dateConversion.getFullYear() &&
          y.getMonth() === dateConversion.getMonth() &&
          y.getDate() === dateConversion.getDate()
        ) {
          days.disabled = true;
        }
      });

      this.disabledDaysOfTheWeek.forEach((x) => {
        if (dateConversion.getDay() === x) {
          days.disabled = true;
        }
      });

      if (this.minDate) {
        this.checkMinDays(currentYear, currentMonth);
      }
      if (this.maxDate) {
        this.checkMaxDays(currentYear, currentMonth);
      }

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

      const obj: MonthObject = {
        monthName: month,
        monthNumber: m,
        yearMonth: year,
        selected: false,
      };

      const dateConversion = new Date(obj.yearMonth, obj.monthNumber);
      if (this.minDate !== undefined) {
        if (
          dateConversion.getFullYear() <= this.minDate.getFullYear() &&
          dateConversion.getMonth() < this.minDate.getMonth()
        ) {
          obj.disabled = true;
        }
      }
      if (this.maxDate !== undefined) {
        if (
          dateConversion.getFullYear() >= this.maxDate.getFullYear() &&
          dateConversion.getMonth() > this.maxDate.getMonth()
        ) {
          obj.disabled = true;
        }
      }

      if (this.minDate) {
        this.checkMinMonths();
      }
      if (this.maxDate) {
        this.checkMaxMonths();
      }

      this.monthsOfYear.push(obj);
    }
  }

  setYears(currentYear: number): void {
    this.years = [];

    let minYear = currentYear;
    minYear -= 10;

    const yearQty = 20;

    let y = 0;
    for (; y < yearQty; y++) {
      minYear++;
      const yearFormat = new Date(minYear, 1, 1).toLocaleString(this.locale, {
        year: 'numeric',
      });
      const obj: YearObject = {
        year: yearFormat,
        selected: false,
        yearNumber: minYear,
      };
      if (this.minDate !== undefined) {
        if (obj.yearNumber < this.minDate.getFullYear()) {
          obj.disabled = true;
        }
      }
      if (this.maxDate !== undefined) {
        if (obj.yearNumber > this.maxDate.getFullYear()) {
          obj.disabled = true;
        }
      }

      if (minYear > 0) {
        this.years.push(obj);
      }
    }
    // if (this.years.length < 20 && this.years.length > 0) {
    //   yearQty = 29;
    //   for (; y < yearQty; y++) {
    //     minYear++;
    //     const yearFormat = new Date(minYear, 1, 1).toLocaleString(this.locale, {
    //       year: 'numeric',
    //     });
    //     const obj: YearObject = {
    //       year: yearFormat,
    //       selected: false,
    //       yearNumber: minYear,
    //     };

    //     if (this.minDate !== undefined) {
    //       if (obj.yearNumber < this.minDate.getFullYear()) {
    //         obj.disabled = true;
    //       }
    //     }
    //     if (this.maxDate !== undefined) {
    //       if (obj.yearNumber > this.maxDate.getFullYear()) {
    //         obj.disabled = true;
    //       }
    //     }

    //     if (minYear > 0) {
    //       this.years.push(obj);
    //     }
    //   }
    // }
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

  // Select months of a year
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

  // Advance to the previous month when showing the days, and it also advances
  // to the previous year when reaching january
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

    if (this.minDate) {
      this.checkMinDays(this.yearMonthPage, this.monthPage);
    }
    if (this.maxDate) {
      this.checkMaxDays(this.yearMonthPage, this.monthPage);
    }

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

  // Advance to the next month when showing the days, and it also advances
  // to next year when reaching december
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

    if (this.minDate) {
      this.checkMinDays(this.yearMonthPage, this.monthPage);
    }
    if (this.maxDate) {
      this.checkMaxDays(this.yearMonthPage, this.monthPage);
    }

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

  // Advance to the previous 20 years when showing the year list
  nextYear(): void {
    const lastYear = this.years[this.years.length - 1].yearNumber + 10;
    this.setYears(lastYear);
    if (this.minDate) {
      this.checkMinYear();
    }
    if (this.maxDate) {
      this.checkMaxYear();
    }
  }

  // Advance to the next 20 years when showing the year list
  previousYear(): void {
    const firstYear = this.years[0].yearNumber - 11;
    if (firstYear > 100) {
      this.setYears(firstYear);
    }
    if (this.minDate) {
      this.checkMinYear();
    }
    if (this.maxDate) {
      this.checkMaxYear();
    }
  }

  // Advance to previous year when showing the months
  previousYearsInMonths(): void {
    this.yearMonthPage--;
    let idx = this.years.find((v) => v.yearNumber === this.yearMonthPage);
    if (!idx) {
      this.previousYear();
      idx = this.years.find((v) => v.yearNumber === this.yearMonthPage);
    }
    this.selectedYearIndex = this.years.indexOf(idx);
    this.setMonths(this.yearMonthPage);
    if (this.minDate) {
      this.checkMinMonths();
    }
    if (this.maxDate) {
      this.checkMaxMonths();
    }
  }

  // Advance to next year when showing the months
  nextYearsInMonths(): void {
    this.yearMonthPage++;
    let idx = this.years.find((v) => v.yearNumber === this.yearMonthPage);
    if (!idx) {
      this.nextYear();
      idx = this.years.find((v) => v.yearNumber === this.yearMonthPage);
    }
    this.selectedYearIndex = this.years.indexOf(idx);
    this.setMonths(this.yearMonthPage);
    if (this.minDate) {
      this.checkMinMonths();
    }
    if (this.maxDate) {
      this.checkMaxMonths();
    }
  }

  // Function to execute when pressing the right chevron button
  pageChangeNext(): void {
    if (this.showYears && !this.showMonths) {
      this.nextYear();
    } else if (!this.showYears && this.showMonths) {
      this.nextYearsInMonths();
    } else if (!this.showYears && !this.showMonths) {
      this.nextMonth();
    }
  }

  // Function to execute when pressing the left chevron button
  pageChangePrevious(): void {
    if (this.showYears && !this.showMonths) {
      this.previousYear();
    } else if (!this.showYears && this.showMonths) {
      this.previousYearsInMonths();
    } else if (!this.showYears && !this.showMonths) {
      this.previousMonth();
    }
  }

  // Toggles menu visibility to show years or days
  toggleVisibility(): void {
    this.showYears = !this.showYears;
    this.showMonths = false;
    this.setDaysOfMonth(this.yearMonthPage, this.monthPage);
    if (this.showYears) {
      if (this.minDate) {
        this.checkMinYear();
      }
      if (this.maxDate) {
        this.checkMaxYear();
      }
    }
  }

  checkMaxYear(): void {
    if (
      this.years[this.years.length - 1].yearNumber > this.maxDate.getFullYear()
    ) {
      this.rightChevronDisabled = true;
    } else {
      this.rightChevronDisabled = false;
    }
  }

  checkMinYear(): void {
    if (this.years[0].yearNumber < this.minDate.getFullYear()) {
      this.leftChevronDisabled = true;
    } else {
      this.leftChevronDisabled = false;
    }
  }

  checkMaxMonths(): void {
    const year = this.yearMonthPage;
    if (year === this.maxDate.getFullYear()) {
      this.rightChevronDisabled = true;
    } else {
      this.rightChevronDisabled = false;
    }
  }

  checkMinMonths(): void {
    const year = this.yearMonthPage;
    if (year === this.minDate.getFullYear()) {
      this.leftChevronDisabled = true;
    } else {
      this.leftChevronDisabled = false;
    }
  }

  checkMaxDays(year: number, month: number): void {
    const maxYear = this.maxDate.getFullYear();
    const maxMonth = this.maxDate.getMonth() + 1;

    if (maxYear === year && maxMonth === month) {
      this.rightChevronDisabled = true;
    } else {
      this.rightChevronDisabled = false;
    }
  }

  checkMinDays(year: number, month: number): void {
    const minYear = this.minDate.getFullYear();
    const minMonth = this.minDate.getMonth() + 1;

    console.log(year === minYear, month === minMonth);
    if (year === minYear && month === minMonth) {
      this.leftChevronDisabled = true;
    } else {
      this.leftChevronDisabled = false;
    }
  }

  // Emits the date for ngModel, formControl and two-way value binding
  emitDate(date: Date): void {
    this.dateChange.emit(date);
    this.change(date);
    this.date = date;
    if (this.dateInput) {
      this.dateInput.value = date.toLocaleDateString(this.locale, {
        formatMatcher: 'best fit',
      });
    }
  }

  // Listens to input value changes so it can set the date written on it
  datepickerInputValue(): void {
    if (this.dateInput) {
      const input = this.dateInput;
      input.addEventListener('change', (v) => {
        const date = this.searchAndReturnDateObj(input.value);
        this.setDates(date);
        setTimeout(() => {
          const dateObj: DayObject = {
            day: date.getDate(),
            selected: false,
            year: date.getFullYear(),
            month: date.getMonth() + 1,
          };
          this.selectDay(dateObj);
        }, 0);

        this.emitDate(date);
      });
    }
  }

  // Transforms a string into a Date() value
  // returns current date, when string is an Invalid Date
  searchAndReturnDateObj(dateString: string): Date {
    let date = new Date(dateString);

    if (date.toString() === 'Invalid Date') {
      date = new Date();
    }

    if (this.minDate !== undefined) {
      if (date < this.minDate) {
        date = this.minDate;
      }
    }

    if (this.maxDate !== undefined) {
      if (date > this.maxDate) {
        date = this.maxDate;
      }
    }

    return date;
  }

  writeValue(obj: Date): void {
    this.date = obj;
    this.setDates(this.date);
  }

  registerOnChange(fn: any): void {
    this.change = fn;
  }

  registerOnTouched(fn: any): void {
    this.blur = fn;
  }

  private setPickerPositions(): void {
    const wrap = this.datepickerPosition.nativeElement as HTMLElement;
    let input = this.el.nativeElement.closest('.fieldset') as HTMLElement;
    if (input === null) {
      input = this.triggerOrigin as HTMLElement;
    }
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

      if (inputPos.left + wrap.offsetLeft > window.innerWidth) {
        wrap.style.left = null;
        wrap.style.right = '0px';
      }
    }, 0);

    this.setBackdrop();
  }

  private setBackdrop(): void {
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    backdrop.style.zIndex = '1001';
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
    if (event.locale !== undefined && !event.locale.isFirstChange()) {
      this.setDates(this.date);
    }
  }
}

export class DayObject {
  day: number;
  year: number;
  month: number;
  selected?: boolean;
  disabled?: boolean;
}

export class YearObject {
  year: string;
  yearNumber: number;
  selected?: boolean;
  disabled?: boolean;
}

export class MonthObject {
  monthName: string;
  yearMonth: number;
  monthNumber?: number;
  selected?: boolean;
  disabled?: boolean;
}

export class DateRange {
  initialDate: Date;
  endDate: Date;
}
