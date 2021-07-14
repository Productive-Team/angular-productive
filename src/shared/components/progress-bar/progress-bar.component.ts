import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar, p-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
})
export class ProgressBarComponent implements OnInit {
  @Input() pProgressBarMode = 'determinate' || 'indeterminate' || 'query';
  @Input() pProgressBarValue = 50;
  constructor() {}

  ngOnInit() {}
}
