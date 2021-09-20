import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-btn',
  templateUrl: './btn.component.html',
  styleUrls: ['./btn.component.css'],
})
export class BtnComponent {
  buttonClasses: ButtonDto[] = [
    {
      class: '.btn',
      description: 'Gives the default style to the button',
    },
    {
      class: '.btn-small',
      description: 'Gives the default small style to the button',
    },
    {
      class: '.btn-large',
      description: 'Gives the default large style to the button',
    },
    {
      class: '.elevation',
      description: 'Sets an elevation style to the button',
    },
    {
      class: '.fab',
      description: 'Gives the button a rounded look',
    },
    {
      class: '.flat',
      description: 'Makes the button completely flat',
    },
    {
      class: '.disabled',
      description:
        'Disables a button through styles. Made to be used with hyperlinks',
    },
    // {
    //   class: 'btn-large',
    //   description: 'Gives the default large style to the button',
    // },
  ];

  constructor() {}
}

export class ButtonDto {
  class: string;
  description: string;
}
