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
      trig.classList.add('active');
      collapse.style.setProperty(
        '--scrollHeight',
        collapse.scrollHeight + 'px'
      );
      this.isOpen = true;
    } else {
      collapse.style.setProperty('--scrollHeight', 0 + 'px');
      setTimeout(() => {
        trig.classList.remove('active');
        this.isOpen = false;
      }, 250);
    }
  }
}

@Component({
  selector: 'app-collapsible, p-collapsible',
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.css'],
})
export class CollapsibleComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
