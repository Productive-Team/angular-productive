import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-ex',
  templateUrl: './all-ex.component.html',
  styleUrls: ['./all-ex.component.css'],
})
export class AllExComponent {
  bolltest: boolean = true;
  otherCheck: boolean = true;

  numb: number = 50;
  constructor() {}
}
