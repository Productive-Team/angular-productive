import {
  Directive,
  HostListener,
  ElementRef,
  OnInit,
  Input,
} from '@angular/core';

@Directive({
  selector: '[app-ripple], [p-ripple], [pRipple]',
})
export class RippleDirective implements OnInit {
  @Input() pRippleColor: string;
  @Input() pRippleCentered = false;
  @Input() pRippleUnbounded = false;
  @Input() pRippleDuration = 450;
  @Input() pRippleRadius = 0;
  constructor(private el: ElementRef) {
    el.nativeElement.classList.add('p-ripple-container');
  }

  ngOnInit(): void {
    if (this.pRippleUnbounded) {
      this.el.nativeElement.classList.add('p-ripple-unbounded');
    }
  }

  // @HostListener('pointerdown', ['$event']) createRipple(event) {
  //   const element = event.target;
  //   const ripple = document.createElement('div');
  //   ripple.setAttribute('class', 'ripple');
  //   element.insertAdjacentElement('beforeend', ripple);
  //   const positions = element.getBoundingClientRect();
  //   console.log(element);
  //   console.log(positions);

  //   let y = Math.abs(positions.top - event.clientY);
  //   let x = Math.abs(positions.left - event.clientX);
  //   if (this.rippleCentered) {
  //     x = positions.width / 2;
  //     y = positions.height / 2;
  //   }
  //   ripple.style.transform = `translateY(${y}px) translateX(${x}px)`;

  //   const a = this.distanceToFurthestCorner(x, y, positions);
  //   console.log(a);
  //   const scale = (element.clientWidth / 2) * 3.25;
  //   ripple.style.setProperty('--opacity', '1');
  //   ripple.style.width = `${a}px`;
  //   ripple.style.height = `${a}px`;
  //   console.log(ripple);
  //   // ripple.style.setProperty('--scale', scale.toString());

  //   if (this.ripplecolor !== undefined && this.ripplecolor !== '') {
  //     ripple.style.setProperty('--ripple-color', this.ripplecolor);
  //   }
  //   // function calmRipple() {
  //   // ripple.removeEventListener('transitionend', calmRipple);
  //   // ripple.style.setProperty('--opacity', '0');
  //   // ripple.addEventListener('transitionend', () => {
  //   //   ripple.remove();
  //   // });
  //   // }
  //   // ripple.addEventListener('transitionend', calmRipple);
  // }
  // @HostListener('pointerup', ['$event']) removeRippleOnPointerUp(event) {
  //   const element = event.target;
  //   const ripple = element.querySelectorAll('div');
  //   ripple.forEach((b) => {
  //     b.addEventListener('transitionend', () => {
  //       b.style.setProperty('--opacity', '0');
  //       b.addEventListener('transitionend', () => {
  //         b.remove();
  //       });
  //     });
  //   });
  // }
  // @HostListener('mouseout', ['$event']) removeRippleOnMouseOut(event): void {
  //   const element = event.target;
  //   const ripple = element.querySelectorAll('div');
  //   ripple.forEach((b) => {
  //     setTimeout(() => {
  //       b.style.setProperty('--opacity', '0');
  //       b.addEventListener('transitionend', () => {
  //         b.remove();
  //       });
  //     }, 800);
  //   });
  // }

  @HostListener('pointerdown', ['$event']) onMouseClick(event) {
    this.createRippleEffect(event.target, event.clientX, event.clientY);
  }

  createRippleEffect(element: HTMLElement, x: number, y: number): void {
    const rippleContainerElement = element;
    const ripple = document.createElement('div');
    const elBoundRect = rippleContainerElement.getBoundingClientRect();
    ripple.classList.add('p-ripple');
    rippleContainerElement.appendChild(ripple);

    const rippleRadius =
      this.pRippleRadius > 0
        ? this.pRippleRadius
        : this.distanceToFurthestCorner(x, y, elBoundRect);

    if (this.pRippleCentered) {
      x = elBoundRect.left - elBoundRect.width / 2;
      y = elBoundRect.top - elBoundRect.height / 2;
    }

    const offsetX = Math.abs(elBoundRect.x - x);
    const offsetY = Math.abs(elBoundRect.y - y);

    ripple.style.left = `${offsetX - rippleRadius}px`;
    ripple.style.top = `${offsetY - rippleRadius}px`;
    ripple.style.height = `${rippleRadius * 2}px`;
    ripple.style.width = `${rippleRadius * 2}px`;

    if (this.pRippleColor) {
      ripple.style.backgroundColor = this.pRippleColor;
    }
    ripple.style.transitionDuration = `${this.pRippleDuration}ms`;

    this.persistStyleChanges(ripple);

    ripple.style.transform = 'scale(1)';
  }

  persistStyleChanges(element: HTMLElement): void {
    window.getComputedStyle(element).getPropertyValue('opacity');
  }

  distanceToFurthestCorner(x: number, y: number, rect: ClientRect) {
    const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
    const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
    return Math.sqrt(distX * distX + distY * distY);
  }
}
