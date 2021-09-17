import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ripple-ex',
  templateUrl: './ripple-ex.component.html',
  styleUrls: ['./ripple-ex.component.css'],
})
export class RippleExComponent implements OnInit {
  center = false;
  unbound = false;
  disabled = false;
  color: string;
  radius: number;
  duration: number;

  showCodeSection2: boolean;

  constructor() {}

  ngOnInit() {}
}
