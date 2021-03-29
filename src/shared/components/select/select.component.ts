import { Component, Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[app-select], [p-select], [pSelect]',
})
export class SelectDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.createCustomSelect();
  }

  createCustomSelect(): void {
    const select = this.el.nativeElement as HTMLSelectElement;
    const selectOpt = document.createElement('div');
    selectOpt.classList.add('p-select', 'elevation');
    let opt = 0;
    for (; opt < select.options.length; opt++) {
      const option = document.createElement('div');
      option.classList.add('p-select-item');
      console.log(select.options[opt].value);
      option.innerHTML = select.options[opt].value;
      selectOpt.insertAdjacentElement('beforeend', option);
    }
    select.insertAdjacentElement('afterend', selectOpt);
  }
}

@Component({
  selector: 'app-select, p-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent implements OnInit {
  @Input() labelText: string;
  @Input() labelId: string;
  @Input() labelIconRight: string;
  @Input() labelIconLeft: string;
  @Input() hasHelperText = false;
  @Input() helperState: string;
  @Input() helperText: string;
  constructor() {}

  ngOnInit() {}
}
