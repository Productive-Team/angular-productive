import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() elevated = true;
  @Input() hasHeader = true;
  @Input() hasFooter = false;
  constructor() {}

  ngOnInit(): void {
    if (this.elevated) {
      this.elevateCard();
    }
  }
  elevateCard(): void {
    const card = document.querySelectorAll('.card');
    card.forEach((x) => {
      x.classList.add('elevation');
    });
  }
}
