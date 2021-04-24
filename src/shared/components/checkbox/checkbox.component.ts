import {
  Component,
  Input,
  OnInit,
  Output,
  AfterViewInit,
  EventEmitter,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-checkbox, p-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
})
export class CheckboxComponent implements OnInit, AfterViewInit {
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
   * isChecked when flagged as true, automatically adds the attribute "checked" to the input,
   * and changes it's value to be true from the start
   *
   * This property is optional, if it's not filled, it will automatically assume the value of false;
   *
   * Example:
   *    <app-checkbox [isChecked]="true"></app-checkbox>
   */
  @Input() pCheckboxChecked = false;
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
   * CheckValue refers to the current value of the input, always returning true or false;
   *
   * Example:
   *    parent.component.html:
   *      <app-checkbox (checkValue)="receiveValue($event)"></app-checkbox>
   *
   *    parent.component.ts:
   *      receiveValue(event): any {
   *        console.log(event);
   *      }
   *
   *    Result:
   *      true or false
   */
  @Output() checkValue = new EventEmitter<boolean>();
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

  rippleColor: string;
  checkVal: boolean;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      if (this.checkRequiredFields(this.pCheckboxId)) {
        const checkInput = document.getElementById(
          this.pCheckboxId
        ) as HTMLInputElement;
        // Checks to see if property "isChecked" is true or false;
        if (this.pCheckboxChecked) {
          // adds the checked attribute to the input if "isChecked" is true;
          checkInput.checked = true;
          // calls the checkValueFunc to emit a value of true;
          this.checkValueFunc(true);
        } else {
          // if it's not checked, calls the event emit function, to emit the value of false
          this.checkValueFunc(false);
        }
      }
    }, 0);
  }

  // Needs to be in after view init
  ngAfterViewInit(): void {
    // Checks if required field (checkId) is valid;
    if (this.checkRequiredFields(this.pCheckboxId)) {
      const checkInput = document.getElementById(
        this.pCheckboxId
      ) as HTMLInputElement;

      if (this.pCheckboxIndeterminate) {
        const checkbox = document.getElementById(
          this.pCheckboxId
        ) as HTMLInputElement;
        checkbox.indeterminate = true;
      }

      if (this.pCheckboxDisabled) {
        // sets the disabled attribute to the input
        checkInput.setAttribute('disabled', 'disabled');

        checkInput.parentElement.parentElement.classList.add(
          'checkbox-layout-disabled'
        );
      }
    }
    setTimeout(() => {
      this.setRippleColor();
    }, 0);
  }

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

  // Emits a value of true or false to parent component
  checkValueFunc(event: boolean): any {
    const checkbox = document.getElementById(
      this.pCheckboxId
    ) as HTMLInputElement;
    checkbox.indeterminate = false;
    this.checkVal = event;
    this.checkValue.emit(event);
  }

  // checks if required input is not undefined or null
  // if it's either, it throws an error
  checkRequiredFields(input): boolean {
    if (input === null || input === undefined) {
      throw new Error(
        'Atributo "checkId" é obrigatório.  Exemplo:    <app-checkbox checkId="check1"></app-checkbox>'
      );
    } else {
      return true;
    }
  }
}
