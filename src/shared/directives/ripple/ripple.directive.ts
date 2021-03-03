import {
  Directive,
  HostListener,
  ElementRef,
  OnInit,
  Input,
  Host,
  HostBinding,
} from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[pRipple]',
})
export class RippleDirective implements OnInit {
  @Input() ripplecolor: string;
  @Input() rippleCentered = false;
  @Input() rippleUnbounded = false;
  constructor(private el: ElementRef) {
    el.nativeElement.classList.add('ripple-container');
  }

  ngOnInit(): void {
    if (this.rippleUnbounded) {
      this.el.nativeElement.style.overflow = 'visible';
    }
  }

  @HostListener('pointerdown', ['$event']) logCons(event) {
    const element = event.target;
    const ripple = document.createElement('span');
    ripple.setAttribute('class', 'ripple');
    element.insertAdjacentElement('beforeend', ripple);
    const positions = element.getBoundingClientRect();

    const y = Math.abs(positions.top - event.clientY);
    const x = Math.abs(positions.left - event.clientX);
    const scale = Math.min(positions.width + positions.height);
    // let scale = Math.min(positions.width, positions.height);
    if (this.rippleCentered === false) {
      ripple.style.transform = `translateY(${y}px) translateX(${x}px)`;
    } else {
      const widthHalf = positions.width / 2.05;
      const heightHalf = positions.height / 2.05;
      ripple.style.top = heightHalf + 'px';
      ripple.style.left = widthHalf + 'px';
    }
    ripple.style.setProperty('--opacity', '1');
    ripple.style.setProperty('--scale', scale.toString());

    if (this.ripplecolor !== undefined && this.ripplecolor !== '') {
      ripple.style.setProperty('--ripple-color', this.ripplecolor);
    }
    // function calmRipple() {
    // ripple.removeEventListener('transitionend', calmRipple);
    // ripple.style.setProperty('--opacity', '0');
    // ripple.addEventListener('transitionend', () => {
    //   ripple.remove();
    // });
    // }
    // ripple.addEventListener('transitionend', calmRipple);
  }
  @HostListener('pointerup', ['$event']) logPoint(event) {
    const element = event.target;
    const ripple = element.querySelectorAll('span');
    ripple.forEach((b) => {
      b.addEventListener('transitionend', () => {
        b.style.setProperty('--opacity', '0');
        b.addEventListener('transitionend', () => {
          b.remove();
        });
      });
    });
  }
  @HostListener('mouseout', ['$event']) mouseOut(event): void {
    const element = event.target;
    const ripple = element.querySelectorAll('span');
    ripple.forEach((b) => {
      setTimeout(() => {
        b.style.setProperty('--opacity', '0');
        b.addEventListener('transitionend', () => {
          b.remove();
        });
      }, 800);
    });
  }
}
