import {
  Component,
  forwardRef,
  Input,
  OnInit,
  ElementRef,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-radio-group, p-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
})
export class RadioGroupComponent {
  @Input() pRadioCollectionName: string;
  constructor(private el: ElementRef) {}

  value: any;

  change = (_) => {};
  blur = (_) => {};

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.change = fn;
  }

  registerOnTouched(fn: any): void {
    this.blur = fn;
  }

  watchValue() {
    const id = this.pRadioCollectionName;
    const formEl = document.getElementById(id) as HTMLFormElement;
    const value = formEl.elements[id].value;
    this.value = value;
    this.change(this.value);
  }
}
