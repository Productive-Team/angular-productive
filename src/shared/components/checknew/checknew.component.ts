import {
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checknew',
  templateUrl: './checknew.component.html',
  styleUrls: ['./checknew.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChecknewComponent),
      multi: true,
    },
  ],
})
export class ChecknewComponent implements OnInit {
  @Input('label') pCheckboxLabel: string;
  @Input('labelPosition') pCheckboxLabelPosition = 'right' || 'left';
  @Input('disabled') pCheckboxDisabled: boolean;
  @Input('color') pCheckboxColor = 'var(--primary)';

  @Input('checked') pCheckboxChecked: boolean;
  @Output() pCheckboxCheckedChange = new EventEmitter<boolean>();

  @Input('indeterminate') pCheckboxIndeterminate: boolean;
  @Output() pCheckboxIndeterminateChange = new EventEmitter<boolean>();

  isPressed: boolean;

  constructor() {}

  change = (_) => {};
  blur = (_) => {};

  ngOnInit() {}

  writeValue(obj: boolean): void {
    this.pCheckboxChecked = obj;
  }

  registerOnChange(fn: any): void {
    this.change = fn;
  }

  registerOnTouched(fn: any): void {
    this.blur = fn;
  }

  registerChecked(event: boolean): boolean {
    this.change(event);
    this.pCheckboxIndeterminateChange.emit(event);
    return event;
  }

  @HostBinding('checkbox-disabled')
  get isDisabled() {
    return this.pCheckboxDisabled;
  }

  @HostListener('mousedown', ['$event'])
  mouseDown() {
    this.isPressed = true;
    console.log('object');
  }
  @HostListener('mouseup', ['$event'])
  mouseUp() {
    this.isPressed = false;
  }
}
