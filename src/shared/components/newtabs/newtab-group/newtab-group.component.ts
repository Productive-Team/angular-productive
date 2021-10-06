import {
  AfterContentInit,
  AfterViewInit,
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
  @ViewChild('tabContent') tabContent: ElementRef<HTMLElement>;

  tabContentsInPage: HTMLElement[] = [];

  constructor(private elementRef: ElementRef) {}

  ngAfterContentInit() {
    setTimeout(() => {
      this.generateUniqueIds();
      this.selectDefault();
    }, 0);
  }

  selectDefault(): void {
    let activeElement = this.allTabs.find((x) => x.tabActive);
    if (!activeElement) {
      if (this.selectedIndex) {
        activeElement = this.allTabs.toArray()[this.selectedIndex];
      } else {
        activeElement = this.allTabs.first;
      }
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

  generateUniqueIds(): void {
    const tabGroups = document.querySelectorAll('.group-tab');
    tabGroups.forEach((x) => {
      this.tabContentsInPage.push(x as HTMLElement);
    });

    const tabIndex = this.tabContentsInPage.findIndex(
      (x) => x === (this.elementRef.nativeElement as HTMLElement)
    );
    const tabs = this.allTabs.toArray();
    let i = 0;
    for (; i < tabs.length; i++) {
      tabs[i].uniqueId = `${tabIndex}-${i}`;
    }
  }

  @HostBinding('class.group-tab')
  get DefaultClass() {
    return true;
  }
}

@Component({
  selector: 'app-new-tab, p-new-tab',
  template: `
    <div
      [class]="tabActive ? 'p-tab active' : 'p-tab'"
      [id]="'tab-head-' + uniqueId"
      pRipple
      pRippleColor="var(--primaryLowOpacity)"
      (click)="selectTab()"
    >
      <p-icon>{{ tabIcon }}</p-icon>
      <span>
        {{ tabLabel }}
      </span>
    </div>
    <div #content hidden [id]="'tab-content-' + uniqueId">
      <div class="dContents">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class NewTabComponent implements AfterContentInit {
  @Input() tabLabel: string;
  @Input() tabIcon: string;

  @Input() tabActive: boolean;
  @Input() disabled: boolean;

  @ViewChild('content') content: ElementRef<HTMLElement>;

  previousTab: NewTabComponent;

  uniqueId: string;

  constructor(
    public elementRef: ElementRef<HTMLElement>,
    public tabGroup: NewtabGroupComponent
  ) {}

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.setInBody();
    }, 0);
  }

  selectTab(): void {
    const previousActiveTab = this.tabGroup.allTabs.find((x) => x.tabActive);
    if (previousActiveTab) {
      previousActiveTab.tabActive = false;
      previousActiveTab.content.nativeElement.hidden = true;
    }
    const content = document.getElementById('tab-content-' + this.uniqueId);
    this.tabActive = true;
    this.tabGroup.setInkBar();
    this.tabGroup.setTabIndex();
    content.hidden = false;
  }

  setInGroup(): void {
    const tabGroupContent = this.tabGroup.tabContent.nativeElement;
    const content = this.content.nativeElement.firstChild as HTMLElement;
    tabGroupContent.insertAdjacentElement('beforeend', content);
  }

  setInBody(): void {
    const elementRef = this.elementRef.nativeElement as HTMLElement;
    const content = elementRef.lastChild as HTMLElement;
    const contentContainer = this.tabGroup.tabContent;
    if (contentContainer) {
      contentContainer.nativeElement.insertAdjacentElement(
        'beforeend',
        content
      );
    }
  }

  @HostBinding('class.tab-disabled')
  get tabDisabled(): boolean {
    return this.disabled;
  }
}
