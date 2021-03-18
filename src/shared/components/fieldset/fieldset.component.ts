import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  Directive,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { FormControlName, NgModel } from '@angular/forms';

const labelActive = [];

@Directive({
  selector: '[app-input], [p-input], [pInput]',
})
export class InputDirective {
  @HostListener('focus', ['$event']) onFocus(event) {
    const input = event.target as HTMLInputElement;
    const label = input.nextSibling as HTMLElement;
    label.classList.add('active');
  }
  @HostListener('focusout', ['$event']) onFocusOut(event) {
    const input = event.target as HTMLInputElement;
    console.log(input.value);
    const activeInp = labelActive.find((x) => x === input);
    const label = input.nextSibling as HTMLElement;
    if (
      (input.value === '' && activeInp === undefined) ||
      (input.value === undefined && activeInp === undefined) ||
      (input.value === null && activeInp === undefined)
    ) {
      label.classList.remove('active');
    }
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'p-fieldset',
  templateUrl: './fieldset.component.html',
  styleUrls: ['./fieldset.component.css'],
})
export class FieldsetComponent
  implements OnInit, AfterViewInit, AfterContentInit {
  @Input() labelText: string;
  @Input() labelIconLeft: string;
  @Input() labelIconRight: string;
  @Input() labelId: string;
  @Input() labelActive = false;
  @Input() trailingButton = false;
  @Input() trailingButtonIcon: string;
  @Input() trailingButtonAction: any;
  @Input() hasHelperText = false;
  @Input() helperText: string;
  @Input() helperState: string;
  @Input() inputValidate = false;
  @Input() isTextarea = false;

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

  constructor() {
    this.seedMessages();
  }

  public seedMessages(): void {
    this.Errors[this.required] = (obj: FieldsetComponent) =>
      `O campo '${obj.labelText}' é obrigatório`;
    this.Errors[this.maxlengthValid] = (obj: FieldsetComponent) =>
      `O campo '${obj.labelText}' excedeu o limite de caracteres`;
    this.Errors[this.minlengthValid] = (obj: FieldsetComponent) =>
      `O campo '${obj.labelText}' não atingiu o mínimo de caracteres`;
    this.Errors[this.email] = (obj: FieldsetComponent) => `E-mail inválido`;
  }

  ngOnInit(): void {
    if (this.labelActive) {
      this.labelsActive();
    }
    if (this.trailingButton) {
      this.addTrailingStyling();
    }
  }

  ngAfterViewInit(): void {
    if (this.hasHelperText) {
      this.changeIcon();
    }
  }

  public hasError(): boolean {
    if (this.field !== undefined) {
      if (this.field.errors) {
        this.hasHelperText = true;
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
        'Esse componente precisa ser usado com uma diretiva NgModel ou FormControlName. Utilize o atributo isException para esconder este erro.'
      );
    }
  }

  labelsActive(): void {
    const input = document.getElementById(this.labelId) as HTMLInputElement;
    input.classList.add('label-active');
    labelActive.push(input);
    const label = input.nextSibling as HTMLLabelElement;
    label.classList.add('active');
  }

  addTrailingStyling(): void {
    const input = document.getElementById(this.labelId) as HTMLInputElement;
    input.classList.add('trailing-btn-input');
  }

  execFunction(): void {
    this.trailingButtonAction();
  }

  changeIcon(): void {
    const icon = document.querySelector('.helper-icon') as HTMLDivElement;
    switch (this.helperState) {
      case 'success':
        icon.innerHTML = 'check';
        break;
      case 'warn':
        icon.innerHTML = 'report_problem';
        break;
      case 'error':
        icon.innerHTML = 'close';
        break;
      default:
        icon.innerHTML = 'info';
    }
  }
}
