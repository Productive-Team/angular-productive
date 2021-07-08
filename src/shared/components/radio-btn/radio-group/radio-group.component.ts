import { RadioBtnComponent } from './../radio-button/radio-btn.component';
import {
  Component,
  forwardRef,
  Input,
  ElementRef,
  ContentChildren,
  QueryList,
  OnInit,
  AfterViewInit,
  AfterContentInit,
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
  @Input() pRadioCollectionName: string;

  @ContentChildren(forwardRef(() => RadioBtnComponent), { descendants: true })
  radioButtons: any;

  radioArr = [];

  constructor(private el: ElementRef) {}

  value: any;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initRadGroup();
    }, 0);
  }

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

  watchValue(): void {
    const radioChecked = this.radioArr.find((x) => x.checked);
    this.value = radioChecked.value;
    this.change(this.value);
  }

  checkSelected(): void {
    const rad = this.radioArr.find((x) => x.value === this.value);
    if (rad) {
      rad.checked = true;
    }
  }

  initRadGroup(): void {
    this.radioButtons._results.forEach((x) => {
      x.pRadioCollectionName = this.pRadioCollectionName;
      const btn = x.radioBtn.nativeElement;
      this.radioArr.push(btn);
    });
    this.checkSelected();
  }
}
