import { Directive, HostListener, Input } from '@angular/core';
import { Snackbar } from 'src/shared/components/snackbar/snackbar';

@Directive({
  selector: '[appClipboard], [pClipboard]',
})
export class ClipboardDirective {
  @Input() contentToCopy: any;
  constructor(private snackbar: Snackbar) {}

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
