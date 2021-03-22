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
  @Input() checkId: string;
  /**
   * CheckboxText is the text that goes at the checkbox's side
   *
   * This property is optional, if it's not filled, it will not appear;
   *
   * Example:
   *    <app-checkbox checkboxText="Check!"></app-checkbox>
   */
  @Input() checkboxText: string;
  /**
   * CheckboxColor is the hex of a custom color, used for the checkbox;
   *
   * This property is optional, if it's not filled, it will automatically assume the value of the css variable --primary
   * in angular-productive.css;
   *
   * Example:
   *    <app-checkbox checkboxColor="#3f51b5"></app-checkbox>
   */
  @Input() checkboxColor: string;
  /**
   * CUT FEATURE, NOW IT SHOULD AUTOMATICALLY COLOR A WAVE BASED ON BACKGROUND COLOR
   * CheckboxWaveColor is an rgba value set for the ripple effect;
   *
   * This property is optional, if it's not filled, it will automatically assume the default ripple color;
   *
   * This value is valid for both Checkboxes and Switches;
   *
   * Example:
   *    <app-checkbox checkboxWaveColor="rgba(255, 0, 0, 0.65)"></app-checkbox>
   */
  // @Input() checkboxWaveColor: string;
  /**
   * isChecked when flagged as true, automatically adds the attribute "checked" to the input,
   * and changes it's value to be true from the start
   *
   * This property is optional, if it's not filled, it will automatically assume the value of false;
   *
   * Example:
   *    <app-checkbox [isChecked]="true"></app-checkbox>
   */
  @Input() isChecked = false;
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
  @Input() isDisabled = false;
  /**
   * isIndeterminate is when a checkbox has a state of undefined, in use cases such as multiple items that can be selected
   * at once;
   *
   * This property is optional, if it's not filled, it will automatically assume the value of false;
   *
   * Example:
   *    <app-checkbox [isIndeterminate]="true"></app-checkbox>
   */
  @Input() isIndeterminate = false;
  /**
   * isSwitch when flagged as true, automatically transforms the default checkbox to Material Design styled Switch;
   *
   * This property is optional, if it's not filled, it will automatically assume the value of false;
   *
   * Exemplo:
   *    <app-checkbox [isSwitch]="true"></app-checkbox>
   */
  @Input() isSwitch = false;
  /**
   * SwitchTextLeft is the left aligned text of a Switch;
   *
   * It can be used alone, or together with SwitchIconLeft and with both SwitchTextRight and SwitchIconRight
   *
   * This property is optional, if it's not filled, it will not appear;
   *
   * Example:
   *    <app-checkbox switchTextLeft="Off"></app-checkbox>
   */
  @Input() switchTextLeft: string;
  /**
   * SwitchTextRight is the right aligned text of a Switch;
   *
   * It can be used alone, or together with SwitchIconRight and with both SwitchTextLeft and SwitchIconLeft
   *
   * This property is optional, if it's not filled, it will not appear;
   *
   * Example:
   *    <app-checkbox switchTextRight="On"></app-checkbox>
   */
  @Input() switchTextRight: string;
  /**
   * SwitchIconLeft is the left aligned icon of a Switch
   *
   * It can be used alone, or together with SwitchTextLeft and with both SwitchTextRight and SwitchIconRight
   *
   * This property is optional, if it's not filled, it will not appear;
   *
   * Example:
   *    <app-checkbox switchIconLeft="mood_bad"></app-checkbox>
   */
  @Input() switchIconLeft: string;
  /**
   * SwitchIconRight is the right aligned icon of a Switch
   *
   * It can be used alone, or together with SwitchTextRight and with both SwitchTextLeft and SwitchIconLeft
   *
   * This property is optional, if it's not filled, it will not appear;
   *
   * Example:
   *    <app-checkbox switchIconRight="mood"></app-checkbox>
   */
  @Input() switchIconRight: string;
  /**
   * SwitchColor is the custom color hex for a Switch
   *
   * This property is optional, if it's not filled, it will automatically assume the value of the css variable --main
   * in ngx-productive.css;
   *
   * Example:
   *    <app-checkbox switchColor="#3f51b5"></app-checkbox>
   */
  @Input() switchColor: string;
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

  switchBackgroundColor: string;
  rippleColor: string;
  checkVal = false;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      if (this.isSwitch) {
        this.backgroundColorSwitchThumb();
        this.backgroundColorSwitch();
      }
    }, 0);
  }

  // Needs to be in after view init
  ngAfterViewInit(): void {
    // Checks if required field (checkId) is valid;
    if (this.checkRequiredFields(this.checkId)) {
      const checkInput = document.getElementById(
        this.checkId
      ) as HTMLInputElement;
      // Checks to see if property "isChecked" is true or false;
      if (this.isChecked) {
        // adds the checked attribute to the input if "isChecked" is true;
        checkInput.checked = true;

        checkInput.parentElement.classList.add('active');
        // calls the checkValueFunc to emit a value of true;
        this.checkValueFunc(true);
      } else {
        // if it's not checked, calls the event emit function, to emit the value of false
        this.checkValueFunc(false);
      }

      if (this.isIndeterminate) {
        const checkbox = document.getElementById(
          this.checkId
        ) as HTMLInputElement;
        checkbox.indeterminate = true;
      }

      if (this.isDisabled) {
        // sets the disabled attribute to the input
        checkInput.setAttribute('disabled', 'disabled');

        if (!this.isSwitch) {
          checkInput.parentElement.parentElement.classList.add(
            'checkbox-layout-disabled'
          );
        } else {
          checkInput.parentElement.parentElement.parentElement.classList.add(
            'checkbox-layout-switch-disabled'
          );
        }
      }
    }
    setTimeout(() => {
      this.setRippleColor();
    }, 0);
  }

  setRippleColor(): void {
    if (this.checkboxColor || this.switchColor) {
      if (
        /#([A-Fa-f0-9]{3}){1,2}$/.test(this.checkboxColor) ||
        /([A-Fa-f0-9]{3}){1,2}$/.test(this.checkboxColor) ||
        /#([A-Fa-f0-9]{3}){1,2}$/.test(this.switchColor) ||
        /([A-Fa-f0-9]{3}){1,2}$/.test(this.switchColor)
      ) {
        if (!this.isSwitch) {
          this.rippleColor = this.checkboxColor + '26';
        } else {
          this.rippleColor = this.switchColor + '26';
        }
      }
    } else {
      const primary = getComputedStyle(document.body).getPropertyValue(
        '--primary'
      );
      this.rippleColor = primary + '26';
    }
  }

  // sets the background color of the switch thumb
  backgroundColorSwitchThumb(): any {
    const switchThumb = document.getElementById('switch-thumb');
    if (this.switchColor) {
      switchThumb.style.setProperty('--switch-thumb', this.switchColor);
    }
  }

  // sets the background color of the SwitchBackground
  backgroundColorSwitch(): any {
    const SwitchBack = document.getElementById('switch-cont');
    if (this.switchColor) {
      if (
        /#([A-Fa-f0-9]{3}){1,2}$/.test(this.switchColor) ||
        /([A-Fa-f0-9]{3}){1,2}$/.test(this.switchColor)
      ) {
        SwitchBack.style.setProperty(
          '--container-background',
          this.switchColor + '99'
        );
      }
    } else {
      const mainColorVar = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary')
        .trim();
      this.switchColor = mainColorVar;
      if (
        /#([A-Fa-f0-9]{3}){1,2}$/.test(this.switchColor) ||
        /([A-Fa-f0-9]{3}){1,2}$/.test(this.switchColor)
      ) {
        SwitchBack.style.setProperty(
          '--container-background',
          this.switchColor + '99'
        );
      }
    }
  }

  // Emits a value of true or false to parent component
  checkValueFunc(event): any {
    const checkbox = document.getElementById(this.checkId) as HTMLInputElement;
    checkbox.indeterminate = false;
    this.checkVal = event;
    this.checkValue.emit(event);
  }

  // makes hexadecimal value from switchColor, low opacity
  hexLowOpacity(hex): any {
    if (
      /#([A-Fa-f0-9]{3}){1,2}$/.test(hex) ||
      /([A-Fa-f0-9]{3}){1,2}$/.test(hex)
    ) {
      hex = hex + 'A6';
      this.switchBackgroundColor = hex;
      return true;
    }
    throw new Error('The color switch value has to be a hex.');
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

  @HostListener('change', ['$event']) addActiveClassSwitch(event): void {
    const SwitchBack = document.getElementById('switch-cont');
    const switchInput = SwitchBack.firstChild as HTMLInputElement;
    if (switchInput.checked) {
      SwitchBack.classList.add('active');
    } else {
      SwitchBack.classList.remove('active');
    }
  }
}
