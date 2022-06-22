import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-section-code-content, p-section-code-content',
  template: `
    <code [class]="'language-' + language">
      <ng-content></ng-content>
    </code>
  `,
})
export class SectionCodeContentComponent {
  @Input() language: ProgrammingLanguages;
  constructor() {}

  @HostBinding('class.p-section-code')
  get DefaultClass() {
    return true;
  }
}

type ProgrammingLanguages = 'html' | 'css' | 'type';
