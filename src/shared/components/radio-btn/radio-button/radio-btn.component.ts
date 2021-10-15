/* eslint-disable @angular-eslint/no-input-rename */
import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-radio-button, p-radio-button',
  templateUrl: './radio-btn.component.html',
  styleUrls: ['./radio-btn.component.css'],
})
export class RadioBtnComponent implements OnInit {
  /**
   * Value for the radio button.
   */
  @Input('value') pRadioValue: any;
  /**
   * Custom Id given to the radio button.
   */
  @Input() pRadioId: string;
  /**
   * Custom color to radio button.
   */
  @Input('color') pRadioColor: string;

  pRadioCollectionName: string;

  @ViewChild('input') radioBtn: any;

  pRadioRippleColor = 'var(--secondaryLowOpacity)';

  contents: any;

  constructor() {}

  ngOnInit(): void {
    console.log(this.pRadioValue);
    setTimeout(() => {
      this.checkCustomColor();
    }, 5);
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
}
