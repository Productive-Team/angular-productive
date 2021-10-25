import { SectionCodeComponent } from './components/section/section-code/section-code.component';
import { RadioGroupComponent } from './components/radio-btn/radio-group/radio-group.component';
import {
  TableColumnComponent,
  TableComponent,
  TableExpandedRowComponent,
  TableExpandedTriggerDirective,
} from './components/table/table.component';
import { IconComponent } from './components/icon/icon.component';
import { ContainerComponent } from './components/container/container.component';
import { SidenavContentComponent } from './components/sidenav/sidenav-content/sidenav-content.component';
import { SidenavContainerComponent } from './components/sidenav/sidenav-container/sidenav-container.component';
import {
  DatepickerComponent,
  DatepickerTriggerDirective,
} from './components/datepicker/datepicker.component';
import { SliderComponent } from './components/slider/slider.component';
import { SwitchToggleComponent } from './components/switch-toggle/switch-toggle.component';
import { SectionComponent } from './components/section/section.component';
import { RadioBtnComponent } from './components/radio-btn/radio-button/radio-btn.component';
import { TooltipsDirective } from './directives/tooltips/tooltips.directive';
import { BadgesDirective } from './directives/badges/badges.directive';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RippleDirective } from './directives/ripple/ripple.directive';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav-component/sidenav.component';
import { CardComponent } from './components/card/card/card.component';
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
  MenuComponent,
  MenuTriggerDirective,
} from './components/menu/menu.component';
import { FormsModule } from '@angular/forms';
import { CollapsibleComponent } from './components/collapsible/collapsible/collapsible.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import {
  SelectComponent,
  SelectOptionComponent,
  SelectMultipleDirective,
  SelectSearchDirective,
} from './components/select/select.component';
import { CollapsibleGroupComponent } from './components/collapsible/collapsible-group/collapsible-group.component';
import { CardFooterComponent } from './components/card/card-footer/card-footer.component';
import { CardContentComponent } from './components/card/card-content/card-content.component';
import { CardHeaderComponent } from './components/card/card-header/card-header.component';
import { SectionFooterComponent } from './components/section/section-footer/section-footer.component';
import { SectionHeaderComponent } from './components/section/section-header/section-header.component';
import { SectionContentComponent } from './components/section/section-content/section-content.component';
import { ClipboardDirective } from './directives/clipboard/clipboard.directive';
import { ModalContentComponent } from './components/modal/modal-content/modal-content.component';
import { ModalFooterComponent } from './components/modal/modal-footer/modal-footer.component';
import { ModalHeaderComponent } from './components/modal/modal-header/modal-header.component';
import { SectionCodeFooterComponent } from './components/section/section-code/section-code-footer/section-code-footer.component';
import { SectionCodeHeaderComponent } from './components/section/section-code/section-code-header/section-code-header.component';
import { SectionCodeContentComponent } from './components/section/section-code/section-code-content/section-code-content.component';
import {
  TabComponent,
  TabGroupComponent,
} from './components/tabs/tabs.component';
import { HighlightCodeDirective } from './directives/highlight/highlight.directive';

const components = [
  TableComponent,
  NavbarComponent,
  SidenavComponent,
  CardComponent,
  CardHeaderComponent,
  CardContentComponent,
  CardFooterComponent,
  FieldsetComponent,
  CheckboxComponent,
  ModalComponent,
  ModalContentComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  MenuComponent,
  RadioBtnComponent,
  SectionComponent,
  SectionFooterComponent,
  SectionHeaderComponent,
  SectionCodeComponent,
  SectionContentComponent,
  SwitchToggleComponent,
  TabGroupComponent,
  TabComponent,
  SliderComponent,
  CollapsibleComponent,
  CollapsibleGroupComponent,
  DatepickerComponent,
  SidenavContainerComponent,
  SidenavContentComponent,
  ContainerComponent,
  IconComponent,
  SpinnerComponent,
  ProgressBarComponent,
  RadioGroupComponent,
  SelectComponent,
  SectionCodeContentComponent,
  SelectOptionComponent,
  SectionCodeHeaderComponent,
  SectionCodeFooterComponent,
  TableColumnComponent,
  TableExpandedRowComponent,
];
const directives = [
  RippleDirective,
  InputDirective,
  ModalTriggerDirective,
  ModalCloseDirective,
  MenuTriggerDirective,
  BadgesDirective,
  TooltipsDirective,
  DatepickerTriggerDirective,
  TableExpandedTriggerDirective,
  SelectMultipleDirective,
  SelectSearchDirective,
  HighlightCodeDirective,
  ClipboardDirective,
];

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [components, directives],
  exports: [components, directives],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  providers: [SelectComponent],
})
export class ProductiveModule {}
