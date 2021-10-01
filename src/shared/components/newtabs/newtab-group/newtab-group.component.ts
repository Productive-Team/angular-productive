import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-newtab-group, p-newtab-group',
  templateUrl: './newtab-group.component.html',
  styleUrls: ['./newtab-group.component.css'],
})
export class NewtabGroupComponent implements AfterContentInit {
  @Input() selectedIndex: number;
  @Output() selectedIndexChange: EventEmitter<number> =
    new EventEmitter<number>();

  @ContentChildren(forwardRef(() => NewTabComponent))
  allTabs: QueryList<NewTabComponent>;

  @ViewChild('inkBar') tabInkBar: ElementRef<HTMLElement>;
  @ViewChild('activeTabContent') activeTabContent: ElementRef<HTMLElement>;
  constructor() {}

  ngAfterContentInit() {
    setTimeout(() => {
      this.selectDefault();
    }, 0);
  }

  selectDefault(): void {
    let activeElement = this.allTabs.find((x) => x.tabActive);
    if (!activeElement) {
      activeElement = this.allTabs.first;
      if (!activeElement.disabled) {
        activeElement.tabActive = true;
      }
    }
    if (activeElement.disabled) {
      const tabsArray = this.allTabs.toArray();
      let i = 0;
      for (; i < tabsArray.length; i++) {
        if (!tabsArray[i].disabled) {
          tabsArray[i].tabActive = true;
          break;
        }
      }
    }
    this.setTabIndex();
    setTimeout(() => {
      this.setInkBar();
    }, 0);
  }

  setTabIndex(): void {
    const tabsArray = this.allTabs.toArray();
    const selectedIdx = tabsArray.findIndex((x) => x.tabActive);
    if (selectedIdx >= 0) {
      this.selectedIndex = selectedIdx;
      this.selectedIndexChange.emit(this.selectedIndex);
    }
  }

  setInkBar(): void {
    const activeElement = this.allTabs.find((x) => x.tabActive);
    const inkbar = this.tabInkBar.nativeElement;

    const activeElementRect =
      activeElement.elementRef.nativeElement.getBoundingClientRect();

    const parentElement = activeElement.elementRef.nativeElement.parentElement;
    const parentElementRect = parentElement.getBoundingClientRect();

    if (activeElement && !activeElement.disabled) {
      const width = activeElementRect.width - activeElementRect.width / 4;
      inkbar.style.width = width + 'px';
      inkbar.style.left =
        activeElementRect.left -
        parentElementRect.left +
        activeElementRect.width / 4 / 2 +
        'px';
    }
  }
}

@Component({
  selector: 'app-new-tab, p-new-tab',
  template: `
    <div
      [class]="tabActive ? 'p-tab active' : 'p-tab'"
      pRipple
      pRippleColor="var(--primaryLowOpacity)"
      (click)="selectTab()"
    >
      <p-icon>{{ tabIcon }}</p-icon>
      <span>
        {{ tabLabel }}
      </span>
    </div>
    <div class="dContents" #content>
      <ng-content></ng-content>
    </div>
  `,
})
export class NewTabComponent implements AfterContentInit {
  @Input() tabLabel: string;
  @Input() tabIcon: string;

  @Input() tabActive: boolean;
  @Input() disabled: boolean;

  @ViewChild('content') content: ElementRef<HTMLElement>;
  constructor(
    public elementRef: ElementRef<HTMLElement>,
    public tabGroup: NewtabGroupComponent
  ) {}

  ngAfterContentInit() {
    // setTimeout(() => {
    const content = this.elementRef.nativeElement.lastChild as HTMLElement;
    if (content) {
      document.body.insertAdjacentElement('beforeend', content);
    }
    // }, 0);
  }

  selectTab(): void {
    const previousActiveTab = this.tabGroup.allTabs.find((x) => x.tabActive);
    if (previousActiveTab) {
      previousActiveTab.tabActive = false;
    }
    this.tabActive = true;
    this.tabGroup.setInkBar();
    this.tabGroup.setTabIndex();
    this.setInGroup();
  }

  setInGroup(): void {
    const tabGroupContent = this.tabGroup.activeTabContent.nativeElement;
    const firstTabChild = tabGroupContent.firstChild as HTMLElement;
    if (firstTabChild && firstTabChild !== this.content.nativeElement) {
      tabGroupContent.removeChild(firstTabChild);
    }
    tabGroupContent.insertAdjacentElement(
      'beforeend',
      this.content.nativeElement
    );
  }

  @HostBinding('class.tab-disabled')
  get tabDisabled(): boolean {
    return this.disabled;
  }
}
