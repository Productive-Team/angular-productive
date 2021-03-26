import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTolltips], [p-tooltip], [pTooltip]',
})
export class TooltipsDirective {
  constructor(private el: ElementRef) {}

  @HostListener('mouseover', ['$event']) showTooltip(event): void {}
}
