import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
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
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[p-datepicker-input], [appDatepickerInput], [pDatepickerInput]',
})
export class DatepickernewInputDirective {
  @Input() pForDatepicker: DatepickernewComponent;
  constructor(private el: ElementRef) {}

  @HostListener('keyup', ['$event'])
  setWrittenDate(event) {
    // const input = this.el.nativeElement as HTMLInputElement;
    // console.log(input.value);
  }
}

@Directive({
  selector: '[p-date-trigger], [appDateTriggerDirective], [pDateTrigger]',
})
export class DatepickernewTriggerDirective {
  @Input() triggerFor: any;

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
  selector: 'app-datepickernew',
  templateUrl: './datepickernew.component.html',
  styleUrls: ['./datepickernew.component.css'],
  animations: [pickerAnim],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickernewComponent),
      multi: true,
    },
  ],
})
export class DatepickernewComponent implements OnInit {
  isPickerOpen: boolean;

  currentDate: Date = new Date();
  selectedDate: Date;

  weekDaysShort: string[] = [];
  monthsShort: string[] = [
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

  monthPage: number;
  yearMonthPage: number;

  daysOfLastMonth: number[] = [];
  daysOfMonth: any[] = [];
  monthsOfYear: any[] = [];
  years: any[] = [];

  showYears: boolean;
  showMonths: boolean;

  @Input() locale = 'en-US';
  @Input() dateInput: HTMLInputElement;

  @Input() Date: Date;
  @Output() DateChange: EventEmitter<Date> = new EventEmitter<Date>();

  @ViewChild('datepickerPos') datepickerPosition: ElementRef;

  change = (_) => {};
  blur = (_) => {};

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
    this.setToBody();
    this.setCurrentDate();
  }

  private setCurrentDate() {
    const currentDate = this.currentDate;
    this.setDaysOfMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);
    this.setWeekdays();
  }

  private setDaysOfMonth(year: number, month: number) {
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
    const current = this.currentDate;
    current.setDate(current.getDate() - current.getDay());
    for (let i = 0; i < 7; i++) {
      this.weekDaysShort.push(
        current.toLocaleDateString(this.locale, { weekday: 'short' })
      );
      current.setDate(current.getDate() + 1);
    }
  }

  // SET MONTHS BASED ON LOCALE
  // setMonths(): void {
  //   const current = new Date(2021, 0, 1);
  //   current.setDate(current.getMonth());
  // }

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
      this.emitDate(this.selectedDate);
    }
  }

  previousMonth(): void {
    this.daysOfMonth = [];
    this.monthPage--;
    if (this.monthPage <= 0) {
      this.monthPage = 12;
      this.yearMonthPage--;
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

  emitDate(date: Date): void {
    this.DateChange.emit(date);
    this.change(date);
  }

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
}
