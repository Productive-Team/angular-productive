import { Component, Input, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-card, p-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() elevated = true;
  @Input() hasHeader = true;
  @Input() hasFooter = false;
  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (this.elevated) {
      this.elevateCard();
    }
  }
  elevateCard(): void {
    const card = this.el.nativeElement.firstChild;
    card.classList.add('elevation');
  }
}
