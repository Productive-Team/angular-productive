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
  @Input() pRippleDuration = 500;
  @Input() pRippleRadius = 0;

  isPointerDown?: boolean;
  activeRipples = [];
  transitionedRipples = [];
  constructor(private el: ElementRef) {
    el.nativeElement.classList.add('p-ripple-container');
  }

  ngOnInit(): void {
    if (this.pRippleUnbounded) {
      this.el.nativeElement.classList.add('p-ripple-unbounded');
    }
  }

  @HostListener('pointerdown', ['$event']) onMouseClick(event) {
    this.isPointerDown = true;
    this.createRippleEffect(event.target, event.clientX, event.clientY);
  }
  @HostListener('pointerup', ['$event']) onMouseUp(event) {
    this.isPointerDown = false;
    this.fadeOutRipple(event.target);
  }
  @HostListener('mouseout', ['$event']) onMouseOut(event) {
    this.isPointerDown = false;
    this.fadeOutRipple(event.target);
  }
  createRippleEffect(element: HTMLElement, x: number, y: number): void {
    const rippleContainerElement = element;
    const ripple = document.createElement('div');
    const elBoundRect = rippleContainerElement.getBoundingClientRect();
    ripple.classList.add('p-ripple');
    rippleContainerElement.insertAdjacentElement('beforeend', ripple);

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
    if (this.pRippleDuration > 0) {
      ripple.style.transitionDuration = `${this.pRippleDuration}ms`;
    } else {
      ripple.style.transitionDuration = `500ms`;
    }

    this.persistStyleChanges(ripple);

    ripple.style.transform = 'scale(1)';
    ripple.addEventListener('transitionend', () => {
      ripple.classList.add('ripple-transitioned');
    });
  }

  fadeOutRipple(element: HTMLElement): void {
    const rippleContainerElement = element;
    const ripplesTransitioned = rippleContainerElement.getElementsByClassName(
      'ripple-transitioned'
    );
    const ripplesNotTransitioned = rippleContainerElement.getElementsByClassName(
      'p-ripple'
    );
    let rnt = 0;
    for (; rnt < ripplesNotTransitioned.length; rnt++) {
      const ripNTransitioned = ripplesNotTransitioned[rnt] as HTMLDivElement;
      ripNTransitioned.addEventListener('transitionend', () => {
        ripNTransitioned.style.opacity = '0';
        ripNTransitioned.addEventListener('transitionend', () => {
          ripNTransitioned.remove();
        });
      });
    }
    let rt = 0;
    for (; rt < ripplesTransitioned.length; rt++) {
      const ripTransitioned = ripplesTransitioned[rt] as HTMLDivElement;
      ripTransitioned.style.opacity = '0';
      ripTransitioned.addEventListener('transitionend', () => {
        ripTransitioned.remove();
      });
    }
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
