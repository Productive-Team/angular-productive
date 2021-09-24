import { Directive, HostListener, Input } from '@angular/core';
import { SnackbarService } from 'src/shared/services/snackbar.service';

@Directive({
  selector: '[appClipboard], [pClipboard]',
})
export class ClipboardDirective {
  @Input() contentToCopy: any;
  constructor(private snackbar: SnackbarService) {}

  @HostListener('click', ['$event'])
  copyToClipboard(): void {
    const isHTMLElement = this.contentToCopy instanceof HTMLElement;
    if (!isHTMLElement) {
      navigator.clipboard.writeText(this.contentToCopy);
    } else {
      const text = this.contentToCopy.textContent;
      navigator.clipboard.writeText(text);
    }
    this.snackbarLaunch();
  }

  snackbarLaunch(): void {
    this.snackbar.openSnackbar('Copied!');
  }
}
