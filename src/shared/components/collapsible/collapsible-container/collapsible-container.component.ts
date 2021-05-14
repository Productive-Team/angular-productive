import {
  Component,
  OnInit,
  Directive,
  ElementRef,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appCollapsibleTriggerDirective], [pCollapsibleTrigger]',
})
export class CollapsibleTriggerDirective {
  isOpen = false;
  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event'])
  openTrigger(event) {
    const collapse = this.el.nativeElement.nextSibling
      .firstChild as HTMLDivElement;
    const trig = this.el.nativeElement.parentElement as HTMLDivElement;
    if (!this.isOpen) {
      collapse.style.display = 'block';
      collapse.style.maxHeight = collapse.scrollHeight + 'px';
      trig.classList.add('active');
      this.isOpen = true;
    } else {
      collapse.style.maxHeight = 0 + 'px';
      this.isOpen = false;
      setTimeout(() => {
        collapse.style.display = 'none';
      }, 250);
      trig.classList.remove('active');
    }
  }
}

@Component({
  selector: 'app-collapsible-container, p-collapsible-container',
  templateUrl: './collapsible-container.component.html',
  styleUrls: ['./collapsible-container.component.css'],
})
export class CollapsibleContainerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
