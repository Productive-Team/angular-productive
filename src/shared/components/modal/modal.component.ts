import {
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
  constructor(private modalComp: ModalComponent) {}
  @HostListener('click', ['$event']) openModal(event): void {
    this.modalComp.openModal();
  }
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  @Input() modalShow = false;
  @Input() modalId: string;
  constructor() {}

  ngOnInit(): void {}

  public openModal(): void {
    this.modalShow = true;
  }
}
