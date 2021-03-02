import {
  Directive,
  HostListener,
  ElementRef,
  OnInit,
  Input,
} from '@angular/core';

@Directive({
  selector: '[appRipple]',
})
export class RippleDirective {
  @Input() rippleColor: string;
  @Input() rippleCentered = false;
  @Input() rippleUnbounded = false;
  constructor(el: ElementRef) {
    el.nativeElement.classList.add('ripple-container');
    console.log(this.rippleUnbounded);
    if (this.rippleUnbounded) {
      console.log('ob');
      el.nativeElement.style.overflow = 'visible';
    }
  }

  @HostListener('mousedown', ['$event']) logCons(event) {
    const element = event.target;
    const ripple = document.createElement('span');
    ripple.setAttribute('class', 'ripple');
    element.insertAdjacentElement('beforeend', ripple);
    const positions = element.getBoundingClientRect();

    const y = Math.abs(positions.top - event.clientY);
    const x = Math.abs(positions.left - event.clientX);
    const scale = Math.min(positions.height, positions.width);
    ripple.style.transform = `translateY(${y}px) translateX(${x}px)`;
    ripple.style.setProperty('--opacity', '1');
    ripple.style.setProperty('--scale', scale.toString());

    function calmRipple() {
      ripple.removeEventListener('transitionend', calmRipple);
      ripple.style.setProperty('--opacity', '0');
      ripple.addEventListener('transitionend', () => {
        ripple.remove();
      });
    }
    ripple.addEventListener('transitionend', calmRipple);
  }
}
