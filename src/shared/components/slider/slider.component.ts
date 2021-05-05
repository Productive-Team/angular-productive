import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-slider, p-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements OnInit {
  @Input() pSliderId: string;
  @Input() pSliderMinValue = 0;
  @Input() pSliderMaxValue = 100;
  @Input() pSliderDisabled?: boolean;
  @Input() pSliderColor?: string;

  @Output() pSliderValue = new EventEmitter<number>();

  sliderValue = 0;
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.emitVal(this.pSliderMinValue);
    if (this.pSliderColor) {
      this.setSliderColor(this.pSliderColor);
    }
  }

  emitVal(event): void {
    this.pSliderValue.emit(event);
  }

  private setSliderColor(color: string): void {
    const clr = this.el.nativeElement.firstChild.firstChild as HTMLDivElement;
    clr.style.setProperty('--color', color);
  }
}
