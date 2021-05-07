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

  sliderValue = 10;

  dragging = false;
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.emitVal(this.pSliderMinValue);
    if (this.pSliderColor) {
      this.setSliderColor(this.pSliderColor);
    }
    document.addEventListener('mousemove', (event) => {
      if (this.dragging) {
        const draggingPos = event.clientX;
        const po = this.el.nativeElement.firstChild.firstChild.firstChild
          .firstChild;
        const po2 = this.el.nativeElement.firstChild.firstChild.firstChild
          .nextSibling.firstChild;
        this.calcValue(draggingPos, po, po2);
      }
    });
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
  }
  // @HostListener('mousemove', ['$event']) draggingSlider(event) {
  //   if (this.dragging) {
  //     const draggingPos = event.clientX;
  //     const po = this.el.nativeElement.firstChild.firstChild.firstChild
  //       .firstChild;
  //     this.calcValue(draggingPos, po);
  //   }
  // }
  @HostListener('mouseup', ['$event'])
  isDragFalse(event) {
    this.dragging = false;
  }

  calcValue(x: number, progress, thumb): void {
    const positions = this.getSliderBoundRect();

    const offset = positions.left;
    const size = positions.width;
    const pos = x;

    let percentage = this.calcClamp((pos - offset) / size);

    if (percentage === 0) {
      percentage = this.pSliderMinValue;
    } else if (this.sliderValue === 1) {
      percentage = this.pSliderMaxValue;
    } else {
      const val =
        this.pSliderMinValue +
        percentage * (this.pSliderMaxValue - this.pSliderMinValue);

      this.sliderValue = this.calcClamp(
        val,
        this.pSliderMinValue,
        this.pSliderMaxValue
      );
    }
    percentage = 1 - percentage;
    const a = this.perctng(percentage);
    progress.style.transform = `translateX(-${a}%)`;
    console.log(a);
    thumb.style.transform = `translateX(${a}%)`;
  }

  getSliderBoundRect(): DOMRect {
    return this.el.nativeElement.firstChild.firstChild.getBoundingClientRect();
  }

  calcClamp(val: number, min = 0, max = 1) {
    return Math.max(min, Math.min(val, max));
  }

  perctng(val) {
    return (
      (((val || 0) - this.pSliderMinValue) /
        (this.pSliderMaxValue - this.pSliderMinValue)) *
      20000
    );
  }
}
