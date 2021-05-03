import {
  Component,
  ElementRef,
  Input,
  OnInit,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-progress-indicators, p-progress-indicators',
  templateUrl: './progress-indicators.component.html',
  styleUrls: ['./progress-indicators.component.css'],
})
export class ProgressIndicatorsComponent {
  @Input() pProgressType = 'spinner';
  @Input() pProgressColor = 'var(--primary)';
  @Input() pProgressStatus: string;
  @Input() pProgressSize = 0;
  // @Input() pSpinnerProgress: number;
  // @Input() pBarProgress: number;

  constructor(private el: ElementRef) {}
}
