import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardContentComponent } from './components/card/card-content/card-content.component';
import { CardFooterComponent } from './components/card/card-footer/card-footer.component';
import { CardHeaderComponent } from './components/card/card-header/card-header.component';
import { CardComponent } from './components/card/card/card.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { CollapsibleGroupComponent } from './components/collapsible/collapsible-group/collapsible-group.component';
import { CollapsibleComponent } from './components/collapsible/collapsible/collapsible.component';
import {
  SelectComponent,
  SelectOptionComponent,
} from './components/select/select.component';
import { ContainerComponent } from './components/container/container.component';
import {
  DatepickerComponent,
  DatepickerTriggerDirective,
} from './components/datepicker/datepicker.component';
import {
  FieldsetComponent,
  InputDirective,
} from './components/fieldset/fieldset.component';
import {
  MenuComponent,
  MenuTriggerDirective,
} from './components/menu/menu.component';
import { ModalContentComponent } from './components/modal/modal-content/modal-content.component';
import { ModalFooterComponent } from './components/modal/modal-footer/modal-footer.component';
import { ModalHeaderComponent } from './components/modal/modal-header/modal-header.component';
import {
  ModalCloseDirective,
  ModalComponent,
  ModalTriggerDirective,
} from './components/modal/modal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { RadioBtnComponent } from './components/radio-btn/radio-button/radio-btn.component';
import { RadioGroupComponent } from './components/radio-btn/radio-group/radio-group.component';
import { SectionCodeContentComponent } from './components/section/section-code/section-code-content/section-code-content.component';
import { SectionCodeFooterComponent } from './components/section/section-code/section-code-footer/section-code-footer.component';
import { SectionCodeHeaderComponent } from './components/section/section-code/section-code-header/section-code-header.component';
import { SectionCodeComponent } from './components/section/section-code/section-code.component';
import { SectionContentComponent } from './components/section/section-content/section-content.component';
import { SectionFooterComponent } from './components/section/section-footer/section-footer.component';
import { SectionHeaderComponent } from './components/section/section-header/section-header.component';
import { SectionComponent } from './components/section/section.component';
import { SidenavComponent } from './components/sidenav/sidenav-component/sidenav.component';
import { SidenavContainerComponent } from './components/sidenav/sidenav-container/sidenav-container.component';
import { SidenavContentComponent } from './components/sidenav/sidenav-content/sidenav-content.component';
import { SliderComponent } from './components/slider/slider.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SwitchToggleComponent } from './components/switch-toggle/switch-toggle.component';
import {
  TableCellTemplateDirective,
  TableColumnComponent,
  TableComponent,
  TableExpandedRowComponent,
  TableExpandedTriggerDirective,
  TableHeaderTemplateDirective,
} from './components/table/table.component';
import {
  TabComponent,
  TabGroupComponent,
} from './components/tabs/tabs.component';
import { BadgesDirective } from './directives/badges/badges.directive';
import { ClipboardDirective } from './directives/clipboard/clipboard.directive';
import { HighlightCodeDirective } from './directives/highlight/highlight.directive';
import { RippleDirective } from './directives/ripple/ripple.directive';
import { TooltipsDirective } from './directives/tooltips/tooltips.directive';

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
  HighlightCodeDirective,
  ClipboardDirective,
  TableCellTemplateDirective,
  TableHeaderTemplateDirective,
];

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [components, directives],
  exports: [components, directives],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductiveModule {}
