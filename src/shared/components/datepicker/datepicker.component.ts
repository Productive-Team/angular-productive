import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-datepicker, p-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
})
export class DatepickerComponent implements OnInit, AfterViewInit {
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

  showDays = true;
  showYears = false;
  showMonths = false;

  currentDate;
  constructor() {}

  ngOnInit() {
    this.setDays();
  }

  ngAfterViewInit(): void {
    this.currentDate = this.getCurrentDate();
  }

  setDays(): void {
    let i = 1;
    for (; i <= 31; i++) {
      const obj = { day: i, selected: false };
      this.days.push(obj);
    }
  }

  selectDay(day): void {
    this.selectedDate = day;
    const selDay = this.days.find((x) => x.day === day);
    selDay.selected = true;
    // const selec = document.querySelector('.day.selected');
    // if (selec) {
    //   selec.classList.remove('selected');
    // }
    // const sas = document.getElementById('day-' + day);
    // sas.classList.add('selected');
    // this.emitDate(day, 5, 2021);
  }

  emitDate(day: number, month: number, year: number): Date {
    const dateObj = new Date(day, month, year);
    console.log(dateObj);
    return dateObj;
  }

  getCurrentDate(): any {
    const date = new Date();
    const obj = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
    this.selectDay(obj.day);
    return obj;
  }
}
