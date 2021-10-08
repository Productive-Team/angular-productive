import { Component, OnInit } from '@angular/core';
import { ModalComponent } from 'src/shared/components/modal/modal.component';

@Component({
  selector: 'app-all-ex',
  templateUrl: './all-ex.component.html',
  styleUrls: ['./all-ex.component.css'],
})
export class AllExComponent {
  bolltest: boolean = false;
  otherCheck: boolean = false;

  accepText = 'Please open the dialog and select an option';

  numb: number = 255;

  otherIdx: number = 4;
  constructor() {}

  accept(modalInstance: ModalComponent) {
    this.accepText = 'Yay, you accepted it!';
    modalInstance.closeModal();
  }

  refuse(modalInstance: ModalComponent) {
    this.accepText = 'Oh, you refused it...';
    modalInstance.closeModal();
  }
}
