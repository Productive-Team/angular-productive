import {
  Directive,
  HostListener,
  ElementRef,
  OnInit,
  Input,
  AfterViewInit,
  HostBinding,
} from '@angular/core';

@Directive({
  selector: '[app-ripple], [p-ripple], [pRipple]',
})
export class RippleDirective implements AfterViewInit {
  /**
   * Changes the color of the ripple. The color needs to have a reduced opacity otherwise it can hide content;
   */
  @Input('pRippleColor') color: string;
  /**
   * Centers the ripple in the element, and no matter where you click, it will always
   * generate from the center;
   */
  @Input('pRippleCentered') centered: boolean;
  /**
   * Removes the overflow: hidden property from the ripple container, allowing for the
   * entire ripple to appear on screen, not only inside the element;
   */
  @Input('pRippleUnbounded') unbounded: boolean;

  /**
   * This option makes the ripple effect duration slower of faster, depending on the value in milliseconds;
   */
  @Input('pRippleDuration')
  duration = 500;
  /**
   * Changes the size of the ripple, and mantains it consistent independent of host element size;
   */
  @Input('pRippleRadius') radius = 0;
  /**
   * Reference an HTMLElement, and pass the element through this Input;
   *
   * The ripple will always be centered if you're using this type of trigger;
   *
   * Ex:
   *  <div pRipple [pRippleTriggerFor]="trigger"></div>
   *  <div #trigger></div>
   */
  @Input() pRippleTriggerFor: HTMLElement;
  /**
   * Disables the ripple effect on an element
   */
  @Input('pRippleDisabled') disabled = false;

  isPointerDown?: boolean;
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Checks if pRippleTriggerId is different from undefined
    // and sets container classes
    if (!this.disabled) {
      if (this.pRippleTriggerFor) {
        const element = this.pRippleTriggerFor;
        element.classList.add('p-ripple-container');
        if (this.unbounded) {
          element.classList.add('p-ripple-unbounded');
        }
      }
    }
  }

  @HostBinding('class.p-ripple-container')
  get val() {
    if (!this.pRippleTriggerFor) {
      return true;
    }
  }

  @HostBinding('class.p-ripple-unbounded') get unbound() {
    return this.unbounded;
  }

  // Creates ripple on pointer down
  @HostListener('pointerdown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseClick(event) {
    this.isPointerDown = true;
    if (!this.disabled) {
      this.createRippleEffect(event.target, event.clientX, event.clientY);
    }
  }
  // Removes ripple on pointer up after animation end
  @HostListener('pointerup', ['$event'])
  @HostListener('touchend', ['$event'])
  onMouseUp(event) {
    this.isPointerDown = false;
    if (!this.disabled) {
      this.fadeOutRipple(event.target);
    }
  }

  // Removes ripple when pointer goes out of the element
  @HostListener('mouseout', ['$event'])
  @HostListener('touchmove', ['$event'])
  onMouseOut(event) {
    this.isPointerDown = false;
    if (!this.disabled) {
      this.fadeOutRipple(event.target);
    }
  }

  // Recieves a HTMLElement beign the element at which to create the effect
  // Recieves a X coordinate, beign the clientX
  // Recieves a Y coordinate, beign the clientY
  private createRippleEffect(element: HTMLElement, x: number, y: number): void {
    let rippleContainerElement;
    if (this.pRippleTriggerFor) {
      rippleContainerElement = this.pRippleTriggerFor;
    } else {
      rippleContainerElement = element;
    }

    const ripple = document.createElement('div');
    const elBoundRect = rippleContainerElement.getBoundingClientRect();
    ripple.classList.add('p-ripple');
    rippleContainerElement.insertAdjacentElement('beforeend', ripple);

    if (this.centered || this.pRippleTriggerFor) {
      x = elBoundRect.left + elBoundRect.width / 2;
      y = elBoundRect.top + elBoundRect.height / 2;
    }
    const rippleRadius =
      this.radius > 0
        ? this.radius
        : this.calcDistanceToFurthestCorner(x, y, elBoundRect);

    const offsetX = Math.abs(elBoundRect.x - x);
    const offsetY = Math.abs(elBoundRect.y - y);

    ripple.style.left = `${offsetX - rippleRadius}px`;
    ripple.style.top = `${offsetY - rippleRadius}px`;
    ripple.style.height = `${rippleRadius * 2}px`;
    ripple.style.width = `${rippleRadius * 2}px`;

    if (this.color) {
      ripple.style.backgroundColor = this.color;
    }
    if (this.duration > 0) {
      ripple.style.transitionDuration = `${this.duration}ms`;
    } else {
      ripple.style.transitionDuration = `500ms`;
    }

    // Persist changes so scale can animate properly
    // setTimeout(() => {}, 0) works too
    this.persistStyleChanges(ripple);

    ripple.style.transform = 'scale(1)';
    ripple.addEventListener('transitioncancel', () => {
      this.fadeOutRipple(ripple);
    });
    ripple.addEventListener('transitionend', () => {
      ripple.classList.add('ripple-transitioned');
    });
  }

  // Removes ripple after all animations are done
  // Recieves a Html Element
  private fadeOutRipple(element: HTMLElement): void {
    let rippleContainerElement;
    if (this.pRippleTriggerFor) {
      rippleContainerElement = this.pRippleTriggerFor;
    } else {
      rippleContainerElement = element;
    }
    const ripplesTransitioned = rippleContainerElement.getElementsByClassName(
      'ripple-transitioned'
    );
    const ripplesNotTransitioned =
      rippleContainerElement.getElementsByClassName('p-ripple');
    let rnt = 0;
    for (; rnt < ripplesNotTransitioned.length; rnt++) {
      const ripNTransitioned = ripplesNotTransitioned[rnt] as HTMLDivElement;
      ripNTransitioned.addEventListener('transitionend', () => {
        ripNTransitioned.style.opacity = '0';
        ripNTransitioned.addEventListener('transitionend', () => {
          ripNTransitioned.remove();
        });
      });
      ripNTransitioned.addEventListener('transitioncancel', () => {
        ripNTransitioned.remove();
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

  // Persist style changes so scale can animate properly
  private persistStyleChanges(element: HTMLElement): void {
    window.getComputedStyle(element).getPropertyValue('opacity');
  }

  // Calcs the distance to the furthest corner of the element
  private calcDistanceToFurthestCorner(x: number, y: number, rect: any) {
    const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
    const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
    return Math.sqrt(distX * distX + distY * distY);
  }
}
