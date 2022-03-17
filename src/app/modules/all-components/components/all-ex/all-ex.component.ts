import { Snackbar } from './../../../../../shared/components/snackbar/snackbar';
import { Component, OnInit } from '@angular/core';
import { ModalComponent } from 'src/shared/components/modal/modal.component';
import { SelectData } from 'src/shared/components/select-ref/select-ref.component';

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

  selectData: SelectData[] = [];

  isLoading: boolean;

  tabAlign: string = 'left';
  inkbarAlign: string = 'bottom';
  inkbarStyle: string = 'short';
  constructor(private snackbar: Snackbar) {}

  ngOnInit(): void {
    // this.isLoading = true;
    this.selectData = [
      {
        value: null,
        label: 'Empty',
      },
      {
        value: 'value',
        label: 'Option 1',
      },
      {
        value: 'value1',
        label: 'Option 2',
      },
    ];
    // this.isLoading = false;
    // setTimeout(() => {
    //   this.value = 'value';
    // }, 2000);
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

  open() {
    this.snackbar.snackbarCustomAction = this.customAction;
    this.snackbar.openSnackbar('Hello Word', 'Action');
  }
}
