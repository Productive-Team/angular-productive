import {
  Component,
  Input,
  OnInit,
  ElementRef,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-tab, p-tab',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent implements OnInit {
  @Input() pTabLabel: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const content = this.el.nativeElement.firstChild.nextSibling;
    const b = this.el.nativeElement.parentElement.parentElement.parentElement
      .parentElement.nextSibling as HTMLDivElement;
    b.insertAdjacentElement('beforeend', content);
    const allElements = document.querySelectorAll('.tab');
    allElements[0].classList.add('active');
    this.moveInkBar();
  }

  addActive(): void {
    const tab = this.el.nativeElement.firstChild as HTMLDivElement;
    const ac = document.querySelector('.tab.active');
    if (ac) {
      ac.classList.remove('active');
    }
    tab.classList.add('active');
    this.moveInkBar();
  }

  private moveInkBar(): void {
    const ink = this.el.nativeElement.parentElement.lastChild as HTMLDivElement;
    console.log(ink);
    const rect = document.querySelector('.tab.active').getBoundingClientRect();
    ink.style.width = rect.width + 'px';
    ink.style.left = rect.left - 291 + 'px';
  }
}
