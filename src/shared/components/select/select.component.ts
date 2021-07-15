// import {
//   AfterViewInit,
//   Component,
//   Directive,
//   ElementRef,
//   EventEmitter,
//   forwardRef,
//   HostListener,
//   Input,
//   OnInit,
//   Output,
//   ViewChild,
// } from '@angular/core';
// import { NG_VALUE_ACCESSOR } from '@angular/forms';

// @Component({
//   selector: 'app-select, p-select',
//   templateUrl: './select.component.html',
//   styleUrls: ['./select.component.css'],
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => SelectComponent),
//       multi: true,
//     },
//   ],
// })
// export class SelectComponent implements OnInit, AfterViewInit {
//   @Input() pSelectLabelText: string;
//   @Input() pSelectId: string;
//   @Input() labelIconRight: string;
//   @Input() labelIconLeft: string;
//   @Input() pSelectItems: SelectModel[];
//   @Input() pSelectAll = false;
//   @Input() pSingleSelect = true;
//   @Input() pSelectSearch = false;
//   @Input() pSelectInputType: string;
//   @Input() pSelectAllText = 'Select All';
//   @Input() pDeselectAllText = 'Deselect All';
//   @Input() pSelectSearchPlaceholder = 'Search';
//   @Input() pSelectSearchNotFoundMessage = 'Not Found';

//   @Input() value: any;
//   @Output() valueChange = new EventEmitter<SelectModel>();
//   @Output() pMultipleSelectedItem = new EventEmitter<SelectModel[]>();

//   isOpen = false;
//   allAreSelected = false;
//   filteredItems: SelectModel[];
//   filterValue: string;

//   selectedItem: any;
//   private selArr = [];
//   private selTxtArr = [];

//   @ViewChild('input') textInput: ElementRef;

//   constructor() {}

//   change = (_) => {};
//   blur = (_) => {};

//   writeValue(obj: any): void {
//     this.selectedItem = obj;
//   }

//   registerOnChange(fn: any): void {
//     this.change = fn;
//   }

//   registerOnTouched(fn: any): void {
//     this.blur = fn;
//   }

//   ngOnInit() {
//     this.filteredItems = this.pSelectItems;
//   }

//   setInputType(): void {
//     const input = document.getElementById(this.pSelectId);
//     switch (this.pSelectInputType) {
//       case 'outlined':
//         input.classList.add('outlined');
//         break;
//       case 'classic':
//         input.classList.add('classic');
//         break;
//       default:
//     }
//   }

//   ngAfterViewInit(): void {
//     this.setInputType();
//   }

//   selectAll(event): void {
//     this.allAreSelected = event;
//     this.pSelectItems.forEach((x) => {
//       x.isChecked = event;
//       setTimeout(() => {
//         const checkboxes = document.querySelectorAll('#check-' + x.id);
//         let c = 0;
//         for (; c < checkboxes.length; c++) {
//           const check = checkboxes[c] as HTMLInputElement;
//           check.checked = event;
//         }
//       }, 0);
//     });
//     this.setAllItemsAfterSelectAll(this.pSelectItems);
//   }

//   setAllItemsAfterSelectAll(item: SelectModel[]): void {
//     const input = document.querySelector(
//       '#' + this.pSelectId
//     ) as HTMLInputElement;
//     item.forEach((x) => {
//       const dupItm = this.selArr.find((y) => y === x);
//       // const dupTxt = this.selTxtArr.find((z) => z === x.option);
//       if (x.isChecked && !dupItm) {
//         this.selArr.push(x);
//         this.selTxtArr.push(x.option);
//         input.value = this.selTxtArr.join(', ');
//       } else if (!x.isChecked) {
//         this.selArr = [];
//         this.selTxtArr = [];
//         input.value = this.selTxtArr.join('');
//         // const indexDup = this.selArr.indexOf(dupItm);
//         // const indexTxt = this.selTxtArr.indexOf(dupTxt);
//         // if (indexDup === 0) {
//         //   this.selArr.splice(0, 1);
//         // } else {
//         //   this.selArr.splice(indexDup, indexDup);
//         // }
//         // if (indexTxt === 0) {
//         //   this.selTxtArr.splice(0, 1);
//         // } else {
//         //   this.selTxtArr.splice(indexTxt, indexTxt);
//         // }
//         // input.value = this.selTxtArr.join(', ');
//       }
//     });
//     this.pMultipleSelectedItem.emit(this.selArr);
//   }

//   filterInArray(value: string): void {
//     let val = '';
//     if (value !== undefined) {
//       val = value.toUpperCase();
//     }
//     if (val.length > 0) {
//       this.filteredItems = this.pSelectItems.filter((x) =>
//         x.option.toUpperCase().includes(val)
//       );
//     } else {
//       this.filteredItems = this.pSelectItems;
//     }
//     if (!this.pSingleSelect) {
//       setTimeout(() => {
//         this.selArr.forEach((x) => {
//           const checkbox = document.querySelectorAll('#check-' + x.id);
//           let cb = 0;
//           for (; cb < checkbox.length; cb++) {
//             const check = checkbox[cb] as HTMLInputElement;
//             check.checked = true;
//           }
//         });
//       }, 0);
//     }
//   }

//   // setInputValue(item: SelectModel): void {
//   //   const input = document.getElementById(this.pSelectId) as HTMLInputElement;
//   //   input.value = item.option;
//   //   this.pSingleSelectedItem.emit(item);
//   // }

//   selectOne(option: SelectModel): void {
//     option.isChecked = !option.isChecked;
//     const checkbox = document.querySelectorAll('#check-' + option.id);
//     let cb = 0;
//     for (; cb < checkbox.length; cb++) {
//       const check = checkbox[cb] as HTMLInputElement;
//       check.checked = !check.checked;
//     }
//     this.setMultipleSelectedValues(option);
//     if (this.pSelectAll) {
//       const selAllCheckbox = document.getElementById(
//         'selAll'
//       ) as HTMLInputElement;
//       const allOpt = this.pSelectItems.length;
//       const selOpt = this.selArr.length;
//       if (selOpt === 0) {
//         selAllCheckbox.checked = false;
//         selAllCheckbox.indeterminate = false;
//         this.allAreSelected = false;
//       } else if (allOpt === selOpt) {
//         selAllCheckbox.checked = true;
//         selAllCheckbox.indeterminate = false;
//         this.allAreSelected = true;
//       } else if (selOpt < allOpt) {
//         selAllCheckbox.checked = false;
//         selAllCheckbox.indeterminate = true;
//         this.allAreSelected = false;
//       }
//     }
//   }

//   setMultipleSelectedValues(item: SelectModel): void {
//     const input = document.querySelector(
//       '#' + this.pSelectId
//     ) as HTMLInputElement;
//     const dupItm = this.selArr.find((x) => x === item);
//     const dupTxt = this.selTxtArr.find((x) => x === item.option);
//     if (item.isChecked && !dupItm) {
//       this.selArr.push(item);
//       this.selTxtArr.push(item.option);
//       input.value = this.selTxtArr.join(', ');
//     } else {
//       const indexDup = this.selArr.indexOf(dupItm);
//       const indexTxt = this.selTxtArr.indexOf(dupTxt);
//       if (indexDup === 0) {
//         this.selArr.splice(0, 1);
//       } else {
//         this.selArr.splice(indexDup, indexDup);
//       }
//       if (indexTxt === 0) {
//         this.selTxtArr.splice(0, 1);
//       } else {
//         this.selTxtArr.splice(indexTxt, indexTxt);
//       }
//       input.value = this.selTxtArr.join(', ');
//     }
//     this.pMultipleSelectedItem.emit(this.selArr);
//   }

//   openMenu(): void {
//     this.isOpen = true;
//     this.setSelectBackdrop();
//   }

//   closeMenu(): any {
//     this.isOpen = false;
//     this.removeSelectBackdrop();
//   }

//   setSelectBackdrop(): void {
//     const backdrop = document.createElement('div');
//     backdrop.classList.add('backdrop');
//     backdrop.style.backgroundColor = 'rgba(0,0,0,0.8)';
//     document.body.insertAdjacentElement('beforeend', backdrop);
//     backdrop.addEventListener('click', () => {
//       this.isOpen = false;
//       this.removeSelectBackdrop();
//     });
//   }

//   removeSelectBackdrop(): void {
//     const backdrop = document.querySelector('.backdrop');
//     backdrop.remove();
//   }
// }

// @Component({
//   selector: 'app-option, p-option',
//   styleUrls: ['./select.component.css'],
//   template: ` <button
//     [value]="value"
//     class="p-select-option"
//     pRipple
//     (click)="
//       parent.pSingleSelect ? selectOne($event.target.value) : setSelect()
//     "
//   >
//     <p-checkbox
//       [pCheckboxChecked]="optionMarked"
//       style="pointer-events: none;"
//       *ngIf="!parent.pSingleSelect"
//     ></p-checkbox>
//     <ng-content></ng-content>
//   </button>`,
// })
// export class SelectOptionComponent {
//   @Input() value: any;

//   optionMarked = false;
//   constructor(public parent: SelectComponent, private el: ElementRef) {}

//   selectOne(value) {
//     const a = this.el.nativeElement as HTMLElement;
//     this.parent.textInput.nativeElement.value = a.textContent;
//     this.parent.valueChange.emit(value);
//     this.parent.change(value);
//     this.parent.closeMenu();
//   }

//   setSelect() {
//     this.optionMarked = !this.optionMarked;
//   }
// }

// export class SelectModel {
//   id: any;
//   option: any;
//   isDisabled?: boolean;
//   isChecked?: boolean;
// }
