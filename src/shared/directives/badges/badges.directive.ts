import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appBadges], [p-badges], [pBadge]',
})
export class BadgesDirective implements AfterViewInit {
  @Input() pBadgeHorizontalPosition: string;
  @Input() pBadgeVerticalPosition: string;
  @Input() pBadgePosition: BadgePosition;
  @Input() pBadgeCircle: boolean;
  @Input('pBadge') pBadgeText: string;
  @Input() pBadgeColor: string;
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.generateBadge();
  }

  private generateBadge(): void {
    const badge = document.createElement('span');
    const badgeContainer = document.createElement('div');
    badge.classList.add('pBadge');
    badgeContainer.classList.add('pBadgeContainer');
    badge.innerHTML = this.pBadgeText;
    this.setBadgePosition(badge);
    if (this.pBadgeCircle) {
      badge.classList.add('circle');
    }
    if (this.pBadgeColor) {
      this.setBadgeColor(badge);
    }
    const element = this.el.nativeElement as HTMLDivElement;
    element.insertAdjacentElement('beforebegin', badgeContainer);
    badgeContainer.insertAdjacentElement('beforeend', element);
    badgeContainer.insertAdjacentElement('afterbegin', badge);
  }

  private setBadgePosition(element): void {
    switch (this.pBadgePosition) {
      case 'top-left':
        element.classList.add('top');
        element.classList.add('left');
        break;
      case 'top-right':
        element.classList.add('top');
        element.classList.add('right');
        break;
      case 'bottom-left':
        element.classList.add('bottom');
        element.classList.add('left');
        break;
      case 'bottom-right':
        element.classList.add('bottom');
        element.classList.add('right');
        break;
      default:
        element.classList.add('top');
        element.classList.add('right');
    }
  }

  private setBadgeColor(element): void {
    switch (this.pBadgeColor) {
      case 'primary':
        element.classList.add('bg-primary');
        break;
      case 'secondary':
        element.classList.add('bg-secondary');
        break;
      case 'bg-primary':
        element.classList.add('bg-primary');
        break;
      case 'bg-secondary':
        element.classList.add('bg-secondary');
        break;
      default:
        element.style.backgroundColor = this.pBadgeColor;
        element.style.color = this.getContrastYIQ(this.pBadgeColor);
    }
  }

  private getContrastYIQ(hexcolor): string {
    let r;
    let g;
    let b;
    if (/^#(?:[A-Fa-f0-9]{3}){1,2}$/.test(hexcolor)) {
      hexcolor = hexcolor.replace('#', '');
      r = parseInt(hexcolor.substr(0, 2), 16);
      g = parseInt(hexcolor.substr(2, 2), 16);
      b = parseInt(hexcolor.substr(4, 2), 16);
    } else if (
      /^rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}[)]$/.test(
        hexcolor
      ) ||
      /^^rgba[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*,){3}\s*0*(?:\.\d+|1(?:\.0*)?)\s*[)]$/.test(
        hexcolor
      )
    ) {
      const rgb = this.pBadgeColor;
      const rgbSt = rgb
        .substring(4, rgb.length - 1)
        .replace(/ /g, '')
        .split(',');
      r = Number(rgbSt[0]);
      g = Number(rgbSt[1]);
      b = Number(rgbSt[2]);
    }
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    if (isNaN(yiq)) {
      return '#8a8a8a';
    } else {
      return yiq >= 145 ? '#262626' : 'white';
    }
  }
}

type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
