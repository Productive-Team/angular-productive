import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-radio-button, p-radio-button',
  templateUrl: './radio-btn.component.html',
  styleUrls: ['./radio-btn.component.css'],
})
export class RadioBtnComponent implements OnInit {
  /**
   * radioValue is the value that the Radio Button will have, it can be anything;
   *
   * This property is mandatory, if it's not filled, an error will be thrown;
   *
   * Example:
   *    <p-radio-button radioValue="YourValue"></p-radio-button>
   */
  @Input() pRadioValue: any;
  /**
   * radioId is an Id given to a Radio Button
   *
   * This property is mandatory, if it's not filled, an error will be thrown;
   *
   * Example:
   *    <p-radio-button radioId="YourId"></p-radio-button>
   */
  @Input() pRadioId: string;
  /**
   * radioColor is the hex value for a custom color to the radio button outer and inner circle
   *
   * This property is optional, if it's not filled, it will automatically assume the value of the css variable --main
   * in ngx-productive.css
   *
   * Example:
   *    <p-radio-button radioColor="#3f51b5"></p-radio-button>
   */
  @Input() pRadioColor: string;
  /**
   * radioText is a text that appears at the side of the Radio Button
   *
   * This property is optional, if it's not filled, it will not appear
   *
   * Example:
   *    <p-radio-button radioText="Radio!"></p-radio-button>
   */
  @Input() pRadioText: string;
  /**
   * radioCollectionName is a value given to a collection of radio buttons, it is used where there are two or more
   * related buttons
   *
   * This property is mandatory, if it's not filled, an error will be thrown;
   *
   * Example:
   *    <p-radio-button radioCollectionName="YourCollectionName"></p-radio-button>
   *    <p-radio-button radioCollectionName="YourCollectionName"></p-radio-button>
   *    <p-radio-button radioCollectionName="YourCollectionName"></p-radio-button>
   *    <p-radio-button radioCollectionName="YourCollectionName"></p-radio-button>
   */
  @Input() pRadioCollectionName: string;
  /**
   * pRadioTextAlignment is an option to align the radio button text;
   *
   * Accepted values are left, right (default), before, after;
   *
   * For this property to work, the radioText property needs to be filled;
   *
   * This property is optional, if it's not filled, it will automatically assume the value of right;
   *
   * Example:
   *    <p-radio-button pRadioTextAlignment="left"></p-radio-button>
   */
  @Input() pRadioTextAlignment = 'right';
  /**
   * returnRadioValue refers to the set value of a radio button;
   *
   * It emits the value set in radioValue back to the parent component
   *
   * Example:
   *    parent.component.html:
   *      <p-radio-button (returnRadioValue)="receiveValue($event)" radioValue="YourValue"></p-radio-button>
   *
   *    parent.component.ts:
   *      receiveValue(event): any {
   *        console.log(event);
   *      }
   *
   *    Result:
   *      YourValue
   */
  @Output() returnRadioValue = new EventEmitter<any>();

  pRadioRippleColor = 'var(--primaryLowOpacity)';
  constructor() {}

  ngOnInit(): void {
    this.checkRequiredFields(
      this.pRadioValue,
      this.pRadioCollectionName,
      this.pRadioValue
    );
    setTimeout(() => {
      this.checkCustomColor();
    }, 5);
  }

  // Returns value set in radioValue back to parent component
  returnRadValue(event): any {
    this.returnRadioValue.emit(event);
  }

  checkCustomColor(): any {
    const radioButton = document.getElementById('wrapper-' + this.pRadioId);
    switch (this.pRadioColor) {
      case 'primary':
        this.pRadioRippleColor = 'var(--primaryLowOpacity)';
        radioButton.style.setProperty(
          '--radio-selected-color',
          'var(--primary)'
        );
        break;
      case 'secondary':
        this.pRadioRippleColor = 'var(--secondaryLowOpacity)';
        radioButton.style.setProperty(
          '--radio-selected-color',
          'var(--secondary)'
        );
        break;
      case undefined:
        break;
      default:
        this.pRadioRippleColor = this.setsColorToLowOpacity(this.pRadioColor);
        radioButton.style.setProperty(
          '--radio-selected-color',
          this.pRadioColor
        );
    }
  }

  setsColorToLowOpacity(color: string): string {
    if (/^#(?:[A-Fa-f0-9]{3}){1,2}$/.test(color)) {
      color = color + '1e';
    } else if (
      /^rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}[)]$/.test(
        color
      )
    ) {
      let rgb = color.trim();
      const endrgb = rgb.lastIndexOf(')');
      rgb = rgb.slice(0, 3) + 'a' + rgb.slice(3, endrgb);
      rgb = rgb + ',0.15)';
      color = rgb;
    }
    return color;
  }

  // Checks if radioId, radioCollectionName and radioValue are filled
  checkRequiredFields(inputId, inputName, inputValue): boolean {
    if (
      inputId === null ||
      inputId === undefined ||
      inputName === null ||
      inputName === undefined ||
      inputValue === undefined ||
      inputValue === null
    ) {
      throw new Error(
        'Attributes "radioId", "radioCollectionName" and "radioValue" are mandatory.  Example:    <p-radio-button radioId="radioBtn" radioCollectionName="radioCollection" radioValue="YourValue"></p-radio-button>'
      );
    } else {
      return true;
    }
  }
}
