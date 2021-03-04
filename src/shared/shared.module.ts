import { NavbarComponent } from './components/navbar/navbar.component';
import { RippleDirective } from './directives/ripple/ripple.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [RippleDirective, NavbarComponent],
  exports: [RippleDirective, NavbarComponent],
})
export class SharedModule {}
