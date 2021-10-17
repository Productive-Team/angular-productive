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

  otherIdx: number;
  newTabs = [
    {
      name: 'Tab 1',
      disabled: false,
    },
  ];
  constructor() {}

  addNew(disabled?: boolean, selectNewlyCreatedTab?: boolean): void {
    const obj = {
      name: 'Tab ' + (this.newTabs.length + 1),
      disabled: disabled,
    };
    this.newTabs.push(obj);
    if (selectNewlyCreatedTab) {
      this.otherIdx = this.newTabs.findIndex((x) => x === obj);
    }
  }

  removeNewTab(obj): void {
    const idx = this.newTabs.findIndex((x) => x === obj);
    if (this.newTabs.length > 1) {
      this.otherIdx = idx - 1;
      this.newTabs.splice(idx, 1);
    }
  }

  accept(modalInstance: ModalComponent) {
    this.accepText = 'Yay, you accepted it!';
    modalInstance.closeModal();
  }

  refuse(modalInstance: ModalComponent) {
    this.accepText = 'Oh, you refused it...';
    modalInstance.closeModal();
  }
}
