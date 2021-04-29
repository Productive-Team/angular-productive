import { TabsService } from './../../../services/tabs.service';
import { TabsComponent } from './../tab/tabs.component';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tab-group, p-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.css'],
})
export class TabGroupComponent implements OnInit {
  @Input() pTabSelectedIndex: number;

  constructor(private el: ElementRef, private tabsService: TabsService) {}

  ngOnInit() {
    this.tabsService.setTabIndex(this.pTabSelectedIndex);
    this.el.nativeElement.classList.add('tab-group-container');
    this.setButtons();
  }

  setButtons(): void {
    const cont = this.el.nativeElement.firstChild.firstChild
      .nextSibling as HTMLDivElement;
    const contTab = this.el.nativeElement.firstChild.firstChild.nextSibling
      .firstChild as HTMLDivElement;
    const backBtn = this.el.nativeElement.firstChild
      .firstChild as HTMLDivElement;
    const forwardBtn = this.el.nativeElement.firstChild.lastChild;
    if (cont.offsetWidth < contTab.offsetWidth) {
      if (cont.scrollLeft === 0) {
        backBtn.classList.add('disabled');
      } else if (cont.scrollLeft > 0) {
        backBtn.classList.remove('disabled');
      }
      if (cont.scrollLeft === cont.scrollWidth - cont.offsetWidth) {
        forwardBtn.classList.add('disabled');
      } else {
        forwardBtn.classList.remove('disabled');
      }
    } else {
      backBtn.style.display = 'none';
      forwardBtn.style.display = 'none';
    }
  }

  scroll(event): void {
    const el = this.el.nativeElement.firstChild.firstChild
      .nextSibling as HTMLDivElement;
    const button = event.target;
    const buttonBack = this.el.nativeElement.firstChild
      .firstChild as HTMLDivElement;
    console.log(buttonBack);
    const buttonForward = this.el.nativeElement.firstChild.lastChild;
    if (button.id === 'goForward') {
      el.scrollLeft += 200;
    } else if (button.id === 'goBack') {
      el.scrollLeft -= 200;
    }
    setTimeout(() => {
      if (el.scrollLeft === 0) {
        buttonBack.classList.add('disabled');
      } else if (el.scrollLeft > 0) {
        buttonBack.classList.remove('disabled');
      }
      if (el.scrollLeft === el.scrollWidth - el.offsetWidth) {
        buttonForward.classList.add('disabled');
      } else {
        buttonForward.classList.remove('disabled');
      }
    }, 300);
  }
}
