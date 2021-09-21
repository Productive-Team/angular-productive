import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar, p-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
})
export class ProgressBarComponent {
  @Input() pProgressBarMode: ProgressBarMode = 'determinate';
  @Input() pProgressBarValue = 50;
}

type ProgressBarMode = 'determinate' | 'indeterminate' | 'query';
