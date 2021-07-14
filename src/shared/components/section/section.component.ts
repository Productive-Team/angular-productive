import { Component, Input, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-section, p-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
})
export class SectionComponent implements OnInit {
  @Input() pSectionHeader: string;
  @Input() pSectionHeaderIcon: string;
  @Input() pSectionBtnYPosition: string;
  @Input() pSectionBtnXPosition: string;
  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.setPosition();
  }

  private setPosition(): void {
    const sections = this.el.nativeElement;
    const child = sections.firstChild.firstChild as HTMLDivElement;
    switch (this.pSectionBtnYPosition) {
      case 'top':
        child.classList.add('top-align');
        break;
      case 'bottom':
        child.classList.add('bottom-align');
        break;
      case 'above':
        child.classList.add('top-align');
        break;
      case 'bellow':
        child.classList.add('bottom-align');
        break;
      default:
        child.classList.add('top-align');
    }
    switch (this.pSectionBtnXPosition) {
      case 'left':
        child.classList.add('left-align');
        break;
      case 'right':
        child.classList.add('right-align');
        break;
      case 'before':
        child.classList.add('left-align');
        break;
      case 'after':
        child.classList.add('right-align');
        break;
      default:
        child.classList.add('right-align');
    }
  }
}
