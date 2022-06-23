import { Snackbar } from './../../../../../shared/components/snackbar/snackbar';
import { Component, OnInit } from '@angular/core';
import { ModalComponent } from 'src/shared/components/modal/modal.component';

@Component({
  selector: 'app-all-ex',
  templateUrl: './all-ex.component.html',
  styleUrls: ['./all-ex.component.css'],
})
export class AllExComponent implements OnInit {
  bolltest: boolean = false;
  otherCheck: boolean = false;

  accepText = 'Please open the dialog and select an option';
  value: string[] = ['12'];
  numb: number = 250;

  date: Date;
  date2: Date;

  otherIdx: number;
  newTabs = [
    {
      name: 'Tab 1',
      disabled: false,
      content: 'Tab content 1',
    },
  ];

  isLoading: boolean;

  val = 4;

  content = [
    { id: 1, name: 'teste' },
    { id: 2, name: 'teste 2' },
    { id: 3, name: 'teste 3' },
  ];

  tabAlign: string = 'left';
  inkbarAlign: string = 'bottom';
  inkbarStyle: string = 'short';
  constructor(private snackbar: Snackbar) {}

  ngOnInit(): void {
    this.value = ['value'];
  }

  addNew(disabled?: boolean, selectNewlyCreatedTab?: boolean): void {
    const obj = {
      name: 'New Tab',
      disabled: disabled,
      content: 'Tab content ' + (this.newTabs.length + 1),
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

  customAction = () => {
    console.log('I am an action');
  };

  insertVal(): void {
    this.value = undefined;
  }

  addContent(): void {
    const lastItm = this.content[this.content.length - 1];

    this.content.push({
      id: lastItm.id + 1,
      name: 'teste ' + (lastItm.id + 1),
    });
  }

  removeContent(): void {
    this.content.splice(this.content.length - 1, 1);
  }

  open() {
    this.snackbar.snackbarCustomAction = this.customAction;
    this.snackbar.openSnackbar('Hello Word', 'Action');
  }
}
