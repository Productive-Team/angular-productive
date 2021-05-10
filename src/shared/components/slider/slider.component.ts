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
        // const po2 = this.el.nativeElement.firstChild.firstChild.firstChild
        //   .nextSibling.firstChild;
        this.calcValue(draggingPos, po);
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

  calcValue(x: number, progress): void {
    const positions = this.getSliderBoundRect();

    const offset = positions.left;
    const size = positions.width;
    const pos = x;

    let percentage = this.calcClamp((pos - offset) / size);
    percentage = 1 - percentage;
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
    let a = this.perctng(this.sliderValue);
    a = a * 100 + 1;
    const b = this.calcClamp(a, this.pSliderMinValue, this.pSliderMaxValue);
    console.log(b);
    progress.style.transform = `translateX(-${b}%)`;
    progress.parentElement.nextSibling.style.transform = `translateX(-${b}%) translateY(-50%)`;
    if (a >= 100) {
      progress.parentElement.nextSibling.classList.add('none');
    } else {
      progress.parentElement.nextSibling.classList.remove('none');
    }
  }

  getSliderBoundRect(): DOMRect {
    return this.el.nativeElement.firstChild.getBoundingClientRect();
  }

  calcClamp(val: number, min = 0, max = 1) {
    return Math.max(min, Math.min(val, max));
  }

  perctng(val) {
    return (
      ((val || 0) - this.pSliderMinValue) /
      (this.pSliderMaxValue - this.pSliderMinValue)
    );
  }
}
