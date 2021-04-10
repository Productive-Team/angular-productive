import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  hasShadow = true;
  @HostListener('window:resize', ['$event']) onResize(event) {
    if (window.matchMedia('screen and (max-width:600px)').matches) {
      this.hasShadow = false;
    } else {
      this.hasShadow = true;
    }
  }
  constructor() {}

  ngOnInit() {
    if (window.matchMedia('screen and (max-width:600px)').matches) {
      this.hasShadow = false;
    } else {
      this.hasShadow = true;
    }
  }
}
