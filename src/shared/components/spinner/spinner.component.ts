import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner, p-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent {
  @Input() pSpinnerMode: SpinnerMode = 'determinate';
  @Input() pSpinnerProgress = 50;
  @Input() pSpinnerColor = 'var(--primary)';
}

type SpinnerMode = 'determinate' | 'indeterminate' | 'query';
