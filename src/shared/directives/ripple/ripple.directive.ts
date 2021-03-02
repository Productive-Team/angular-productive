import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appRipple]',
})
export class RippleDirective {
  constructor(elrf: ElementRef) {
    elrf.nativeElement.style.color = 'red';
    console.log(elrf);
  }

  @HostListener('onclick', ['$event']) logCons() {
    console.log('object');
  }
}
