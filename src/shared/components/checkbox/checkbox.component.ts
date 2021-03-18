import { element } from 'protractor';
import {
  Component,
  Input,
  OnInit,
  Output,
  AfterViewInit,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-checkbox',
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
   * This property is optional, if it's not filled, it will automatically assume the value of the css variable --main
   * in ngx-productive.css;
   *
   * Example:
   *    <app-checkbox checkboxColor="#3f51b5"></app-checkbox>
   */
  @Input() checkboxColor: string;
  /**
   * THIS EXPLANATION HAS BEEN DEPRECIATED;
   *
   * CheckboxWaveColor is the name of the custom wave's class, that is defined in ngx-productive.css;
   *
   * This property is optional, if it's not filled, it will automatically assume the default wave color;
   *
   * This value is valid for both Checkboxes and Switches;
   *
   * Example:
   *      CSS:
   *        .waves-effect.waves-brown .waves-ripple {
   *          background-color: rgba(121, 85, 72, 0.65);
   *         }
   *      HTML:
   *        <app-checkbox checkboxWaveColor="brown"></app-checkbox>
   *
   */
  /**
   * CheckboxWaveColor is an rgba value set for the ripple effect;
   *
   * This property is optional, if it's not filled, it will automatically assume the default ripple color;
   *
   * This value is valid for both Checkboxes and Switches;
   *
   * Example:
   *    <app-checkbox checkboxWaveColor="rgba(255, 0, 0, 0.65)"></app-checkbox>
   */
  @Input() checkboxWaveColor: string;
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
   * hasWaves is an option that indicates if a checkbox or a Switch has the WavesEffect with them;
   *
   * This property is optional, if it's not filled, it will automatically assume the value of true;
   *
   * Example:
   *    <app-checkbox [hasWaves]="false"></app-checkbox> <- WavesEffect will not appear
   */
  @Input() hasWaves = true;
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
  constructor() {}

  ngOnInit(): void {}

  // Needs to be in after view init
  ngAfterViewInit(): void {
    // Checks if required field (checkId) is valid;
    if (this.checkRequiredFields(this.checkId)) {
      // Get input element
      const checkInput = document.getElementById(this.checkId);
      // Checks to see if property "isChecked" is true or false;
      if (this.isChecked) {
        // adds the checked attribute to the input if "isChecked" is true;
        checkInput.setAttribute('checked', 'checked');
        // calls the checkValueFunc to emit a value of true;
        this.checkValueFunc(true);
        // checks if property "isSwitch" is true or false;
        if (this.isSwitch) {
          // Gets both switchThumb and switchBackground if "isSwitch" is true;
          const switchThumb = document.getElementById('switch-thumb');
          const SwitchBack = document.getElementById('switch-cont');
          // checks if switch color is different from undefined;
          if (this.switchColor !== undefined) {
            // if it is different from undefined, it sets the thumb color to the same hex of switchColor;
            switchThumb.style.backgroundColor = this.switchColor;
            // sends hex value of switchColor to transform it into rgba;
            this.hexLowOpacity(this.switchColor.trim());
            // rgba value returns and is set as the background color for the switchBackground;
            SwitchBack.style.backgroundColor = this.switchBackgroundColor;
          } else {
            // Gets hex from --main css variable;
            const mainColorVar = getComputedStyle(
              document.documentElement
            ).getPropertyValue('--main');
            // sends hex from css variable to transform it into rgba;
            this.hexLowOpacity(mainColorVar.trim());
            // Sets thumb color to main variable, sets switch background color to returned rgba
            switchThumb.style.backgroundColor = 'var(--main)';
            SwitchBack.style.backgroundColor = this.switchBackgroundColor;
          }
        }
      } else {
        // if it's not checked, calls the event emit function, to emit the value of false
        this.checkValueFunc(false);
        // in case it's a switch and doesn't have an [isChecked] attribute
        // it checks if the actual input behind the switch has a checked attribute added dinamically
        // do it can change the colors of the switch to be active
        if (this.isSwitch) {
          this.checkColor();
        }
      }

      if (this.isIndeterminate) {
        const checkbox = document.getElementById(
          this.checkId
        ) as HTMLInputElement;
        checkbox.indeterminate = true;
      }

      // Checks to see if input [isDisabled] attribute is set to true
      if (this.isDisabled) {
        // sets the disabled attribute to the input
        checkInput.setAttribute('disabled', 'disabled');
        // checks if it is a Switch
        if (!this.isSwitch) {
          // sets the checkbox background to be a light grey color
          checkInput.style.backgroundColor = 'rgba(0,0,0,0.2)';
          // selects the checkbox and the checkbox text
          const checkLayout = document.querySelector(
            '.checkbox-layout'
          ) as HTMLSpanElement;
          const checkText = document.querySelector(
            '.checkbox-text'
          ) as HTMLSpanElement;
          // changes the color of the text and changes the cursor to default when hovering
          checkLayout.style.cursor = 'default';
          checkText.style.color = 'rgba(0,0,0,0.5)';
        } else {
          // selects the layout and the toggle of switches
          const switchDis = document.querySelector(
            '.checkbox-layout-switch'
          ) as HTMLLabelElement;
          const switchTog = document.querySelector(
            '.checkbox-toggle-switch'
          ) as HTMLSpanElement;
          // changes the opacity of the entire switch and the cursor on hover
          switchDis.style.opacity = '0.5';
          switchTog.style.cursor = 'default';
        }
      }
    }
  }

  // sets the background color of the switch thumb
  backgroundColorSwitchThumb(event): any {
    const switchThumb = document.getElementById('switch-thumb');
    if (event.srcElement.checked) {
      if (this.switchColor !== undefined) {
        switchThumb.style.backgroundColor = this.switchColor;
      } else {
        switchThumb.style.backgroundColor = 'var(--main)';
      }
    } else {
      switchThumb.style.backgroundColor = '#ffffff';
    }
  }

  // sets the background color of the SwitchBackground
  backgroundColorSwitch(event): any {
    if (this.switchColor !== undefined) {
      this.hexLowOpacity(this.switchColor.trim());
      const SwitchBack = document.getElementById('switch-cont');
      if (event.srcElement.checked) {
        SwitchBack.style.backgroundColor = this.switchBackgroundColor;
      } else {
        SwitchBack.style.backgroundColor = 'rgba(0,0,0,0.38)';
      }
    } else {
      const mainColorVar = getComputedStyle(
        document.documentElement
      ).getPropertyValue('--main');
      this.hexLowOpacity(mainColorVar.trim());
      const SwitchBack = document.getElementById('switch-cont');
      if (event.srcElement.checked) {
        SwitchBack.style.backgroundColor = this.switchBackgroundColor;
      } else {
        SwitchBack.style.backgroundColor = 'rgba(0,0,0,0.38)';
      }
    }
  }

  // Emits a value of true or false to parent component
  checkValueFunc(event): any {
    const checkbox = document.getElementById(this.checkId) as HTMLInputElement;
    checkbox.indeterminate = false;
    this.checkValue.emit(event);
  }

  // makes hexadecimal value from switchColor, low opacity
  hexLowOpacity(hex): any {
    // let c;
    if (
      /#([A-Fa-f0-9]{3}){1,2}$/.test(hex) ||
      /([A-Fa-f0-9]{3}){1,2}$/.test(hex)
    ) {
      hex = hex + 'A6';
      // c = hex.substring(1).split('');
      // if (c.length === 3) {
      //   c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      // }
      // c = '0x' + c.join('');
      // const b =
      //   'rgba(' +
      //   // tslint:disable-next-line: no-bitwise
      //   [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') +
      //   ',0.65)';
      this.switchBackgroundColor = hex;
      return true;
    }
    throw new Error('The color switch value has to be a hex.');
  }

  // function to check if there is a dinamically added "checked" attribute added directly to the input
  // so it can apply the proper colors to a Switch
  checkColor(): void {
    setTimeout(() => {
      const checkbox = document.getElementById(
        this.checkId
      ) as HTMLInputElement;
      if (checkbox.checked) {
        const switchThumb = checkbox.nextSibling.firstChild as HTMLDivElement;
        const switchCont = checkbox.parentElement;
        if (this.switchColor !== undefined) {
          switchThumb.style.backgroundColor = this.switchColor;
          this.hexLowOpacity(this.switchColor.trim());
          switchCont.style.backgroundColor = this.switchBackgroundColor;
        } else {
          switchThumb.style.backgroundColor = 'var(--main)';
          const mainColorVar = getComputedStyle(
            document.documentElement
          ).getPropertyValue('--main');
          this.hexLowOpacity(mainColorVar.trim());
          switchCont.style.backgroundColor = this.switchBackgroundColor;
        }
      }
    }, 0);
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
