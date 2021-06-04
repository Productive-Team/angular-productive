import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-container-ex',
  templateUrl: './container-ex.component.html',
  styleUrls: ['./container-ex.component.css'],
})
export class ContainerExComponent implements OnInit {
  numb = 0;

  dateStr: string;

  loading = false;

  constructor() {}

  ngOnInit() {}

  rer(ev) {
    this.numb = ev;
  }

  sas(ev) {
    setTimeout(() => {
      this.dateStr = ev.formatted;
    }, 5);
  }
}
