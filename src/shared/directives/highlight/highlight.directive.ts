import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import * as hljs from 'highlight.js';

@Directive({
  selector: 'code[highlight], code[appHighlight]', // css selector for the attribute
})
export class HighlightCodeDirective implements AfterViewInit {
  constructor(private eltRef: ElementRef) {}

  ngAfterViewInit() {
    hljs.default.highlightBlock(this.eltRef.nativeElement);
  }
}
