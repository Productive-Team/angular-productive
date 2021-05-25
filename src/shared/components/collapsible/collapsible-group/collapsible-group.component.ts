import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-collapsible-group, p-collapsible-group',
  templateUrl: './collapsible-group.component.html',
  styleUrls: ['./collapsible-group.component.css'],
})
export class CollapsibleGroupComponent implements OnInit {
  active = [];
  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event'])
  onChanges(event): void {
    setTimeout(() => {
      const allContent = this.el.nativeElement.querySelectorAll(
        '.collapsible.active'
      );
      console.log(allContent);
      if (allContent.length > 1) {
      }
    }, 250);
    // if (this.active.length > 1) {
    //   this.active[0].classList.remove('active');
    //   this.active.shift();
    // } else {
    //   this.active.push(allContent);
    // }
  }
  ngOnInit() {}
}
