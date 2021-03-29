import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTolltips], [p-tooltip], [pTooltip]',
})
export class TooltipsDirective {
  @Input() pTooltipText: string;
  @Input() pTooltipPosition: string;
  @Input() pTooltipClickOpen = false;
  @Input() pTooltipClickDuration = 2500;

  constructor(private el: ElementRef) {
    this.insertElementIntoContainer(this.el.nativeElement);
  }

  @HostListener('mouseover', ['$event']) showTooltip(event): void {
    const allTooltips = document.querySelectorAll('.pTooltip');
    if (!this.pTooltipClickOpen) {
      if (allTooltips.length < 1) {
        this.createToolTip(event.target, this.pTooltipText);
      }
    }
  }

  @HostListener('mouseout', ['$event']) hideTooltip(event): void {
    if (!this.pTooltipClickOpen) {
      this.removeTooltip();
    }
  }

  @HostListener('click', ['$event']) showTooltipClick(event): void {
    if (this.pTooltipClickOpen) {
      const allTooltips = document.querySelectorAll('.pTooltip');
      if (allTooltips.length < 1) {
        this.createToolTip(event.target, this.pTooltipText);
        setTimeout(
          () => {
            const tt = event.target.nextSibling;
            tt.style.opacity = '0';
            tt.addEventListener('transitionend', () => {
              this.removeTooltip();
            });
          },
          this.pTooltipClickDuration > 0 ? this.pTooltipClickDuration : 2500
        );
      }
    }
  }

  private insertElementIntoContainer(element: HTMLElement): void {
    const container = document.createElement('div');
    container.classList.add('p-tooltip-container');
    element.insertAdjacentElement('beforebegin', container);
    container.insertAdjacentElement('beforeend', element);
  }

  private setTooltipPosition(element: HTMLElement): void {
    switch (this.pTooltipPosition) {
      case 'left':
        element.classList.add('left-align');
        break;
      case 'top':
        element.classList.add('top-align');
        break;
      case 'bottom':
        element.classList.add('bottom-align');
        break;
      case 'right':
        element.classList.add('right-align');
        break;
      default:
        element.classList.add('bottom-align');
    }
  }

  private createToolTip(element: HTMLElement, tooltipText: string): void {
    const tooltip = document.createElement('span');
    tooltip.classList.add('pTooltip');
    this.setTooltipPosition(tooltip);
    tooltip.innerHTML = tooltipText;
    element.insertAdjacentElement('afterend', tooltip);
  }

  private removeTooltip(): any {
    const allTooltips = document.querySelectorAll('.pTooltip');
    allTooltips.forEach((x) => {
      x.remove();
    });
  }
}
