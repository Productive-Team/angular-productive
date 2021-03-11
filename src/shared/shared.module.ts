import { NavbarComponent } from './components/navbar/navbar.component';
import { RippleDirective } from './directives/ripple/ripple.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SidenavTriggerDirective,
  SidenavComponent,
} from './components/sidenav/sidenav.component';
import { CardComponent } from './components/card/card.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    RippleDirective,
    NavbarComponent,
    SidenavComponent,
    SidenavTriggerDirective,
    CardComponent,
  ],
  exports: [
    RippleDirective,
    NavbarComponent,
    SidenavComponent,
    SidenavTriggerDirective,
    CardComponent,
  ],
})
export class SharedModule {}
