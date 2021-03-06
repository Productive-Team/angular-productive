import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  forwardRef,
  AfterViewInit,
  HostBinding,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-slider, p-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
})
export class SliderComponent implements OnInit, AfterViewInit {
  @Input() pSliderId: string;
  @Input() pSliderMinValue = 0;
  @Input() pSliderMaxValue = 100;
  @Input() pSliderDisabled?: boolean;
  @Input() pSliderColor?: string;
  @Input() pSliderInverted: boolean;
  @Input() pSliderVertical: boolean;

  isMDragging = false;

  pSliderValue = 0;

  percentage: number;
  constructor(private el: ElementRef) {}

  change = (_) => {};
  blur = (_) => {};

  ngOnInit() {
    this.setEventListeners();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setSliderColor(this.pSliderColor);
    }, 0);
  }

  private setSliderColor(color: string): void {
    const clr = this.el.nativeElement.firstChild.firstChild as HTMLDivElement;
    clr.style.setProperty('--color', color);
  }

  private setEventListeners(): void {
    document.addEventListener('mousemove', (event) => {
      if (this.isMDragging) {
        this.slideFunct(event);
      }
    });
    document.addEventListener('mouseup', (event) => {
      this.isMDragging = false;
    });
  }

  writeValue(obj: number): void {
    this.pSliderValue = obj;
    this.calculatePositions(
      (this.pSliderValue - this.pSliderMinValue) /
        (this.pSliderMaxValue - this.pSliderMinValue)
    );
    this.percentage = this.calcClamp(this.pSliderValue / this.pSliderMaxValue);
  }

  registerOnChange(fn: any): void {
    this.change = fn;
  }

  registerOnTouched(fn: any): void {
    this.blur = fn;
  }

  @HostListener('mousedown', ['$event']) isDragging(event) {
    this.isMDragging = true;
  }

  @HostListener('click', ['$event']) clickSelect(event) {
    this.valueCalculation(event.clientX);
  }

  slideFunct(event: MouseEvent): void {
    const mousePosX = event.clientX;
    this.valueCalculation(mousePosX);
  }

  valueCalculation(xPos: number): void {
    const positions = this.getSliderBoundRect();
    const leftOffset = positions.left;
    const sliderSize = positions.width;

    const percentage = this.calcClamp((xPos - leftOffset) / sliderSize);
    this.percentage = percentage;
    const actualValue = Math.round(
      this.pSliderMinValue +
        percentage * (this.pSliderMaxValue - this.pSliderMinValue)
    );
    this.pSliderValue = actualValue;
    this.change(this.pSliderValue);
    this.calculatePositions(percentage);
  }

  calculatePositions(percentage: number): void {
    let pctg = percentage * 100;
    const thumb = this.el.nativeElement.firstChild.lastChild as HTMLDivElement;
    const slider = this.el.nativeElement.firstChild.firstChild
      .firstChild as HTMLDivElement;

    if (pctg > 100) {
      pctg = 100;
    } else if (pctg < 0) {
      pctg = 0;
    }

    // if (this.pSliderInverted) {
    //   slider.style.transform = `translateX(${100 - pctg}%)`;
    //   thumb.style.transform = `translateX(${100 - pctg}%)`;
    // } else if (!this.pSliderInverted) {
    slider.style.transform = `translateX(-${100 - pctg}%)`;
    thumb.style.transform = `translateX(-${100 - pctg}%)`;
    // }
    // calculate px position
    // positions.width * pctg / 100;
  }

  calcClamp(val: number, min = 0, max = 1) {
    return Math.max(min, Math.min(val, max));
  }
  getSliderBoundRect(): DOMRect {
    return this.el.nativeElement.firstChild.getBoundingClientRect();
  }

  @HostBinding('class.inverted')
  get invertedValue() {
    return this.pSliderInverted;
  }
}
