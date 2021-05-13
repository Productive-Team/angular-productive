import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
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
  dragging = false;
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.emitVal(this.pSliderMinValue);
    if (this.pSliderColor) {
      this.setSliderColor(this.pSliderColor);
    }
  }

  addEventListenerSlider() {
    document.addEventListener('mousemove', (event) => {
      this.sliding(event);
    });
    document.addEventListener('mouseup', (event) => {
      this.dragging = false;
      this.removeEventListenerSlider();
    });
  }

  removeEventListenerSlider() {
    document.removeEventListener('mousemove', (event) => {
      this.sliding(event);
    });
    document.removeEventListener('mouseup', (event) => {
      this.dragging = false;
      this.removeEventListenerSlider();
    });
  }

  sliding(event: any) {
    if (this.dragging) {
      const draggingPos = event.clientX;
      const thumbContainer =
        this.el.nativeElement.firstChild.firstChild.firstChild.firstChild;
      this.calcValue(draggingPos, thumbContainer);
    }
  }

  emitVal(event): void {
    this.pSliderValue.emit(event);
  }

  private setSliderColor(color: string): void {
    const clr = this.el.nativeElement.firstChild.firstChild as HTMLDivElement;
    clr.style.setProperty('--color', color);
  }

  @HostListener('mousedown', ['$event']) isDragTrue(event) {
    this.dragging = true;
    this.addEventListenerSlider();
    this.sliding(event);
  }

  calcValue(x: number, progress): void {
    const positions = this.getSliderBoundRect();
    const offset = positions.left;
    const size = positions.width;
    const pos = x;

    let percentage = this.calcClamp((pos - offset) / size);
    if (percentage === 0) {
      percentage = this.pSliderMinValue;
    } else if (percentage === 1) {
      percentage = this.pSliderMaxValue;
    } else {
      const val =
        this.pSliderMinValue +
        percentage * (this.pSliderMaxValue - this.pSliderMinValue);

      this.sliderValue = Math.round(val);
      this.emitVal(this.sliderValue);
    }
    percentage = 1 - percentage;
    const progressIndicator = Math.round(percentage * 100);
    console.log(progressIndicator);
    progress.firstChild.style.transform = `translateX(-${progressIndicator}%)`;
    progress.parentElement.parentElement.nextSibling.style.transform = `translateX(-${progressIndicator}%) translateY(-50%)`;

    if (progressIndicator >= 100) {
      progress.parentElement.parentElement.nextSibling.firstChild.classList.add(
        'none'
      );
    } else {
      progress.parentElement.parentElement.nextSibling.firstChild.classList.remove(
        'none'
      );
    }
  }

  getSliderBoundRect(): DOMRect {
    return this.el.nativeElement.firstChild.getBoundingClientRect();
  }

  calcClamp(val: number, min = 0, max = 1) {
    return Math.max(min, Math.min(val, max));
  }
}
