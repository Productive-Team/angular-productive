import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-group, p-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.css'],
})
export class TabGroupComponent implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.classList.add('tab-group-container');
  }
}
