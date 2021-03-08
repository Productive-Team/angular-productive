import { NavbarComponent } from './components/navbar/navbar.component';
import { RippleDirective } from './directives/ripple/ripple.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@NgModule({
  imports: [CommonModule],
  declarations: [RippleDirective, NavbarComponent, SidenavComponent],
  exports: [RippleDirective, NavbarComponent, SidenavComponent],
})
export class SharedModule {}
