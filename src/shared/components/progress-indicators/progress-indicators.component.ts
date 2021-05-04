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
export class ProgressIndicatorsComponent implements OnInit {
  @Input() pProgressType = 'spinner';
  @Input() pProgressColor = 'var(--primary)';
  @Input() pProgressDeterminate = true;
  @Input() pProgressSize = 0;
  // @Input() pSpinnerProgress: number;
  // @Input() pBarProgress: number;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    setTimeout(() => {
      if (!this.pProgressDeterminate) {
        const el = this.el.nativeElement.firstChild.firstChild
          .firstChild as HTMLDivElement;
        el.classList.add('animated');
        if (this.pProgressType === 'spinner') {
          const el2 = this.el.nativeElement.firstChild as HTMLDivElement;
          el2.classList.add('rotate');
        }
      }
    }, 0);
  }
}
