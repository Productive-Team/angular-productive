import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TabsService {
  tabIndex: number;
  constructor() {}
  setTabIndex(index): void {
    this.tabIndex = index;
  }
}
