/* eslint-disable @angular-eslint/no-output-rename */
/* eslint-disable @angular-eslint/no-input-rename */
import { RadioBtnComponent } from './../radio-button/radio-btn.component';
import {
  Component,
  forwardRef,
  Input,
  ContentChildren,
  AfterViewInit,
  Output,
  QueryList,
  EventEmitter,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-radio-group, p-radio-group',
  styleUrls: ['./radio-group.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
  template: `
    <div (change)="watchValue()" class="radio-group">
      <ng-content></ng-content>
    </div>
  `,
})
export class RadioGroupComponent implements AfterViewInit {
  @Input('collection') pRadioCollectionName: string;

  @Input('selectedValue') pCollectionSelectedValue: any;
  @Output('selectedValueChange')
  pCollectionSelectedValueChange: EventEmitter<any> = new EventEmitter();

  @ContentChildren(forwardRef(() => RadioBtnComponent), { descendants: true })
  radioButtons: QueryList<RadioBtnComponent>;

  radioArrayCollection = [];

  constructor() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initRadGroup();
    }, 0);
  }

  change = (_) => {};
  blur = (_) => {};

  writeValue(obj: any): void {
    this.pCollectionSelectedValue = obj;
  }

  registerOnChange(fn: any): void {
    this.change = fn;
  }

  registerOnTouched(fn: any): void {
    this.blur = fn;
  }

  watchValue(): void {
    const radioChecked = this.radioArrayCollection.find((x) => x.checked);
    this.pCollectionSelectedValue = radioChecked.value;
    this.change(this.pCollectionSelectedValue);
    this.pCollectionSelectedValueChange.emit(this.pCollectionSelectedValue);
  }

  checkSelected(): void {
    const radioButton = this.radioArrayCollection.find(
      (x) => x.value === this.pCollectionSelectedValue
    );
    if (radioButton) {
      radioButton.checked = true;
    }
  }

  initRadGroup(): void {
    this.radioButtons.forEach((x) => {
      x.pRadioCollectionName = this.pRadioCollectionName;
      const radioButton = x.radioBtn.nativeElement;
      this.radioArrayCollection.push(radioButton);
    });
    this.checkSelected();
  }
}
