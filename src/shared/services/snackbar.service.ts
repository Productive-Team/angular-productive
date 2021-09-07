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
    snackbar.classList.add('snackbar', 'elevation-p6');
    this.setSnackPosition(positionY, positionX, snackbar);
    this.snackbars.push({ snack: snackbar, isActive: true });

    const row = document.createElement('div');
    const col1 = document.createElement('div');
    const col2 = document.createElement('div');

    const text = document.createElement('span');
    text.insertAdjacentText('beforeend', SnackText);

    const body = document.querySelector('body');
    body.insertAdjacentElement('beforeend', snackbar);

    // snackbar.insertAdjacentElement('beforeend', text);

    snackbar.style.display = 'block';
    snackbar.id = this.snackbars.length + '-snack';
    if (this.snackbars?.length > 1) {
      this.removeExtraSnack();
    }
    if (hasButton) {
      row.classList.add('row');
      col1.classList.add('col', 's10');
      col1.style.maxHeight = '220px';
      col1.style.overflow = 'hidden';
      col1.insertAdjacentElement('beforeend', text);
      col2.classList.add('col', 's2');
      row.insertAdjacentElement('beforeend', col1);
      row.insertAdjacentElement('beforeend', col2);
      this.setSnackbarButton(snackbar, buttonText, col2);
    } else {
      row.classList.add('row');
      col1.classList.add('col', 's12');
      col1.style.maxHeight = '220px';
      col1.style.overflow = 'hidden';
      col1.insertAdjacentElement('beforeend', text);
      row.insertAdjacentElement('beforeend', col1);
    }
    snackbar.insertAdjacentElement('beforeend', row);
    setTimeout(
      () => {
        this.removeSnackbar(snackbar);
      },
      snackDuration ? snackDuration : 2500
    );
  }

  private setSnackbarButton(
    snackbar: HTMLElement,
    btnText: string,
    col2: HTMLElement
  ): any {
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
    col2.insertAdjacentElement('beforeend', btn);
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
