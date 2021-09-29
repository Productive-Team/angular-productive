import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export const enum CheckboxAnimationStates {
  Initial,
  Checked,
  Unchecked,
  Indeterminate,
}

/**
 * A Checkbox component that contains all the functionality of a regular <input type="checkbox">
 */
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
export class CheckboxComponent implements AfterViewInit {
  constructor(
    private el: ElementRef,
    private changeDetector: ChangeDetectorRef
  ) {}
  /**
   * Changes the position of the checkbox label
   */
  @Input() labelPosition: CheckboxLabelPostion;
  /**
   * Disabled the checkbox
   */
  @Input() disabled: boolean;
  /**
   * Changes the checkbox color
   */
  @Input() color: string;

  /**
   * Checks the checkbox
   */
  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    if (value != this.checked) {
      this._checked = value;
      this.changeDetector.markForCheck();
    }
  }
  private _checked: boolean = false;
  /**
   * Change event for when the checkbox is checked
   */
  @Output() checkedChange = new EventEmitter<boolean>();

  /**
   * Sets the checkbox to a indeterminate state
   */
  @Input()
  get indeterminate(): boolean {
    return this._indeterminate;
  }
  set indeterminate(value: boolean) {
    const changed = value != this._indeterminate;
    this._indeterminate = value != null && `${value}` !== 'false';

    if (changed) {
      if (this._indeterminate) {
        this.checkAnimations(CheckboxAnimationStates.Indeterminate);
      } else {
        this.checkAnimations(
          this.checked
            ? CheckboxAnimationStates.Checked
            : CheckboxAnimationStates.Unchecked
        );
      }
      this.indeterminateChange.emit(this._indeterminate);
    }

    this.syncCheckbox(this._indeterminate);
  }
  private _indeterminate: boolean = false;

  /**
   * Change event for the indeterminate state
   */
  @Output() indeterminateChange = new EventEmitter<boolean>();

  rippleColor = 'var(--secondaryLowOpacity)';

  @ViewChild('checkMark') checkMark: ElementRef<HTMLElement>;
  @ViewChild('indetMark') mixedMark: ElementRef<HTMLElement>;
  @ViewChild('background') background: ElementRef;
  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  currentCheckboxState: CheckboxAnimationStates = 0;

  change = (_) => {};
  blur = (_) => {};

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setColor();
    }, 0);
  }

  setColor(): void {
    if (this.color !== undefined) {
      if (
        !/#([A-Fa-f0-9]{3}){1,2}$/.test(this.color) ||
        !/([A-Fa-f0-9]{3}){1,2}$/.test(this.color)
      ) {
        this.rippleColor = this.rgbToHex(this.color) + '26';
      } else {
        this.rippleColor = this.color + '26';
      }
      const back = this.background.nativeElement as HTMLElement;
      back.style.backgroundColor = this.color;
    }
  }

  writeValue(obj: any): void {
    this.checked = !!obj;
  }

  registerOnChange(fn: any): void {
    this.change = fn;
  }

  registerOnTouched(fn: any): void {
    this.blur = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  registerChecked(event: Event): void {
    event.stopPropagation();
    if (!this.disabled) {
      this.checked = !this.checked;
      if (this.indeterminate) {
        Promise.resolve().then(() => {
          this._indeterminate = false;
          this.indeterminateChange.emit(this._indeterminate);
        });
      }
      this.checkAnimations(
        this._checked
          ? CheckboxAnimationStates.Checked
          : CheckboxAnimationStates.Unchecked
      );
      this.change(this.checked);
      this.checkedChange.emit(this.checked);
    }
  }

  private rgbToHex(rgb: string): string {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
      hex = '0' + hex;
    }
    return hex;
  }

  checkAnimations(newState: CheckboxAnimationStates): any {
    const lastState = this.currentCheckboxState;

    if (lastState !== newState) {
      this.currentCheckboxState = newState;

      this.setAnimations(lastState, newState);
    }
  }

  setAnimations(
    lastState: CheckboxAnimationStates,
    newState: CheckboxAnimationStates
  ) {
    const checkMark = this.checkMark.nativeElement;
    const mixedMark = this.mixedMark.nativeElement;

    switch (lastState) {
      case 1:
        if (newState === 3) {
          checkMark.classList.add('checkmark-checked-indeterminate');
          mixedMark.classList.add('mixedmark-checked-indeterminate');
        }
        break;
      case 2:
        if (newState === 1) {
          checkMark.classList.add('unchecked-checked');
        }
        if (newState === 3) {
          mixedMark.classList.add('unchecked-indeterminate');
        }
        break;
      case 3:
        if (newState === 1) {
          checkMark.classList.add('checkmark-indeterminate-checked');
          mixedMark.classList.add('mixedmark-indeterminate-checked');
        }
        break;
      default:
        if (newState === 1) {
          checkMark.classList.add('unchecked-checked');
        }
        if (newState === 3) {
          mixedMark.classList.add('unchecked-indeterminate');
        }
    }

    checkMark.addEventListener('animationend', () => {
      checkMark.removeAttribute('class');
    });
    checkMark.addEventListener('animationcancel', () => {
      checkMark.removeAttribute('class');
    });
    mixedMark.addEventListener('animationend', () => {
      mixedMark.removeAttribute('class');
    });
    mixedMark.addEventListener('animationcancel', () => {
      mixedMark.removeAttribute('class');
    });
  }

  syncCheckbox(value: boolean): void {
    const checkbox = this.input;
    if (checkbox) {
      checkbox.nativeElement.indeterminate = value;
    }
  }

  @HostBinding('class.checkbox-disabled')
  get isDisabled() {
    return this.disabled;
  }

  @HostBinding('class.dInlineF')
  @HostBinding('class.v-alingMiddle')
  get defaultClass() {
    return true;
  }
}

type CheckboxLabelPostion = 'right' | 'left';
