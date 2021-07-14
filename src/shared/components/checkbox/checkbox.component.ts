import { Component, Input, AfterViewInit, forwardRef } from '@angular/core';
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
export class CheckboxComponent implements AfterViewInit {
  /**
   * CheckId is an Id given to a checkbox
   *
   * This property is mandatory, if it's not filled, an error will be thrown;
   *
   * Example:
   *   <app-checkbox checkId="yourIdHere"></app-checkbox>
   */
  @Input() pCheckboxId: string;
  /**
   * CheckboxText is the text that goes at the checkbox's side
   *
   * This property is optional, if it's not filled, it will not appear;
   *
   * Example:
   *    <app-checkbox checkboxText="Check!"></app-checkbox>
   */
  @Input() pCheckboxLabel: string;
  /**
   * CheckboxColor is the hex of a custom color, used for the checkbox;
   *
   * This property is optional, if it's not filled, it will automatically assume the value of the css variable --primary
   * in angular-productive.css;
   *
   * Example:
   *    <app-checkbox checkboxColor="#3f51b5"></app-checkbox>
   */
  @Input() pCheckboxColor: string;
  /**
   * isDisabled when flagged as true, automatically adds the attribute "disabled" to the input
   * preventing any type of interaction from the user side
   *
   * This property can be used with Switches;
   *
   * This property can be used with isChecked;
   *
   * This property is optional, if it's not filled, it will automatically assume the value of false;
   *
   * Example:
   *    <app-checkbox [isDisabled]="true"></app-checkbox>
   */
  @Input() pCheckboxDisabled = false;
  /**
   * isIndeterminate is when a checkbox has a state of undefined, in use cases such as multiple items that can be selected
   * at once;
   *
   * This property is optional, if it's not filled, it will automatically assume the value of false;
   *
   * Example:
   *    <app-checkbox [isIndeterminate]="true"></app-checkbox>
   */
  @Input() pCheckboxIndeterminate = false;
  /**
   * hasRipple is an option that indicates if a checkbox or a Switch has the RippleEffect with them;
   *
   * This property is optional, if it's not filled, it will automatically assume the value of true;
   *
   * Example:
   *    <app-checkbox [hasRipple]="false"></app-checkbox> <- RippleEffect will not appear
   */
  @Input() hasRipple = true;
  /**
   * In case you want to include a checkbox under a element with a click event, such as the example below:
   *
   *  <table>
   *    <tbody>
   *      <tr (click)="clickFunction()">
   *        <td>
   *          <app-checkbox></app-checkbox>
   *        </td>
   *      </tr>
   *    </tbody>
   *  </table>
   *
   * Make sure to add a attribute of (click)="false", like the example below, to prevent the checkbox of firing more than one event,
   * thus triggering the parent element function more than one time, which can break some functions;
   *
   *  <table>
   *    <tbody>
   *      <tr (click)="clickFunction()">
   *        <td>
   *          <app-checkbox (click)="false"></app-checkbox>
   *        </td>
   *      </tr>
   *    </tbody>
   *  </table>
   *
   * Remembering that, this will make the checkbox not fire ANY events, including the checkValue event, so it can't be paired together
   *
   * This is just a temporary fix;
   */
  @Input('pCheckboxChecked') checked: boolean;

  rippleColor: string;

  constructor() {}

  change = (_) => {};
  blur = (_) => {};

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setRippleColor();
    }, 0);
  }

  // sets ripple color based on checkbox color
  setRippleColor(): void {
    if (this.pCheckboxColor) {
      if (
        /#([A-Fa-f0-9]{3}){1,2}$/.test(this.pCheckboxColor) ||
        /([A-Fa-f0-9]{3}){1,2}$/.test(this.pCheckboxColor)
      ) {
        this.rippleColor = this.pCheckboxColor + '26';
      }
    } else {
      const primary = getComputedStyle(document.body).getPropertyValue(
        '--primary'
      );
      this.rippleColor = primary + '26';
    }
  }

  // writes the checkbox value
  writeValue(obj: boolean): void {
    this.checked = obj;
  }

  // register the changes
  registerOnChange(fn: any): void {
    this.change = fn;
  }

  // blurs the component
  registerOnTouched(fn: any): void {
    this.blur = fn;
  }

  // sets the checkbox to a disabled state
  setDisabledState?(isDisabled: boolean): void {
    this.pCheckboxDisabled = isDisabled;
  }

  // sets the checkbox to a indeterminate state
  setIndeterminateState?(indeterminate: boolean): void {
    this.pCheckboxIndeterminate = indeterminate;
  }

  // changes the value of the checkbox
  onCheck($event) {
    this.checked = $event && $event.target && $event.target.checked;
    this.change(this.checked);
  }
}
