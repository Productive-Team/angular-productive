import {
  Component,
  Input,
  OnInit,
  ElementRef,
  HostBinding,
} from '@angular/core';

@Component({
  selector: 'app-card, p-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() elevated = true;
  constructor() {}

  @HostBinding('class.card')
  get DefaultClasses(): boolean {
    return true;
  }

  @HostBinding('class.elevation-p1')
  get Elevated(): boolean {
    return this.elevated;
  }
}
