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
  @Input('pRippleColor') color: string;
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
  @Input('pRippleCentered') centered: boolean;
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
  @Input('pRippleUnbounded') unbounded: boolean;

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
  @Input('pRippleDuration')
  duration = 500;
  /**
   * Recieves a number, and it's default is always 0 because it is calculated in the createRippleEffect function;
   *
   * This option makes the ripple effect radius bigger or smaller, and always consistent independent of the element;
   *
   * Example:
   *  <div pRipple [pRippleRadius]="50"></div>
   */
  @Input('pRippleRadius') radius = 0;
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
   *   The ripple will always be centered if you're using this type of trigger.
   */
  @Input() pRippleTriggerFor: any;
  /**
   * pRippleDisabled is a boolean value.
   *
   * If it's set to false it disabled the ability for ripples to be created.
   *
   * Ex:
   * <div pRipple [pRippleDisabled]="true"></div>
   */
  @Input('pRippleDisabled') disabled = false;

  isPointerDown?: boolean;
  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

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
