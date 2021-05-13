import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-container-ex',
  templateUrl: './container-ex.component.html',
  styleUrls: ['./container-ex.component.css'],
})
export class ContainerExComponent implements OnInit {
  numb = 0;

  constructor() {}

  ngOnInit() {}

  rer(ev) {
    this.numb = ev;
  }
}
