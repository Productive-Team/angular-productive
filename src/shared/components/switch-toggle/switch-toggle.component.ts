/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnInit,
  Output,
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
export class SwitchToggleComponent implements AfterViewInit {
  @Input() pSwitchId: string;
  @Input('checked') pSwitchChecked: boolean;
  @Output('checkedChange') pSwitchCheckedChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Input('disabled') pSwitchDisabled: boolean;
  @Input('color') pSwitchColor: string;
  @Input('hasRipple') pSwitchHasRipple: boolean = true;

  rippleColor: string;
  switchBackgroundColor: string;
  constructor(private el: ElementRef) {}

  change = (_) => {};
  blur = (_) => {};

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

  writeValue(obj: boolean): void {
    this.pSwitchChecked = obj;
  }

  registerOnChange(fn: any): void {
    this.change = fn;
  }

  registerOnTouched(fn: any): void {
    this.blur = fn;
  }

  registerChecked(event): boolean {
    this.pSwitchChecked = event && event.target && event.target.checked;
    this.change(this.pSwitchChecked);
    this.pSwitchCheckedChange.emit(this.pSwitchChecked);
    return event;
  }

  @HostBinding('class.switch-disabled')
  get isDisabled() {
    return this.pSwitchDisabled;
  }
}
