import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackbars = [];

  constructor() {}

  openSnackbar(
    positionY?: string,
    positionX?: string,
    snackbarText?: string,
    snackbarDuration?: number,
    snackbarHasButton?: boolean,
    snackbarButtonText?: string
  ): void {
    this.createSnack(
      positionY,
      positionX,
      snackbarText,
      snackbarDuration,
      snackbarHasButton,
      snackbarButtonText
    );
  }

  private createSnack(
    positionY?: string,
    positionX?: string,
    SnackText?: string,
    snackDuration?: number,
    hasButton?: boolean,
    buttonText?: string
  ): void {
    const snackbar = document.createElement('div');
    const body = document.querySelector('body');
    snackbar.classList.add('snackbar', 'elevation');
    this.setSnackPosition(positionY, positionX, snackbar);
    this.snackbars.push({ snack: snackbar, isActive: true });
    body.insertAdjacentElement('beforeend', snackbar);
    const text = document.createElement('span');
    text.insertAdjacentText('beforeend', SnackText);
    snackbar.style.display = 'block';
    snackbar.insertAdjacentElement('beforeend', text);
    snackbar.id = this.snackbars.length + '-snack';
    if (this.snackbars?.length > 1) {
      this.removeExtraSnack();
    }
    if (hasButton) {
      this.setSnackbarButton(snackbar, buttonText);
    }
    setTimeout(
      () => {
        this.removeSnackbar(snackbar);
      },
      snackDuration ? snackDuration : 2500
    );
  }

  private setSnackbarButton(snackbar: HTMLElement, btnText: string): any {
    const btn = document.createElement('button');
    btn.innerHTML = btnText;
    btn.classList.add(
      'btn-small',
      'flat',
      'secondary',
      'right',
      'snackbar-button'
    );
    btn.addEventListener('click', () => {
      this.removeSnackbar(snackbar);
    });
    snackbar.insertAdjacentElement('beforeend', btn);
  }

  private setSnackPosition(
    positionY: string,
    positionX: string,
    snackbar: HTMLElement
  ): void {
    switch (positionY) {
      case 'top':
        snackbar.classList.add('top');
        break;
      case 'bottom':
        snackbar.classList.add('bottom');
        break;
      default:
        snackbar.classList.add('bottom');
    }
    switch (positionX) {
      case 'left':
        snackbar.classList.add('left');
        break;
      case 'right':
        snackbar.classList.add('right');
        break;
      case 'center':
        snackbar.classList.add('center');
        break;
      default:
        snackbar.classList.add('center');
    }
  }

  private removeExtraSnack(): void {
    const numb = this.snackbars.length - 1;
    const extraSnack = document.getElementById(numb + '-snack');
    const snArr = this.snackbars.find((x) => x.snack === extraSnack);
    setTimeout(() => {
      snArr.isActive = false;
      extraSnack.remove();
    }, 0);
  }

  private removeSnackbar(snackbar: HTMLElement): void {
    snackbar.style.opacity = '0';
    snackbar.addEventListener('transitionend', () => {
      snackbar.style.display = 'none';
      const snArr = this.snackbars.find((x) => x.snack === snackbar);
      snArr.isActive = false;
      snackbar.remove();
      setTimeout(() => {
        const allTrue = this.snackbars.filter((x) => x.isActive === true);
        if (allTrue.length === 0) {
          this.snackbars = [];
        }
      }, 0);
    });
  }
}
