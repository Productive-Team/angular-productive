import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner, p-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent implements OnInit {
  @Input() pSpinnerMode = 'determinate' || 'indeterminate' || 'query';
  @Input() pSpinnerProgress = 50;
  @Input() pSpinnerColor = 'var(--primary)';
  constructor() {}

  ngOnInit() {}

  // @HostBinding('class.query')
  // get val() {
  //   if (this.pSpinnerMode === 'query') {
  //     return this.pSpinnerMode;
  //   }
  // }
}
