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
  @Input() pProgress = 0;

  backgroundColor: string;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    setTimeout(() => {
      if (!this.pProgressDeterminate) {
        if (this.pProgressType === 'spinner') {
          const el = this.el.nativeElement.firstChild.firstChild
            .firstChild as HTMLDivElement;
          el.classList.add('animated');
          const el2 = this.el.nativeElement.firstChild as HTMLDivElement;
          el2.classList.add('rotate');
        } else if (this.pProgressType === 'bar') {
          const el = this.el.nativeElement.firstChild.nextSibling
            .firstChild as HTMLDivElement;
          console.log(el);
          el.classList.add('animated');
        }
      }
    }, 0);
    if (this.pProgressType === 'bar') {
      this.setColorToBar(this.pProgressColor);
    }
  }

  setColorToBar(color: string): void {
    switch (color) {
      case 'var(--primary)':
        this.backgroundColor = 'var(--primaryLowOpacity)';
        break;
      case 'var(--secondary)':
        this.backgroundColor = 'var(--secondaryLowOpacity)';
        break;
      default:
        this.backgroundColor = this.setsColorToLowOpacity(color);
    }
  }

  private setsColorToLowOpacity(color: string): string {
    if (/^#(?:[A-Fa-f0-9]{3}){1,2}$/.test(color)) {
      color = color + '1e';
    } else if (
      /^rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}[)]$/.test(
        color
      )
    ) {
      let rgb = color.trim();
      const endrgb = rgb.lastIndexOf(')');
      rgb = rgb.slice(0, 3) + 'a' + rgb.slice(3, endrgb);
      rgb = rgb + ',0.15)';
      color = rgb;
    }
    return color;
  }
}
