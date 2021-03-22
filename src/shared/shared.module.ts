import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RippleDirective } from './directives/ripple/ripple.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SidenavTriggerDirective,
  SidenavComponent,
} from './components/sidenav/sidenav.component';
import { CardComponent } from './components/card/card.component';
import {
  FieldsetComponent,
  InputDirective,
} from './components/fieldset/fieldset.component';
import {
  ModalCloseDirective,
  ModalComponent,
  ModalTriggerDirective,
} from './components/modal/modal.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    RippleDirective,
    InputDirective,
    NavbarComponent,
    SidenavComponent,
    SidenavTriggerDirective,
    CardComponent,
    FieldsetComponent,
    CheckboxComponent,
    ModalComponent,
    ModalTriggerDirective,
    ModalCloseDirective,
  ],
  exports: [
    RippleDirective,
    NavbarComponent,
    SidenavComponent,
    SidenavTriggerDirective,
    CardComponent,
    FieldsetComponent,
    InputDirective,
    CheckboxComponent,
    ModalComponent,
    ModalTriggerDirective,
    ModalCloseDirective,
  ],
  providers: [ModalComponent],
})
export class SharedModule {}
