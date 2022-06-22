import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTooltip], [pTooltip]',
})
export class TooltipsDirective {
  @Input('pTooltip') label: string;
  @Input() positioning: TooltipPositioning;
  @Input() showDelay: number;
  @Input() dismissDelay: number;

  private _tooltipContainer: HTMLElement;
  private _mobileShowTimer: any;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  @HostListener('mouseover', ['$event'])
  openTooltip(): void {
    this.createTooltip();
  }

  @HostListener('mouseout', ['$event'])
  dismissTooltip(): void {
    this.removeTooltip();
  }

  @HostListener('touchstart', ['$event'])
  openTooltipOnMobile(): void {
    this._mobileShowTimer = window.setTimeout(() => {
      this.createTooltip();
    }, 1000);
  }

  @HostListener('touchend', ['$event'])
  touchEndInMobile(): void {
    if (this._mobileShowTimer) {
      window.clearTimeout(this._mobileShowTimer);
      this.removeTooltip();
    }
  }

  private createTooltip(): void {
    const tooltipContainer = document.createElement('div');
    const tooltip = document.createElement('div');

    tooltipContainer.classList.add('tooltip-container');
    tooltip.classList.add('pTooltip');

    tooltip.innerText = this.label;

    tooltipContainer.insertAdjacentElement('beforeend', tooltip);

    if (this.showDelay) {
      setTimeout(() => {
        document.body.insertAdjacentElement('beforeend', tooltipContainer);

        this._tooltipContainer = tooltipContainer;

        this.setTooltipPositions(tooltipContainer);
      }, this.showDelay);
    } else {
      document.body.insertAdjacentElement('beforeend', tooltipContainer);

      this._tooltipContainer = tooltipContainer;

      this.setTooltipPositions(tooltipContainer);
    }
  }

  private setTooltipPositions(tooltipContainer: HTMLElement): void {
    const nativeElement = this.elementRef.nativeElement;
    const nativeRect = nativeElement.getBoundingClientRect();

    switch (this.positioning) {
      case 'top':
        tooltipContainer.style.top = nativeRect.top - nativeRect.height + 'px';
        tooltipContainer.style.left =
          nativeRect.left +
          (nativeElement.offsetWidth - tooltipContainer.offsetWidth) / 2 +
          'px';
        break;
      case 'left':
        tooltipContainer.style.top = nativeRect.top + 'px';
        tooltipContainer.style.left = nativeRect.left + 'px';
        break;
      case 'right':
        tooltipContainer.style.top = nativeRect.top + 'px';
        tooltipContainer.style.left = nativeRect.right + 'px';
        break;
      default:
        tooltipContainer.style.top = nativeRect.bottom + 'px';
        tooltipContainer.style.left =
          nativeRect.left +
          (nativeElement.offsetWidth - tooltipContainer.offsetWidth) / 2 +
          'px';
    }

    const tooltipRect = tooltipContainer.getBoundingClientRect();

    if (tooltipRect.top + tooltipRect.height > window.innerHeight) {
      tooltipContainer.style.top = nativeRect.top - nativeRect.height + 'px';
    } else if (tooltipRect.top < 0) {
      tooltipContainer.style.top = nativeRect.bottom + 'px';
    }
    if (tooltipRect.left + tooltipRect.width > window.innerWidth) {
      tooltipContainer.style.left = null;
      tooltipContainer.style.right = '0';
    } else if (tooltipRect.left < 0) {
      tooltipContainer.style.left = '0';
    }
  }

  private removeTooltip(): void {
    if (this.dismissDelay) {
      setTimeout(() => {
        this._tooltipContainer?.remove();
      }, this.dismissDelay);
    } else {
      this._tooltipContainer?.remove();
    }
  }
}

type TooltipPositioning = 'top' | 'bottom' | 'left' | 'right';
