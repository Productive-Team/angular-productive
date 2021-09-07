import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox, p-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements AfterContentInit, OnChanges {
  @Input('label') pCheckboxLabel: string;
  @Input('labelPosition') pCheckboxLabelPosition = 'right' || 'left';
  @Input('disabled') pCheckboxDisabled: boolean;
  @Input('color') pCheckboxColor: string;

  @Input('checked') pCheckboxChecked: boolean;
  @Output('checkedChange') pCheckboxCheckedChange = new EventEmitter<boolean>();

  @Input('indeterminate') pCheckboxIndeterminate: boolean;
  @Output('indeterminateChange') pCheckboxIndeterminateChange =
    new EventEmitter<boolean>();

  rippleColor = 'var(--primaryLowOpacity)';

  @ViewChild('checkMark') checkMark: ElementRef;
  @ViewChild('indetMark') indetMark: ElementRef;
  @ViewChild('background') background: ElementRef;
  @ViewChild('checkbox') checkbox: ElementRef;

  private previousIndeterminateState: boolean;

  constructor(private el: ElementRef) {}

  change = (_) => {};
  blur = (_) => {};

  ngAfterContentInit(): void {
    setTimeout(() => {
      if (this.pCheckboxColor !== undefined) {
        if (
          !/#([A-Fa-f0-9]{3}){1,2}$/.test(this.pCheckboxColor) ||
          !/([A-Fa-f0-9]{3}){1,2}$/.test(this.pCheckboxColor)
        ) {
          this.rippleColor = this.rgbToHex(this.pCheckboxColor) + '26';
        } else {
          this.rippleColor = this.pCheckboxColor + '26';
        }
        const back = this.background.nativeElement as HTMLElement;
        back.style.backgroundColor = this.pCheckboxColor;
      }
    }, 0);
  }

  writeValue(obj: boolean): void {
    this.pCheckboxChecked = obj;
  }

  registerOnChange(fn: any): void {
    this.change = fn;
  }

  registerOnTouched(fn: any): void {
    this.blur = fn;
  }

  registerChecked(event): boolean {
    this.pCheckboxChecked = event && event.target && event.target.checked;
    this.change(this.pCheckboxChecked);
    this.pCheckboxCheckedChange.emit(this.pCheckboxChecked);
    if (this.pCheckboxIndeterminate) {
      this.pCheckboxIndeterminateChange.emit(false);
    }
    return event;
  }

  private insertAnimations(
    checkEvent: boolean,
    indeterminateEvent: boolean
  ): void {
    const mixed = this.indetMark.nativeElement as HTMLElement;
    const check = this.checkMark.nativeElement as HTMLElement;

    if (!checkEvent && indeterminateEvent) {
      mixed.style.animation =
        'notCheckedToIndeterminate 150ms cubic-bezier(.14,.65,.61,.78)';
      mixed.addEventListener('animationend', () => {
        mixed.removeAttribute('style');
      });
    }

    if (checkEvent && indeterminateEvent) {
      mixed.style.animation =
        'checkedToIndeterminate 150ms cubic-bezier(.14,.65,.61,.78)';
      mixed.addEventListener('animationend', () => {
        mixed.removeAttribute('style');
      });
      check.style.animation =
        'checkmarkCheckToIndeterminate 150ms cubic-bezier(.14,.65,.61,.78)';
      check.addEventListener('animationend', () => {
        check.removeAttribute('style');
      });
    }

    if (checkEvent && !indeterminateEvent && this.previousIndeterminateState) {
      mixed.style.animation =
        'mixedIndeterminateToChecked 200ms cubic-bezier(.29,.01,.73,.99)';
      mixed.addEventListener('animationend', () => {
        mixed.removeAttribute('style');
      });
      check.style.animation =
        'checkmarkIndeterminateToChecked 350ms cubic-bezier(.29,.01,.73,.99)';
      check.addEventListener('animationend', () => {
        check.removeAttribute('style');
      });
    }

    if (checkEvent && !indeterminateEvent && !this.previousIndeterminateState) {
      check.style.animation =
        'checkmarkCheck 600ms cubic-bezier(0.07, 0.24, 0.65, 0.99)';
      check.addEventListener('animationend', () => {
        check.removeAttribute('style');
      });
    }
  }

  private rgbToHex(rgb: string): string {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
      hex = '0' + hex;
    }
    return hex;
  }

  ngOnChanges(event): void {
    const indeterminate = event.pCheckboxIndeterminate as SimpleChange;
    const checked = event.pCheckboxChecked as SimpleChange;
    if (indeterminate !== undefined) {
      this.previousIndeterminateState = indeterminate.previousValue;
    }
    if (checked !== undefined) {
      if (!checked.currentValue && !this.pCheckboxIndeterminate) {
        this.previousIndeterminateState = false;
      }
    }
    setTimeout(() => {
      if (!event.pCheckboxDisabled) {
        this.insertAnimations(
          this.pCheckboxChecked,
          this.pCheckboxIndeterminate
        );
      }
    }, 0);
  }

  @HostListener('change', ['$event'])
  changeSome(event) {
    const checkbox = event.target;

    if (!checkbox.checked && !checkbox.indeterminate) {
      this.previousIndeterminateState = false;
    }

    setTimeout(() => {
      if (!checkbox.disabled) {
        this.insertAnimations(
          this.pCheckboxChecked,
          this.pCheckboxIndeterminate
        );
      }
    }, 0);
  }

  @HostBinding('class.checkbox-disabled')
  get isDisabled() {
    return this.pCheckboxDisabled;
  }

  @HostBinding('attr.indeterminate')
  get isIndeterminate() {
    const check = this.el.nativeElement.querySelector(
      'input'
    ) as HTMLInputElement;
    check.indeterminate = this.pCheckboxIndeterminate ? true : false;
    return check.indeterminate;
  }
}
