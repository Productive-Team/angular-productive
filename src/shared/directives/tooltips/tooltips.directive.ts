import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTooltips], [p-tooltip], [pTooltip]',
})
export class TooltipsDirective {
  @Input('pTooltip') pTooltipText: string;
  @Input() pTooltipPosition: string;
  @Input() pTooltipClickOpen = false;
  @Input() pTooltipClickDuration = 2500;

  constructor(private el: ElementRef) {}

  @HostListener('mouseover', ['$event']) showTooltip(event): void {
    const allTooltips = document.querySelectorAll('.pTooltip');
    if (!this.pTooltipClickOpen) {
      if (allTooltips.length < 1) {
        this.createToolTip(this.el.nativeElement, this.pTooltipText);
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
        this.createToolTip(this.el.nativeElement, this.pTooltipText);
        setTimeout(
          () => {
            const tt = allTooltips[0] as HTMLElement;
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

  @HostListener('touchstart', ['$event'])
  showTooltipMobile(event): void {
    setTimeout(() => {
      this.createToolTip(this.el.nativeElement, this.pTooltipText);
    }, 500);
  }

  private setTooltipPosition(element: HTMLElement, tooltip: HTMLElement): void {
    const elPos = element.getBoundingClientRect();
    tooltip.style.height = elPos.height + 'px';
    switch (this.pTooltipPosition) {
      case 'left':
        tooltip.style.top = elPos.top + 'px';
        tooltip.style.left = elPos.left - elPos.width + 'px';
        break;
      case 'top':
        tooltip.style.top = elPos.top - elPos.height + 'px';
        tooltip.style.left =
          elPos.left + (element.offsetWidth - tooltip.offsetWidth) / 2 + 'px';
        break;
      case 'bottom':
        tooltip.style.top = elPos.bottom + 'px';
        tooltip.style.left =
          elPos.left + (element.offsetWidth - tooltip.offsetWidth) / 2 + 'px';
        break;
      case 'right':
        tooltip.style.top = elPos.top + 'px';
        tooltip.style.left = elPos.right + 'px';
        break;
      default:
        tooltip.style.top = elPos.bottom + 'px';
        tooltip.style.left =
          elPos.left + (element.offsetWidth - tooltip.offsetWidth) / 2 + 'px';
    }
    const toolPos = tooltip.getBoundingClientRect();

    if (toolPos.top + toolPos.height > window.innerHeight) {
      tooltip.style.top = elPos.top - elPos.height + 'px';
    } else if (toolPos.top < 0) {
      tooltip.style.top = elPos.bottom + 'px';
    }
    if (toolPos.left + toolPos.width > window.innerWidth) {
      tooltip.style.left = null;
      tooltip.style.right = '1rem';
    } else if (toolPos.left < 0) {
      tooltip.style.left = '1rem';
    }
  }

  private createToolTip(element: HTMLElement, tooltipText: string): void {
    const tooltipContainer = document.createElement('div');
    tooltipContainer.classList.add('tooltip-container');
    const tooltip = document.createElement('span');
    tooltip.classList.add('pTooltip');
    tooltip.innerHTML = tooltipText;
    tooltipContainer.insertAdjacentElement('beforeend', tooltip);
    document.body.insertAdjacentElement('beforeend', tooltipContainer);
    this.setTooltipPosition(element, tooltipContainer);
  }

  private removeTooltip(): any {
    const allTooltips = document.querySelectorAll('.tooltip-container');
    allTooltips.forEach((x) => {
      x.remove();
    });
  }
}
