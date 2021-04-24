import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-switch-toggle, p-switch-toggle',
  templateUrl: './switch-toggle.component.html',
  styleUrls: ['./switch-toggle.component.css'],
})
export class SwitchToggleComponent implements OnInit, AfterViewInit {
  @Input() pSwitchId: string;
  @Input() pSwitchActive = false;
  @Input() pSwitchDisabled = false;
  @Input() pSwitchLabelLeft: string;
  @Input() pSwitchLabelRight: string;
  @Input() pSwitchIconLeft: string;
  @Input() pSwitchIconRight: string;
  @Input() pSwitchColor: string;
  @Input() hasRipple = true;
  @Output() switchValue = new EventEmitter<boolean>();

  rippleColor: string;
  switchBackgroundColor: string;
  switchVal: boolean;
  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      if (this.checkRequiredFields(this.pSwitchId)) {
        this.backgroundColorSwitchThumb();
        this.backgroundColorSwitch();
        const checkInput = document.getElementById(
          this.pSwitchId
        ) as HTMLInputElement;
        if (this.pSwitchActive) {
          checkInput.checked = true;
          checkInput.parentElement.classList.add('active');
          this.emitSwitchValue(true);
        } else {
          this.emitSwitchValue(false);
        }
      }
    }, 0);
  }

  ngAfterViewInit(): void {
    if (this.checkRequiredFields(this.pSwitchId)) {
      const checkInput = document.getElementById(
        this.pSwitchId
      ) as HTMLInputElement;

      if (this.pSwitchDisabled) {
        checkInput.setAttribute('disabled', 'disabled');
        checkInput.parentElement.parentElement.parentElement.classList.add(
          'switch-layout-disabled'
        );
      }
    }
    setTimeout(() => {
      this.setRippleColor();
    }, 0);
  }

  private setRippleColor(): void {
    if (this.pSwitchColor) {
      if (
        /#([A-Fa-f0-9]{3}){1,2}$/.test(this.pSwitchColor) ||
        /([A-Fa-f0-9]{3}){1,2}$/.test(this.pSwitchColor)
      ) {
        this.rippleColor = this.pSwitchColor + '26';
      }
    } else {
      const primary = getComputedStyle(document.body).getPropertyValue(
        '--primary'
      );
      this.rippleColor = primary + '26';
    }
  }

  // sets the background color of the switch thumb
  private backgroundColorSwitchThumb(): any {
    const switchThumb = document.getElementById('switch-thumb');
    if (this.pSwitchColor) {
      switchThumb.style.setProperty('--switch-thumb', this.pSwitchColor);
    }
  }

  // sets the background color of the SwitchBackground
  private backgroundColorSwitch(): any {
    const SwitchBack = document.getElementById('switch-cont');
    if (this.pSwitchColor) {
      if (
        /#([A-Fa-f0-9]{3}){1,2}$/.test(this.pSwitchColor) ||
        /([A-Fa-f0-9]{3}){1,2}$/.test(this.pSwitchColor)
      ) {
        SwitchBack.style.setProperty(
          '--container-background',
          this.pSwitchColor + '99'
        );
      }
    } else {
      const mainColorVar = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary')
        .trim();
      this.pSwitchColor = mainColorVar;
      if (
        /#([A-Fa-f0-9]{3}){1,2}$/.test(this.pSwitchColor) ||
        /([A-Fa-f0-9]{3}){1,2}$/.test(this.pSwitchColor)
      ) {
        SwitchBack.style.setProperty(
          '--container-background',
          this.pSwitchColor + '99'
        );
      }
    }
  }

  // Emits a value of true or false to parent component
  emitSwitchValue(event: boolean): any {
    this.switchVal = event;
    this.switchValue.emit(event);
  }

  // checks if required input is not undefined or null
  // if it's either, it throws an error
  checkRequiredFields(input): boolean {
    if (input === null || input === undefined) {
      throw new Error(
        'Atributo "pSwitchId" é obrigatório.  Exemplo:    <p-switch-toggle pSwitchId="switchId"></p-switch-toggle>'
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
