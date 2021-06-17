import { ContainerComponent } from './components/container/container.component';
import { SidenavContentComponent } from './components/sidenav/sidenav-content/sidenav-content.component';
import { SidenavContainerComponent } from './components/sidenav/sidenav-container/sidenav-container.component';
import {
  DatepickerComponent,
  DatepickerTriggerDirective,
} from './components/datepicker/datepicker.component';
import { CollapsibleGroupComponent } from './components/collapsible/collapsible-group/collapsible-group.component';
import { SliderComponent } from './components/slider/slider.component';
import { ProgressIndicatorsComponent } from './components/progress-indicators/progress-indicators.component';
import { TabsService } from './services/tabs.service';
import { TabsComponent } from './components/tabs/tab/tabs.component';
import { TabGroupComponent } from './components/tabs/tab-group/tab-group.component';
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
import {
  CollapsibleComponent,
  CollapsibleTriggerDirective,
} from './components/collapsible/collapsible/collapsible.component';
import { CollapsibleContentComponent } from './components/collapsible/collapsible-content/collapsible-content.component';

const components = [
  NavbarComponent,
  SidenavComponent,
  CardComponent,
  FieldsetComponent,
  CheckboxComponent,
  ModalComponent,
  DropdownComponent,
  SelectComponent,
  RadioBtnComponent,
  SectionComponent,
  SwitchToggleComponent,
  TabGroupComponent,
  TabsComponent,
  ProgressIndicatorsComponent,
  SliderComponent,
  CollapsibleComponent,
  CollapsibleContentComponent,
  CollapsibleGroupComponent,
  DatepickerComponent,
  SidenavContainerComponent,
  SidenavContentComponent,
  ContainerComponent,
];
const directives = [
  RippleDirective,
  InputDirective,
  ModalTriggerDirective,
  ModalCloseDirective,
  DropdownTriggerDirective,
  BadgesDirective,
  TooltipsDirective,
  SelectDirective,
  CollapsibleTriggerDirective,
  DatepickerTriggerDirective,
];

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [components, directives],
  exports: [components, directives],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  providers: [SidenavComponent, DropdownComponent, TabsService],
})
export class SharedModule {}
