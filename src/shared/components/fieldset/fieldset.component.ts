import {
  Component,
  Directive,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

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
export class FieldsetComponent implements OnInit {
  @Input() labelText: string;
  @Input() labelIconLeft: string;
  @Input() labelIconRight: string;
  @Input() labelId: string;
  @Input() labelActive = false;
  @Input() trailingButton = false;

  constructor() {}

  ngOnInit(): void {
    if (this.labelActive) {
      this.labelsActive();
    }
  }

  labelsActive(): void {
    const input = document.getElementById(this.labelId) as HTMLInputElement;
    input.classList.add('label-active');
    labelActive.push(input);
    const label = input.nextSibling as HTMLLabelElement;
    label.classList.add('active');
  }
}
