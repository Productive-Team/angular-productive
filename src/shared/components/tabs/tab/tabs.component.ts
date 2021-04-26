import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab, p-tab',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent implements OnInit {
  @Input() pTabLabel: string;

  constructor() {}

  ngOnInit() {}
}
