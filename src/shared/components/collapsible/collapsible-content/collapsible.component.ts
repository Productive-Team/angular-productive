import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-collapsible, p-collapsible',
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.css'],
})
export class CollapsibleComponent implements OnInit {
  @Input() pCollapsibleId: string;

  constructor() {}

  ngOnInit() {}
}
