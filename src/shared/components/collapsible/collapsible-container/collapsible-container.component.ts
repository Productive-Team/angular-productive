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
  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event'])
  openTrigger(event) {
    const collapse = this.el.nativeElement.parentElement.nextSibling
      .firstChild as HTMLDivElement;
    const trig = this.el.nativeElement as HTMLDivElement;
    collapse.style.display = 'block';
    trig.classList.add('active');
    console.log(event);
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
