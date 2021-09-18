import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-btn',
  templateUrl: './btn.component.html',
  styleUrls: ['./btn.component.css'],
})
export class BtnComponent {
  buttonClasses: ButtonDto[] = [
    {
      class: 'btn',
      description: 'Gives the default style to the button',
      active: true,
    },
    {
      class: 'btn-small',
      description: 'Gives the default small style to the button',
      active: true,
    },
    {
      class: 'btn-large',
      description: 'Gives the default large style to the button',
      active: true,
    },
  ];

  constructor() {}
}

export class ButtonDto {
  class: string;
  description: string;
  active: boolean;
}
