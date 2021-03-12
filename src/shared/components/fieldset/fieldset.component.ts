import { Component, Input, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'p-fieldset',
  templateUrl: './fieldset.component.html',
  styleUrls: ['./fieldset.component.css'],
})
export class FieldsetComponent implements OnInit {
  @Input() labelText: string;
  @Input() labelIcon: string;
  // @Input() labelId: string;
  @Input() trailingButton = false;

  labelId: string;
  constructor() {}

  ngOnInit(): void {
    this.setLabelId();
  }

  setLabelId(): void {
    const parent = document.querySelector('.fieldset');
    const inputs = parent.getElementsByTagName('input');
    let i = 0;
    for (; i < inputs.length; i++) {
      this.labelId = inputs[i].id;
    }
  }
}
