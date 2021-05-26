import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkbox-ex',
  templateUrl: './checkbox-ex.component.html',
  styleUrls: ['./checkbox-ex.component.css'],
})
export class CheckboxExComponent implements OnInit {
  dis = false;
  indet = false;
  chck = false;

  constructor() {}

  ngOnInit() {}
}
