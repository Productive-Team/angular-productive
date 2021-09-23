import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-switch-toggle, p-switch-toggle',
  templateUrl: './switch-toggle.component.html',
  styleUrls: ['./switch-toggle.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchToggleComponent),
      multi: true,
    },
  ],
})
export class SwitchToggleComponent implements OnInit, AfterViewInit {
  @Input() pSwitchId: string;
  @Input() pSwitchDisabled = false;
  @Input() pSwitchLabelLeft: string;
  @Input() pSwitchLabelRight: string;
  @Input() pSwitchIconLeft: string;
  @Input() pSwitchIconRight: string;
  @Input() pSwitchColor: string;
  @Input() pSwitchHasRipple = true;

  rippleColor: string;
  switchBackgroundColor: string;
  switchVal: boolean;
  constructor(private el: ElementRef) {}

  change = (_) => {};
  blur = (_) => {};

  ngOnInit() {
    setTimeout(() => {
      this.backgroundColorSwitchThumb();
      this.backgroundColorSwitch();
    }, 0);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setRippleColor();
    }, 0);
  }

  private setRippleColor(): void {
    if (this.pSwitchColor) {
      if (
        /#([A-Fa-f0-9]{3}){1,2}$/.test(this.pSwitchColor) ||
        /([A-Fa-f0-9]{3}){1,2}$/.test(this.pSwitchColor)
      ) {
        this.rippleColor = this.pSwitchColor + '26';
      }
    } else {
      const color = getComputedStyle(document.body).getPropertyValue(
        '--secondary'
      );
      this.rippleColor = color + '26';
    }
  }

  // sets the background color of the switch thumb
  private backgroundColorSwitchThumb(): any {
    const switchThumb = document.getElementById('switch-thumb');
    if (this.pSwitchColor) {
      switchThumb.style.setProperty('--switch-thumb', this.pSwitchColor);
    }
  }

  // sets the background color of the SwitchBackground
  private backgroundColorSwitch(): any {
    const SwitchBack = document.getElementById('switch-cont');
    if (this.pSwitchColor) {
      if (
        /#([A-Fa-f0-9]{3}){1,2}$/.test(this.pSwitchColor) ||
        /([A-Fa-f0-9]{3}){1,2}$/.test(this.pSwitchColor)
      ) {
        SwitchBack.style.setProperty(
          '--container-background',
          this.pSwitchColor + '99'
        );
      }
    } else {
      const mainColorVar = getComputedStyle(document.documentElement)
        .getPropertyValue('--secondary')
        .trim();
      this.pSwitchColor = mainColorVar;
      if (
        /#([A-Fa-f0-9]{3}){1,2}$/.test(this.pSwitchColor) ||
        /([A-Fa-f0-9]{3}){1,2}$/.test(this.pSwitchColor)
      ) {
        SwitchBack.style.setProperty(
          '--container-background',
          this.pSwitchColor + '99'
        );
      }
    }
  }

  // writes the checkbox value
  writeValue(obj: boolean): void {
    this.switchVal = obj;
  }

  // register the changes
  registerOnChange(fn: any): void {
    this.change = fn;
  }

  // blurs the component
  registerOnTouched(fn: any): void {
    this.blur = fn;
  }

  // sets the checkbox to a disabled state
  setDisabledState?(isDisabled: boolean): void {
    this.pSwitchDisabled = isDisabled;
  }

  // changes the value of the checkbox
  onCheck($event) {
    this.switchVal = $event && $event.target && $event.target.checked;
    this.change(this.switchVal);
  }
}
