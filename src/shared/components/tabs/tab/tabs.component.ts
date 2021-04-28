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
  @Input() pTabActive: boolean;

  tabIndex: number;

  offsetLeft: number;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const content = this.el.nativeElement.firstChild.nextSibling;
    const insertTabContent = this.el.nativeElement.parentElement.parentElement
      .parentElement.parentElement.nextSibling as HTMLDivElement;
    insertTabContent.insertAdjacentElement('beforeend', content);
    const el = this.el.nativeElement.parentElement.childNodes;
    const tab = this.el.nativeElement.firstChild;
    tabs.push(tab);
    let i;
    if (this.pTabActive) {
      i = tabs.indexOf(this.el.nativeElement.firstChild);
      this.el.nativeElement.classList.add('tab-active');
      el[i].firstChild.classList.add('active');
    } else {
      el[0].firstChild.classList.add('active');
    }
    content.id = 'tab-body-' + tabs.length;
    tab.id = 'tab-header-' + tabs.length;
    const tabac = document.querySelectorAll('.tab.active');
    if (tabac.length > 1) {
      tabac[0].classList.remove('active');
    }
    setTimeout(() => {
      let elid;
      elid = this.el.nativeElement.parentElement.getElementsByClassName(
        'tab-active'
      );
      elid = elid[0].firstChild.id.substr(11);
      console.log(elid);
      const contentel = document.getElementById('tab-body-' + elid);
      contentel.style.display = 'block';
      this.moveInkBar();
    }, 0);

    this.offsetLeft = 250;
  }

  addActive(): void {
    const tab = this.el.nativeElement.firstChild as HTMLDivElement;
    const ac = document.querySelector('.tab.active');
    if (ac) {
      ac.classList.remove('active');
      const acId = ac.id.substr(11);
      const acContent = document.getElementById('tab-body-' + acId);
      acContent.style.display = 'none';
    }
    tab.classList.add('active');
    const id2 = tab.id.substr(11);
    const content = document.getElementById('tab-body-' + id2);
    content.style.display = 'block';
    this.moveInkBar();
    this.scrollIntoView();
  }

  private moveInkBar(): void {
    const ink = this.el.nativeElement.parentElement.lastChild as HTMLDivElement;
    const rect = document.querySelector('.tab.active').getBoundingClientRect();
    const parent = document
      .querySelector('.tab.active')
      .parentElement.parentElement.getBoundingClientRect();
    ink.style.width = rect.width + 'px';
    ink.style.left = rect.left - parent.left + 'px';
  }

  private scrollIntoView(): void {
    const tab = document.querySelector('.tab.active') as HTMLDivElement;
    const tab2 = tab.getBoundingClientRect();
    const container = tab.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
    const container2 = tab.parentElement.parentElement.parentElement;
    const container3 = tab.parentElement.parentElement;
    const total = tab2.left - container.left + tab2.width;
    if (total > container.width) {
      if (container2.style.transform === 'translateX(0)') {
        container2.style.transform = `translateX(-${this.offsetLeft}px)`;
      } else {
        this.offsetLeft = this.offsetLeft + tab2.width;
        container2.style.transform = `translateX(-${this.offsetLeft}px)`;
      }
    } else if (total <= 150) {
      const tot = tab2.width + 150;
      if (tot < 0) {
        container2.style.transform = `translateX(-${tot}px)`;
      } else if (tot > 0) {
        container2.style.transform = `translateX(-${0}px)`;
      }
    }
  }
}
