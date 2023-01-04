import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-navbar, p-navbar',
  template: `<nav
    #navbar
    class="p-navbar {{ size }}"
    [class.elevation-p4]="elevation"
  >
    <ng-content></ng-content>
  </nav>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements AfterContentInit {
  /**
   * The size of the navbar. It can be between three distinct values.
   * - `small`
   * - `medium` (default)
   * - `large`
   */
  @Input()
  public size: NavbarSizeOptions = 'medium';
  /**
   * The navbar background color. Accepts hex values only.
   */
  @Input()
  public backgroundColor: string;
  /**
   * Sets a default elevation to the `<nav>` element
   */
  @Input()
  public elevation: boolean = true;

  @ViewChild('navbar')
  private _navbarElement: ElementRef<HTMLElement>;

  constructor(
    private _renderer2: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngAfterContentInit(): void {
    this._setNavbarCustomColor();
  }

  /**Identifies background color to return a contrasting color between black and white*/
  private _getContrastingColorForTexts(hexcolor: string): string {
    let color = hexcolor;
    if (hexcolor.includes('var')) {
      color = getComputedStyle(document.body)
        .getPropertyValue(hexcolor.substring(4, hexcolor.lastIndexOf(')')))
        .trim();
    }

    if (!color.includes('#')) {
      throw Error('Only hex values are allowed');
    }

    color = color.replace('#', '');
    const redValue = parseInt(color.substring(0, 2), 16);
    const greenValue = parseInt(color.substring(2, 2), 16);
    const blueValue = parseInt(color.substring(4, 2), 16);
    const contrastingValue =
      (redValue * 299 + greenValue * 587 + blueValue * 114) / 1000;

    return isNaN(contrastingValue)
      ? 'white'
      : contrastingValue >= 145
      ? 'black'
      : 'white';
  }

  /**Sets custom background color and letter color*/
  private _setNavbarCustomColor(): void {
    this._changeDetectorRef.detectChanges();
    this._renderer2.setStyle(
      this._navbarElement.nativeElement,
      'backgroundColor',
      this.backgroundColor
    );
    this._renderer2.setStyle(
      this._navbarElement.nativeElement,
      'color',
      this._getContrastingColorForTexts(this.backgroundColor)
    );
  }

  @HostBinding('class.dContents')
  private get _defaultClass(): boolean {
    return true;
  }
}

type NavbarSizeOptions = 'small' | 'medium' | 'large';
