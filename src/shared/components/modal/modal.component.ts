import {
  AfterViewInit,
  Component,
  Directive,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[app-modal-trigger] , [p-modal-trigger], [pModalTrigger]',
})
export class ModalTriggerDirective {
  @Input() pModalId: string;
  constructor(private modalComp: ModalComponent) {}
  @HostListener('click', ['$event']) openModal(event): void {
    this.modalComp.openModal(this.pModalId);
  }
}

@Directive({
  selector: '[app-modal-close] , [p-modal-close], [pModalclose]',
})
export class ModalCloseDirective {
  @Input() pModalId: string;
  constructor(private modalComp: ModalComponent) {}
  @HostListener('click', ['$event']) openModal(event): void {
    this.modalComp.closeModal(this.pModalId);
  }
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit, AfterViewInit {
  @Input() modalShow = false;
  @Input() modalStatic = false;
  @Input() modalHeaderFooterFixed = false;
  @Input() modalSize: string;
  @Input() modalId: string;
  @Input() hasModalFooter = true;
  @Input() hasModalHeader = true;
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.modalShow) {
      this.openModal(this.modalId);
    }
    if (this.modalStatic) {
      this.setModalStatic(this.modalId);
    }
    if (this.modalSize) {
      this.setModalSize();
    }
  }

  setModalSize(): void {
    const modal = document.getElementById(this.modalId);
    switch (this.modalSize) {
      case 'large':
        modal.classList.add('large');
        break;
      case 'small':
        modal.classList.add('small');
        break;
      default:
        break;
    }
  }

  setModalStatic(id): void {
    const modal = document.getElementById(id);
    modal.classList.add('modal-static');
  }

  public openModal(id): void {
    this.modalShow = true;
    const modal = document.getElementById(id);
    const background = document.createElement('div');
    background.classList.add('backdrop-modal');
    const body = document.querySelector('body');
    body.insertAdjacentElement('beforeend', background);
    body.style.overflow = 'hidden';
    background.style.zIndex = '999';
    background.style.opacity = '.5';
    modal.style.zIndex = '1000';
    setTimeout(() => {
      modal.style.opacity = '1';
      modal.style.transform = 'translateY(-50%) translateX(-50%) scale(1)';
      if (!modal.classList.contains('modal-static')) {
        background.addEventListener('click', () => {
          this.closeModal(id);
        });
      }
    }, 0);
  }

  public closeModal(id): void {
    this.modalShow = false;
    const modal = document.getElementById(id);
    const backdrop = document.querySelector(
      '.backdrop-modal'
    ) as HTMLDivElement;
    const body = document.querySelector('body');
    backdrop.style.opacity = '0';
    modal.style.opacity = '0';
    body.style.overflow = 'visible';
    backdrop.addEventListener('transitionend', () => {
      modal.style.zIndex = '-1';
      modal.style.transform = 'translateY(-50%) translateX(-50%) scale(0.9)';
      backdrop.removeEventListener('click', () => {});
      backdrop.remove();
    });
  }
}
