import { trigger, transition, style, animate } from '@angular/animations';
import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appModalTrigger], [pModalTrigger], [p-modal-trigger]',
})
export class ModalTriggerDirective {
  @Input() pModalTriggerFor: any;
  @HostListener('click', ['$event'])
  openModal(): void {
    this.pModalTriggerFor.openModal();
  }
}

@Directive({
  selector: '[appModalClose], [pModalClose], [p-modal-close]',
})
export class ModalCloseDirective {
  @Input() pModalCloseFor: any;
  @HostListener('click', ['$event'])
  openModal(): void {
    this.pModalCloseFor.closeModal();
  }
}

@Component({
  selector: 'app-modal, p-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  animations: [
    trigger('modalRegular', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-50%) translateX(-50%) scale(0.9)',
        }),
        animate(
          '150ms',
          style({
            opacity: 1,
            transform: 'translateY(-50%) translateX(-50%) scale(1)',
          })
        ),
      ]),
      transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
    ]),

    // TODO: Figure out a way to make a single element execute two different animations depending
    // on the state of a boolean
    //
    // trigger('modalBottom', [
    //   transition(':enter', [
    //     style({
    //       opacity: 0,
    //       transform: 'translateY(100%) translateX(-50%)',
    //     }),
    //     animate(
    //       '150ms',
    //       style({
    //         opacity: 1,
    //         transform: 'translateY(-100%) translateX(-50%)',
    //       })
    //     ),
    //   ]),
    //   transition(':leave', [
    //     animate(
    //       '100ms',
    //       style({
    //         opacity: 0,
    //       })
    //     ),
    //   ]),
    // ]),
  ],
})
export class ModalComponent implements AfterViewInit {
  /**
   * Makes the modal open whenever the component is initialized.
   */
  @Input() pModalShow = false;
  /**
   * Does not perform the action of closing the modal
   * when clicked, making so the only way to dismiss the modal is using the pModalClose Directive in an element.
   */
  @Input() pModalStatic = false;
  /**
   * Changes the max-width size of the modal.
   */
  @Input() pModalSize: ModalSize = 'medium';
  /**
   * Sets an Id to the modal element in itself.
   */
  @Input() pModalId: any;
  /**
   * Toggles modal footer visibility.
   */
  @Input() hasModalFooter = true;
  /**
   * Toggles modal header visibility.
   */
  @Input() hasModalHeader = true;
  /**
   * Adds a class to the modal element that makes it look like a bottom sheet element.
   */
  @Input() pBottomSheet = false;

  isOpen = false;
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    if (this.pModalShow) {
      setTimeout(() => {
        this.openModal();
      }, 0);
    }
  }

  public openModal(): void {
    this.isOpen = true;
    setTimeout(() => {
      const modal = this.el.nativeElement.firstChild;
      if (this.pModalStatic) {
        modal.classList.add('modal-static');
      }
      const background = document.createElement('div');
      background.classList.add('backdrop-modal');
      const body = document.querySelector('body');
      body.insertAdjacentElement('beforeend', background);
      body.style.overflow = 'hidden';
      background.style.zIndex = '999';
      background.style.opacity = '0.5';
      setTimeout(() => {
        if (!modal.classList.contains('modal-static')) {
          background.addEventListener('click', () => {
            this.closeModal();
          });
        }
      }, 0);
    }, 0);
  }

  public closeModal(): void {
    this.isOpen = false;
    const backdrop = document.querySelector(
      '.backdrop-modal'
    ) as HTMLDivElement;
    const body = document.querySelector('body');
    backdrop.style.opacity = '0';
    body.style.overflow = 'visible';
    backdrop.addEventListener('transitionend', () => {
      backdrop.remove();
    });
  }
}

type ModalSize = 'small' | 'medium' | 'large';
