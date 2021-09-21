/* eslint-disable @angular-eslint/no-input-rename */
import {
  AfterContentInit,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { FormControlName, NgModel } from '@angular/forms';

@Directive({
  selector: '[app-input], [p-input], [pInput]',
})
export class InputDirective {
  constructor(private el: ElementRef) {}
  @HostListener('focus', ['$event']) onFocus(event) {
    const input = this.el.nativeElement.closest(
      '.input-wrapper'
    ) as HTMLInputElement;
    input.classList.add('focused');
    const label = this.el.nativeElement.parentElement.querySelector(
      '.label-wrap'
    ).firstChild as HTMLSpanElement;
    label.classList.add('active');
  }
  @HostListener('blur', ['$event']) onFocusOut(event) {
    const input = this.el.nativeElement.closest(
      '.input-wrapper'
    ) as HTMLInputElement;
    input.classList.remove('focused');
    const inputFil = this.el.nativeElement as HTMLInputElement;
    const label = this.el.nativeElement.parentElement.querySelector(
      '.label-wrap'
    ).firstChild as HTMLSpanElement;
    if (
      inputFil.value.length === 0 &&
      !input.parentElement.parentElement.parentElement.classList.contains(
        'label-ac'
      )
    ) {
      label.classList.remove('active');
    }
  }

  @HostBinding('class.form-input')
  get val() {
    return true;
  }
}

@Component({
  selector: 'app-fieldset, p-fieldset',
  templateUrl: './fieldset.component.html',
})
export class FieldsetComponent implements OnInit, AfterContentInit {
  /**
   * Sets the label text with the fieldset
   */
  @Input('pFieldsetLabelText') labelText: string;
  /**
   * Sets the label to always be floating
   */
  @Input('pFieldsetLabelActive') labelActive = false;
  @Input() hasHelperText = false;
  @Input() helperText: string;
  @Input() helperState: string;
  /**
   * Allow for input validation
   */
  @Input('pFieldsetValidate') inputValidate = false;
  /**
   * Changes the appearence of the fieldset;
   *
   * The values are 'filled', 'classic' or 'outlined';
   */
  @Input('pFieldsetAppearence') appearence: string;

  private required = 'required';
  private maxlengthValid = 'maxlength';
  private minlengthValid = 'minlength';
  private email = 'email';

  private Errors = {};
  public field: any;
  public message = '';

  @ContentChild(FormControlName, { static: false })
  control: FormControlName;
  @ContentChild(NgModel, { static: false })
  model: NgModel;

  constructor(private el: ElementRef) {
    this.seedMessages();
  }

  public seedMessages(): void {
    this.Errors[this.required] = (obj: FieldsetComponent) =>
      `The field '${obj.labelText}' is required`;
    this.Errors[this.maxlengthValid] = (obj: FieldsetComponent) =>
      `The field '${obj.labelText}' exceeded the character limit`;
    this.Errors[this.minlengthValid] = (obj: FieldsetComponent) =>
      `The field '${obj.labelText}' didn't achieve the minimum length`;
    this.Errors[this.email] = (obj: FieldsetComponent) => `Invalid e-mail`;
  }

  ngOnInit(): void {
    if (this.labelActive) {
      this.labelsActive();
    }
  }

  public hasError(): boolean {
    if (this.field !== undefined) {
      if (this.field.errors) {
        this.helperState = 'error';
        const error = Object.getOwnPropertyNames(this.field.errors);
        error.forEach((element) => {
          if (this.Errors[element]) {
            this.message += this.Errors[element](this);
          }
        });
        this.helperText = this.message;
        this.message = '';
      }
      return this.field.invalid && (this.field.dirty || this.field.touched);
    }
  }

  ngAfterContentInit(): void {
    this.field = this.control || this.model;
    if (this.field === undefined && this.inputValidate) {
      throw new Error(
        'This component needs an NgModel or FormControlName directive to have proper validation.'
      );
    }
  }

  labelsActive(): void {
    const label =
      this.el.nativeElement.firstChild.firstChild.firstChild.firstChild
        .nextSibling.firstChild.nextSibling.firstChild;
    const el = this.el.nativeElement;
    label.classList.add('active');
    el.classList.add('label-ac');
  }

  hasValue(): boolean {
    let input = this.el.nativeElement.querySelector('input');
    if (input === null) {
      input = this.el.nativeElement.querySelector('select');
    }
    if (input.closest('.p-select-search') === null) {
      if (input.value.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  @HostListener('click', ['$event']) focused(event) {
    let input = this.el.nativeElement.querySelector(
      'input'
    ) as HTMLInputElement;
    if (input === null) {
      input = this.el.nativeElement.querySelector('select');
    }
    const tgt = event.target.parentElement as HTMLElement;
    if (
      !tgt.classList.contains('suffix') &&
      !tgt.classList.contains('prefix')
    ) {
      input.focus();
      const wrap = this.el.nativeElement.firstChild.firstChild
        .firstChild as HTMLDivElement;
      if (input === document.activeElement) {
        wrap.classList.add('focused');
      }
      input.addEventListener('blur', () => {
        wrap.classList.remove('focused');
      });
    }
  }

  @HostBinding('class.has-value')
  get hasVal() {
    return this.hasValue();
  }

  @HostBinding('class.input-error')
  get error() {
    return this.hasError();
  }
  @HostBinding('class.disabled')
  get getDisabled() {
    let input = this.el.nativeElement.querySelector(
      'input'
    ) as HTMLInputElement;
    if (input === null) {
      input = this.el.nativeElement.querySelector('select') as HTMLInputElement;
    }
    if (input.closest('.p-select-search') === null) {
      if (input.disabled) {
        return true;
      } else {
        return false;
      }
    }
  }

  @HostBinding('class.readonly')
  get inputReadonly() {
    let input = this.el.nativeElement.querySelector(
      'input'
    ) as HTMLInputElement;
    if (input === null) {
      input = this.el.nativeElement.querySelector('select') as HTMLInputElement;
    }
    if (
      !input.parentElement.classList.contains('p-select-parent-wrapper') &&
      input.closest('.p-select-search') === null &&
      !input.classList.contains('picker-trigger') &&
      !input.classList.contains('calendar-trigger')
    ) {
      if (input.readOnly) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
}
