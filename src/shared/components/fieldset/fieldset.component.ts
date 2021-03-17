import {
  Component,
  Directive,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

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
    const label = input.nextSibling as HTMLElement;
    if (
      input.value === '' ||
      input.value === undefined ||
      input.value === null
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
  @Input() labelIcon: string;
  @Input() labelId: string;
  @Input() trailingButton = false;

  constructor() {}

  ngOnInit(): void {}
}
