import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackbars = [];

  constructor() {}

  openSnackbar(): void {
    this.createSnack('bottom', 'center', 'Texto custom');
  }

  private createSnack(
    positionY?: string,
    positionX?: string,
    SnackText?: string,
    snackDuration?: number
  ): void {
    const snackbar = document.createElement('div');
    const body = document.querySelector('body');
    snackbar.classList.add('snackbar');
    snackbar.classList.add('elevation');
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
    this.snackbars.push({ snack: snackbar, isActive: true });
    body.insertAdjacentElement('beforeend', snackbar);
    const text = document.createElement('span');
    text.insertAdjacentText('beforeend', SnackText);
    snackbar.style.display = 'block';
    snackbar.insertAdjacentElement('beforeend', text);
    snackbar.id = this.snackbars.length + '-snack';
    if (this.snackbars?.length > 1) {
      const numb = this.snackbars.length - 1;
      const extraSnack = document.getElementById(numb + '-snack');
      const snArr = this.snackbars.find((x) => x.snack === extraSnack);
      setTimeout(() => {
        snArr.isActive = false;
        extraSnack.remove();
      }, 0);
    }
    setTimeout(
      () => {
        snackbar.style.opacity = '0';
        snackbar.addEventListener('transitionend', () => {
          snackbar.style.display = 'none';
          const snArr = this.snackbars.find((x) => x.snack === snackbar);
          snArr.isActive = false;
          snackbar.remove();
          const allTrue = this.snackbars.filter((x) => x.isActive === true);
          if (allTrue.length === 0) {
            this.snackbars = [];
          }
        });
      },
      snackDuration ? snackDuration : 2500
    );
  }
}
