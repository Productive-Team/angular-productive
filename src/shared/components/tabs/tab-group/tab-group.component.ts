import { TabsService } from './../../../services/tabs.service';
import { TabsComponent } from './../tab/tabs.component';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-tab-group, p-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.css'],
})
export class TabGroupComponent implements AfterViewInit, OnChanges {
  @Input() pTabSelectedIndex: number;

  @ViewChild('backButton') backButton: ElementRef;
  @ViewChild('forwardButton') forwardButton: ElementRef;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  @ViewChild('tabsContainer') tabsContainer: ElementRef;

  constructor(private el: ElementRef, private tabsService: TabsService) {}

  ngAfterViewInit() {
    this.setButtons();
  }

  setButtons(): void {
    const containerElement = this.scrollContainer
      .nativeElement as HTMLDivElement;
    const containerTabs = this.tabsContainer.nativeElement as HTMLDivElement;
    const backBtn = this.backButton.nativeElement as HTMLElement;
    const forwardBtn = this.forwardButton.nativeElement as HTMLElement;
    if (containerElement.offsetWidth < containerTabs.offsetWidth) {
      if (containerElement.scrollLeft === 0) {
        backBtn.setAttribute('disabled', 'disabled');
      } else if (containerElement.scrollLeft > 0) {
        backBtn.removeAttribute('disabled');
      }
      if (
        containerElement.scrollLeft ===
        containerElement.scrollWidth - containerElement.offsetWidth
      ) {
        forwardBtn.setAttribute('disabled', 'disabled');
      } else {
        forwardBtn.removeAttribute('disabled');
      }
    } else {
      backBtn.style.display = 'none';
      forwardBtn.style.display = 'none';
    }
  }

  scrollBackward(event): void {
    const containerScrollable = this.scrollContainer
      .nativeElement as HTMLElement;
    const button = event.target as HTMLButtonElement;
    containerScrollable.scrollLeft -= 200;
    if (containerScrollable.scrollLeft === 0) {
      button.setAttribute('disabled', 'disabled');
    }
  }

  scrollForward(event): void {
    const containerScrollable = this.scrollContainer
      .nativeElement as HTMLElement;
    const button = event.target as HTMLButtonElement;
    containerScrollable.scrollLeft += 200;
    if (
      containerScrollable.scrollLeft ===
      containerScrollable.scrollWidth - containerScrollable.offsetWidth
    ) {
      button.setAttribute('disabled', 'disabled');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pTabSelectedIndex !== undefined) {
      this.tabsService.setTabIndex(this.pTabSelectedIndex);
    }
  }

  @HostBinding('class.tab-group-container')
  get DefaultClass() {
    return true;
  }
}
