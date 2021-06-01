import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-datepicker, p-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
})
export class DatepickerComponent implements OnInit {
  @Input() pDatepickerType: string;

  years = [];
  months = [
    'January',
    'February',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  days = [];

  selectedDate;

  currMonth;
  currYear;

  showDays = true;
  showYears = false;
  showMonths = false;

  currentDate;
  constructor() {}

  ngOnInit() {
    this.currentDate = this.getCurrentDate();
  }

  setDays(year: number, month: number): void {
    this.days = [];
    const allDays = new Date(year, month, 0).getDate();
    let i = 1;
    for (; i <= allDays; i++) {
      const obj = { day: i, selected: false };
      this.days.push(obj);
    }
  }

  nextMonth() {
    this.currentDate.month++;
    if (this.currentDate.month > 12) {
      this.currentDate.month = 2;
      this.currentDate.year++;
      this.currYear = this.currentDate.year;
      // this.currMonth = this.currentDate.month[this.currMonth];
    }
    let index;
    index = this.currentDate.month - 2;
    console.log(index);
    this.currMonth = this.months[index];
    this.setDays(this.currentDate.year, this.currentDate.month);
  }

  selectDay(day): void {
    const oth = this.days.find((x) => x.selected === true);
    if (oth) {
      oth.selected = false;
    }
    const selDay = this.days.find((x) => x.day === day.day);
    selDay.selected = true;
    this.selectedDate = selDay;
    this.emitDate(2021, 5, this.selectedDate.day);
  }

  emitDate(year: number, month: number, day: number): Date {
    const dateObj = new Date(year, month, day);
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
    this.currMonth = this.months[obj.month - 2];
    this.currYear = obj.year;
    this.selectDay(obj);
    return obj;
  }
}
