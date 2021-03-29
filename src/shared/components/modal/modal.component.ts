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
  selector: '[app-modal-close] , [p-modal-close], [pModalClose]',
})
export class ModalCloseDirective {
  @Input() pModalId: string;
  constructor(private modalComp: ModalComponent) {}
  @HostListener('click', ['$event']) openModal(event): void {
    this.modalComp.closeModal(this.pModalId);
  }
}

@Component({
  selector: 'app-modal, p-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit, AfterViewInit {
  @Input() pModalShow = false;
  @Input() pModalStatic = false;
  @Input() pModalSize: string;
  @Input() pModalId: string;
  @Input() hasModalFooter = true;
  @Input() hasModalHeader = true;
  @Input() pBottomSheet = false;
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.pBottomSheet) {
      this.setModalBottomSheet(this.pModalId);
    }
    if (this.pModalStatic) {
      this.setModalStatic(this.pModalId);
    }
    if (this.pModalSize) {
      this.setModalSize();
    }
    if (this.pModalShow) {
      this.openModal(this.pModalId);
    }
  }

  private setModalSize(): void {
    const modal = document.getElementById(this.pModalId);
    switch (this.pModalSize) {
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

  private setModalStatic(id): void {
    const modal = document.getElementById(id);
    modal.classList.add('modal-static');
  }

  private setModalBottomSheet(id): void {
    const modal = document.getElementById(id);
    modal.classList.add('bottom-sheet');
  }

  public openModal(id): void {
    this.pModalShow = true;
    const modal = document.getElementById(id);
    const background = document.createElement('div');
    background.classList.add('backdrop-modal');
    const body = document.querySelector('body');
    body.insertAdjacentElement('beforeend', background);
    body.style.overflow = 'hidden';
    background.style.zIndex = '999';
    background.style.opacity = '0.5';
    modal.style.display = 'block';
    setTimeout(() => {
      if (!modal.classList.contains('bottom-sheet')) {
        modal.style.opacity = '1';
        modal.style.transform = 'translateY(-50%) translateX(-50%) scale(1)';
      } else {
        modal.style.opacity = '1';
        modal.style.transform = 'translateY(-100%) translateX(-50%) scale(1)';
      }
      if (!modal.classList.contains('modal-static')) {
        background.addEventListener('click', () => {
          this.closeModal(id);
        });
      }
    }, 10);
  }

  public closeModal(id): void {
    this.pModalShow = false;
    const modal = document.getElementById(id);
    const backdrop = document.querySelector(
      '.backdrop-modal'
    ) as HTMLDivElement;
    const body = document.querySelector('body');
    backdrop.style.opacity = '0';
    modal.style.opacity = '0';
    body.style.overflow = 'visible';
    backdrop.addEventListener('transitionend', () => {
      modal.style.display = 'none';
      if (modal.classList.contains('bottom-sheet')) {
        modal.style.transform = 'translateY(100%) translateX(-50%) scale(1)';
      } else {
        modal.style.transform = 'translateY(-50%) translateX(-50%) scale(0.9)';
      }
      backdrop.removeEventListener('click', () => {});
      backdrop.remove();
    });
  }
}
