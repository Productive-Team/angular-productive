import { TabsComponent } from './../tab/tabs.component';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tab-group, p-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.css'],
})
export class TabGroupComponent implements OnInit {
  @Input() pTabSelectedIndex: number;

  scrollXPos = 150;
  b: number;
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.classList.add('tab-group-container');
    this.setButtons();
  }

  setButtons(): void {
    const cont = this.el.nativeElement.firstChild.firstChild.nextSibling
      .firstChild as HTMLDivElement;
    const tranformStyle = cont.style.transform;
    const trueStyle = Number(tranformStyle.replace(/[^\d.]/g, ''));
    const buttonBack = document.getElementById('goBack');
    if (trueStyle === 0) {
      buttonBack.classList.add('disabled');
    } else if (trueStyle < 0) {
      buttonBack.classList.remove('disabled');
    }
  }

  scrollToRight(event): void {
    const el = event.target.previousElementSibling.firstChild;
    console.log(el);
  }
}
