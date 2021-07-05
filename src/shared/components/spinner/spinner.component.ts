import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner, p-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent implements OnInit {
  @Input() pSpinnerDeterminate = false;
  @Input() pSpinnerProgress = 100;
  @Input() pSpinnerColor = 'var(--primary)';
  constructor() {}

  ngOnInit() {}
}
