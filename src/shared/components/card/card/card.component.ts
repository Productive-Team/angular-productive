import { Component, Input, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-card, p-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() elevated = true;
  @Input() width: number;
  @Input() height: number;
  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (this.elevated) {
      this.elevateCard();
    }
    this.setWidthHeight(this.width, this.height);
  }
  private elevateCard(): void {
    const card = this.el.nativeElement.firstChild;
    card.classList.add('elevation-p1');
  }

  private setWidthHeight(width?: number, height?: number): void {
    const card = this.el.nativeElement.firstChild as HTMLDivElement;
    if (width > 0) {
      card.style.width = width + 'px';
    }
    if (height > 0) {
      card.style.height = height + 'px';
    }
  }
}
