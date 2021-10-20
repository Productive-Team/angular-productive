import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-newtab-group, p-newtab-group',
  templateUrl: './newtab-group.component.html',
  styleUrls: ['./newtab-group.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class NewtabGroupComponent implements AfterContentInit, OnChanges {
  @Input() selectedIndex: number;

  @Output() selectedIndexChange: EventEmitter<number> =
    new EventEmitter<number>();

  @Input() inkbarAlignment: InkbarDirection = 'bottom';
  @Input() tabAlignment: TabAlignmnet = 'left';

  @ContentChildren(forwardRef(() => NewTabComponent))
  allTabs: QueryList<NewTabComponent>;

  @ContentChildren(forwardRef(() => NewtabGroupComponent), {
    descendants: true,
  })
  tabGroups: QueryList<NewtabGroupComponent>;

  @ViewChild('inkBar') tabInkBar: ElementRef<HTMLElement>;
  @ViewChild('tabContent') tabContent: ElementRef<HTMLElement>;
  @ViewChild('tabListContainer') tabListContainer: ElementRef<HTMLElement>;
  @ViewChild('tabList') tabList: ElementRef<HTMLElement>;

  tabContentsInPage: HTMLElement[] = [];

  showButtons: boolean = false;

  scrollPosition: number = 0;
  maxScrollPosition: number;
  minScrollPosition: number = 0;

  constructor(private elementRef: ElementRef) {}

  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {
    this.showButtons = this.isOverflowing();
    this.correctScroll();
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this.selectDefault();
    }, 0);
  }

  selectDefault(): void {
    let activeElement = this.allTabs.find((x) => x.active);
    if (!activeElement) {
      if (this.selectedIndex >= 0) {
        activeElement = this.allTabs.toArray()[this.selectedIndex];
      } else {
        activeElement = this.allTabs.first;
      }
      if (!activeElement.disabled) {
        activeElement.selectTab();
      }
    }
    if (activeElement.disabled) {
      const tabsArray = this.allTabs.toArray();
      let i = 0;
      for (; i < tabsArray.length; i++) {
        if (!tabsArray[i].disabled) {
          activeElement = tabsArray[i];
          activeElement.selectTab();
          break;
        }
      }
    }
    this.setTabIndex();
  }

  setTabIndex(): void {
    const tabsArray = this.allTabs.toArray();
    const selectedIdx = tabsArray.findIndex((x) => x.active);
    if (selectedIdx >= 0) {
      this.selectedIndex = selectedIdx;
      this.selectedIndexChange.emit(this.selectedIndex);
    }
  }

  setInkBar(): void {
    const activeElement = this.allTabs.find((x) => x.active);
    const inkbar = this.tabInkBar.nativeElement;

    const activeElementRect = (
      activeElement?.elementRef.nativeElement.firstChild
        .firstChild as HTMLElement
    )?.getBoundingClientRect();

    const parentElement = activeElement?.elementRef.nativeElement.parentElement;
    const parentElementRect = parentElement?.getBoundingClientRect();

    if (activeElement && !activeElement.disabled) {
      inkbar.style.width = activeElementRect.width + 'px';
      inkbar.style.left =
        activeElementRect.left - parentElementRect.left + 'px';
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

  isOverflowing(): boolean {
    let result: boolean;
    const tabsContainer = this.tabListContainer.nativeElement;
    const tabsList = tabsContainer.firstChild as HTMLElement;
    if (tabsContainer) {
      const fullDifference = tabsList.offsetWidth - tabsContainer.offsetWidth;
      if (fullDifference < 0) {
        result = false;
        this.maxScrollPosition = fullDifference;
        setTimeout(() => {
          this.scrollPosition = 0;
        }, 0);
      } else {
        result = true;
        setTimeout(() => {
          this.maxScrollPosition =
            tabsList.offsetWidth - tabsContainer.offsetWidth;
        }, 0);
      }
    }
    return result;
  }

  @HostBinding('class.group-tab')
  get DefaultClass(): boolean {
    return true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.selectedIndex?.isFirstChange()) {
      setTimeout(() => {
        const array = this.allTabs.toArray();
        if (this.selectedIndex >= 0) {
          const tab = array[this.selectedIndex];
          if (!tab.disabled && !tab.active) {
            array[this.selectedIndex].selectTab();
          } else {
            this.selectDefault();
          }
        }
      }, 0);
    }
  }

  scrollLeft(): void {
    this.scrollPosition -= 250;
    if (this.scrollPosition < this.minScrollPosition) {
      this.scrollPosition = 0;
    }
  }

  scrollRight(): void {
    this.scrollPosition += 250;
    if (this.scrollPosition >= this.maxScrollPosition) {
      this.scrollPosition =
        this.scrollPosition - (this.scrollPosition - this.maxScrollPosition);
    }
  }

  // TODO: NEEDS TO FIX SCROLL POSITION ON WINDOW RESIZING, AND WHEN TAB IS DELETED
  // TODO: NEEDS TO FIX SCROLL FOR CENTER AND RIGHT TAB ALIGNMENT OPTIONS

  correctScroll(): void {
    if (this.scrollPosition > this.maxScrollPosition) {
      this.scrollPosition = this.maxScrollPosition;
    }
  }

  scrollTabIntoView(tabElement: HTMLElement): void {
    const tabsContainer = this.tabListContainer.nativeElement;

    const tabElementRect = tabElement.getBoundingClientRect();
    const tabsContainerRect = tabsContainer.getBoundingClientRect();

    const tabElementOffsetLeft =
      tabElementRect.left + tabElement.offsetWidth - tabsContainerRect.left;

    if (tabsContainer.offsetWidth < tabElementOffsetLeft) {
      this.scrollPosition += tabElement.offsetWidth;
      if (this.scrollPosition >= this.maxScrollPosition) {
        this.scrollPosition =
          this.scrollPosition - (this.scrollPosition - this.maxScrollPosition);
      }
    } else if (tabElement.offsetWidth >= tabElementOffsetLeft) {
      this.scrollPosition -= tabElement.offsetWidth;
      if (this.scrollPosition <= this.minScrollPosition) {
        this.scrollPosition = 0;
      }
    }
  }
}

@Component({
  selector: 'app-new-tab, p-new-tab',
  template: `
    <div
      [class]="active ? 'p-tab active' : 'p-tab'"
      [id]="'tab-head-' + uniqueId"
      pRipple
      pRippleColor="var(--primaryLowOpacity)"
      (click)="selectTab()"
    >
      <div class="dFlex fDirectionColumn tab-header-label">
        <p-icon>{{ icon }}</p-icon>
        <span>
          {{ label }}
        </span>
      </div>
    </div>
    <div #content hidden [id]="'tab-content-' + uniqueId">
      <div class="dContents">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class NewTabComponent implements AfterContentInit, OnDestroy {
  @Input() label: string;
  @Input() icon: string;

  @Input() active: boolean;
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
      this.tabGroup.generateUniqueIds();
      this.tabGroup.showButtons = this.tabGroup.isOverflowing();
    }, 0);
  }

  selectTab(): void {
    setTimeout(() => {
      const previousActiveTab = this.tabGroup.allTabs.find((x) => x.active);
      if (previousActiveTab) {
        previousActiveTab.active = false;
        previousActiveTab.content.nativeElement.hidden = true;
      }
      const content = document.getElementById('tab-content-' + this.uniqueId);
      if (content) {
        this.active = true;
        this.tabGroup.setInkBar();
        this.tabGroup.setTabIndex();
        content.hidden = false;
        this.tabGroup.scrollTabIntoView(this.elementRef.nativeElement);
        const tabGroupChild = this.tabGroup.tabGroups.toArray();
        if (tabGroupChild.length > 0) {
          tabGroupChild.forEach((x) => {
            const inkbarWidth = x.tabInkBar.nativeElement.offsetWidth;
            if (inkbarWidth === 0) {
              x.setInkBar();
            }
          });
        }
      }
    }, 0);
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

  ngOnDestroy() {
    const content = document.getElementById('tab-content-' + this.uniqueId);
    if (content) {
      content.remove();
      this.active = false;
      this.tabGroup.scrollPosition -= this.elementRef.nativeElement.offsetWidth;
      setTimeout(() => {
        this.tabGroup.selectDefault();
        this.tabGroup.setInkBar();
        this.tabGroup.showButtons = this.tabGroup.isOverflowing();
      }, 0);
    }
  }

  @HostBinding('class.tab-disabled')
  get tabDisabled(): boolean {
    return this.disabled;
  }
}

type InkbarDirection = 'top' | 'bottom';
type TabAlignmnet = 'left' | 'center' | 'right';
