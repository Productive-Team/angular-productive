import { TabsService } from './../../../services/tabs.service';
import {
  Component,
  Input,
  OnInit,
  ElementRef,
  HostListener,
} from '@angular/core';

const tabs = [];
@Component({
  selector: 'app-tab, p-tab',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent implements OnInit {
  @Input() pTabLabel: string;

  activeIndex: number;

  constructor(private el: ElementRef, private tabsService: TabsService) {}

  ngOnInit() {
    this.activeIndex = this.tabsService.tabIndex;
    this.insertContentAndTabs();
    this.setDeafultActive();
  }

  private insertContentAndTabs(): void {
    const content = this.el.nativeElement.firstChild.nextSibling;
    const insertTabContent = this.el.nativeElement.parentElement.parentElement
      .parentElement.parentElement.nextSibling as HTMLDivElement;
    insertTabContent.insertAdjacentElement('beforeend', content);
    const tab = this.el.nativeElement.firstChild;
    tabs.push(tab);
    content.id = 'tab-body-' + tabs.length;
    tab.id = 'tab-header-' + tabs.length;
  }

  private setDeafultActive(): void {
    const allTabs = (this.el.nativeElement
      .parentElement as HTMLDivElement).getElementsByClassName('tab');
    let activeEl;
    if (!this.activeIndex) {
      activeEl = allTabs[0];
      activeEl.classList.add('active');
    } else {
      activeEl = allTabs[this.activeIndex];
      if (activeEl) {
        activeEl.classList.add('active');
        const a =
          activeEl.parentElement.parentElement.parentElement.parentElement;
        if (activeEl.offsetLeft > a.offsetWidth) {
          this.scrollIntoViewLeft(a, activeEl.firstChild);
        }
      } else {
        activeEl = allTabs[0];
        activeEl.classList.add('active');
      }
    }
    setTimeout(() => {
      this.showContent(activeEl);
      this.moveInkBar(activeEl);
    }, 0);
  }

  private hideContent(element: Element): void {
    const elId = element.id.substr(11);
    const elContent = document.getElementById('tab-body-' + elId);
    if (elContent) {
      elContent.style.display = 'none';
    }
  }

  private showContent(element: Element): void {
    if (element.classList.contains('active')) {
      const elId = element.id.substr(11);
      const elContent = document.getElementById('tab-body-' + elId);
      if (elContent) {
        elContent.style.display = 'block';
      }
    }
  }

  addActive(event): void {
    const tab = event.target as HTMLDivElement;
    const ac = (this.el.nativeElement
      .parentElement as HTMLDivElement).querySelector('.tab.active');
    if (ac && ac !== tab) {
      ac.classList.remove('active');
      this.hideContent(ac);
    }
    tab.classList.add('active');
    this.showContent(tab);
    this.moveInkBar(tab);

    const containerIni = this.el.nativeElement.parentElement.parentElement
      .parentElement as HTMLDivElement;
    const tabRect = tab.getBoundingClientRect();
    if (
      tabRect.left + tabRect.width - containerIni.offsetWidth > 0 &&
      window.innerWidth > 300
    ) {
      this.scrollIntoViewLeft(containerIni);
    } else if (
      tabRect.right + tabRect.left + tabRect.width - containerIni.offsetWidth &&
      window.innerWidth > 300
    ) {
      this.scrollIntoViewRight(containerIni);
    }
  }

  private moveInkBar(activeElement: Element): void {
    const ink = this.el.nativeElement.parentElement.lastChild as HTMLDivElement;
    const rect = activeElement.getBoundingClientRect();
    const parent = this.el.nativeElement.parentElement.getBoundingClientRect();
    ink.style.width = rect.width + 'px';
    ink.style.left = rect.left - parent.left + 'px';
  }

  private scrollIntoViewLeft(containerEl: Element, tab?): void {
    if (tab) {
      const tabRect = tab.getBoundingClientRect();
      containerEl.scrollLeft += tabRect.left;
    } else {
      containerEl.scrollLeft += 150;
    }
    setTimeout(() => {
      this.setButtons(containerEl);
    }, 250);
  }
  private scrollIntoViewRight(containerEl: Element): void {
    containerEl.scrollLeft -= 150;
    setTimeout(() => {
      this.setButtons(containerEl);
    }, 250);
  }

  private setButtons(containerElement): void {
    const goBack = this.el.nativeElement.parentElement.parentElement
      .parentElement.parentElement.firstChild;
    const goForward = this.el.nativeElement.parentElement.parentElement
      .parentElement.parentElement.lastChild;
    if (containerElement.scrollLeft > 0) {
      goBack.classList.remove('disabled');
    } else if (containerElement.scrollLeft === 0) {
      goBack.classList.add('disabled');
    }
    if (
      containerElement.scrollLeft ===
      containerElement.scrollWidth - containerElement.offsetWidth
    ) {
      goForward.classList.add('disabled');
    } else if (
      containerElement.scrollLeft <
      containerElement.scrollWidth - containerElement.offsetWidth
    ) {
      goForward.classList.remove('disabled');
    }
  }
}
