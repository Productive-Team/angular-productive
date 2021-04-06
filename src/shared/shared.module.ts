import { SectionComponent } from './components/section/section.component';
import { RadioBtnComponent } from './components/radio-btn/radio-btn.component';
import { TooltipsDirective } from './directives/tooltips/tooltips.directive';
import { BadgesDirective } from './directives/badges/badges.directive';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RippleDirective } from './directives/ripple/ripple.directive';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import {
  DropdownComponent,
  DropdownTriggerDirective,
} from './components/dropdown/dropdown.component';
import {
  SelectComponent,
  SelectDirective,
} from './components/select/select.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
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
    DropdownComponent,
    DropdownTriggerDirective,
    BadgesDirective,
    TooltipsDirective,
    SelectDirective,
    SelectComponent,
    RadioBtnComponent,
    SectionComponent,
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
    DropdownComponent,
    DropdownTriggerDirective,
    BadgesDirective,
    TooltipsDirective,
    SelectDirective,
    SelectComponent,
    RadioBtnComponent,
    SectionComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  providers: [ModalComponent],
})
export class SharedModule {}
