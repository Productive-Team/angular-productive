import {
  Component,
  ElementRef,
  Injectable,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css'],
})
export class SnackbarComponent {
  @ViewChild('snackbarTemplate') snackbarTemplate: TemplateRef<any>;
  @ViewChild('vc') vc: ViewContainerRef;
  constructor() {}

  openSnackbar(message: string, actionLabel?: string, action?: any): void {
    console.log(this.snackbarTemplate);
    const view = this.snackbarTemplate.createEmbeddedView({
      fromContext: message,
    });
    this.vc.insert(view);
    document.body.insertAdjacentElement(
      'beforeend',
      this.snackbarTemplate.elementRef.nativeElement
    );
  }

  dissmissSnackbar(): void {}
}
