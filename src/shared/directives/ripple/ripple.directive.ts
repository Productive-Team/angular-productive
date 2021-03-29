import {
  Directive,
  HostListener,
  ElementRef,
  OnInit,
  Input,
  AfterViewInit,
} from '@angular/core';

@Directive({
  selector: '[app-ripple], [p-ripple], [pRipple]',
})
export class RippleDirective implements OnInit, AfterViewInit {
  /**
   * Recieves a string value with either a hexadecimal or rgba value.
   * It's default value is #00000013, so there's no need to use it if you don't want to customize it;
   *
   * The color needs to have a reduced opacity otherwise it can hide the element's content;
   *
   * Example:
   *  <div pRipple pRippleColor="rgba(255,0,0,0.15)"></div>
   *  <div pRipple pRippleColor="#ff000026"></div>
   */
  @Input() pRippleColor: string;
  /**
   * Recieves a boolean value beign either true or false, however it's default state is always false
   * so there's no need to use it if you don't want this option;
   *
   * This option centers the ripple in the element, and no matter where you click, it will always
   * generate from the center;
   *
   * Example:
   *  <div pRipple [pRippleCentered]="true"></div>
   */
  @Input() pRippleCentered = false;
  /**
   * Recieves a boolean value beign either true or false, however it's default state is always false
   * so there's no need to use it if you don't want this option;
   *
   * This option removes the overflow: hidden property from the ripple container, allowing for the
   * entire ripple to appear on screen, not only inside the element;
   *
   * Example:
   *  <div pRipple [pRippleUnbounded]="true"></div>
   */
  @Input() pRippleUnbounded = false;
  /**
   * Recieves a number, and it's default is always 500 so there's no need to use it if you don't want this option;
   *
   * This option makes the ripple effect duration higher or lower, depending on the value you put, always beign in
   * ms;
   *
   * Example:
   *  <!-- Makes ripple transition duration be 1 second -->
   *  <div pRipple [pRippleDuration]="1000"></div>
   */
  @Input() pRippleDuration = 500;
  /**
   * Recieves a number, and it's default is always 0 because it is calculated in the createRippleEffect function;
   *
   * This option makes the ripple effect radius bigger or smaller, and always consistent independent of the element;
   *
   * Example:
   *  <div pRipple [pRippleRadius]="50"></div>
   */
  @Input() pRippleRadius = 0;
  /**
   * Recieves a string, and it's default is undefined;
   *
   * This option makes the element with the directive of pRipple be a trigger to a ripple effect in another element;
   *
   * For it to work you will need two element, one with the directive and all the configurations you want,
   * and the other with a custom id;
   *
   * You then set the pRippleTriggerId value as the custom id on the second element you created, and that's it.
   * Ripples will be generated in the element with an id, with the trigger beign the element with the directive;
   *
   * Example:
   * <!-- Trigger Element -->
   *  <div pRipple [pRippleTriggerId]="'myCustomId'"></div>
   * <!-- Element where ripples will appear -->
   *  <div id="myCustomId"></div>
   *
   * -Note-
   *   If the ripple is not centered, then the Y axis will be inverted and the effect will play out quicker, there's no fix at the moment;
   *   If you think the effect is too quick with the ripple not beign centered, then make the duration higher, that can fix it;
   */
  @Input() pRippleTriggerId: string;

  isPointerDown?: boolean;
  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Checks if pRippleTriggerId is different from undefined
    // and sets container classes
    if (this.pRippleTriggerId) {
      const element = document.getElementById(
        this.pRippleTriggerId
      ) as HTMLDivElement;
      element.classList.add('p-ripple-container');
      if (this.pRippleUnbounded) {
        element.classList.add('p-ripple-unbounded');
      }
    } else {
      this.el.nativeElement.classList.add('p-ripple-container');
      if (this.pRippleUnbounded) {
        this.el.nativeElement.classList.add('p-ripple-unbounded');
      }
    }
  }

  // Creates ripple on pointer down
  @HostListener('pointerdown', ['$event']) onMouseClick(event) {
    this.isPointerDown = true;
    this.createRippleEffect(event.target, event.clientX, event.clientY);
  }
  // Removes ripple on pointer up after animation end
  @HostListener('pointerup', ['$event']) onMouseUp(event) {
    this.isPointerDown = false;
    this.fadeOutRipple(event.target);
  }
  // Removes ripple when pointer goes out of the element
  @HostListener('mouseout', ['$event']) onMouseOut(event) {
    this.isPointerDown = false;
    this.fadeOutRipple(event.target);
  }

  // Recieves a HTMLElement beign the element at which to create the effect
  // Recieves a X coordinate, beign the clientX
  // Recieves a Y coordinate, beign the clientY
  private createRippleEffect(element: HTMLElement, x: number, y: number): void {
    let rippleContainerElement;
    if (this.pRippleTriggerId) {
      rippleContainerElement = document.getElementById(
        this.pRippleTriggerId
      ) as HTMLDivElement;
    } else {
      rippleContainerElement = element;
    }

    const ripple = document.createElement('div');
    const elBoundRect = rippleContainerElement.getBoundingClientRect();
    ripple.classList.add('p-ripple');
    rippleContainerElement.insertAdjacentElement('beforeend', ripple);

    let rippleRadius;
    if (this.pRippleCentered) {
      x = elBoundRect.left - elBoundRect.width / 2;
      y = elBoundRect.top - elBoundRect.height / 2;
      rippleRadius = elBoundRect.width / 1.4;
    } else {
      rippleRadius =
        this.pRippleRadius > 0
          ? this.pRippleRadius
          : this.calcDistanceToFurthestCorner(x, y, elBoundRect);
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
    if (this.pRippleTriggerId) {
      rippleContainerElement = document.getElementById(
        this.pRippleTriggerId
      ) as HTMLDivElement;
    } else {
      rippleContainerElement = element;
    }
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
  private calcDistanceToFurthestCorner(x: number, y: number, rect: ClientRect) {
    const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
    const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
    return Math.sqrt(distX * distX + distY * distY);
  }
}
