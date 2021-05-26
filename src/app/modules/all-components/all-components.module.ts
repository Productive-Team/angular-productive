import { CheckboxExComponent } from './components/checkbox-ex/checkbox-ex.component';
import { ContainerExComponent } from './components/container-ex/container-ex.component';
import { DropdownExComponent } from './components/dropdown-ex/dropdown-ex.component';
import { RippleExComponent } from './components/ripple-ex/ripple-ex.component';
import { ComponentsCardsComponent } from './components/components-cards/components-cards.component';
import { BtnComponent } from './components/btn/btn.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './../../../shared/shared.module';
import { AllComponentsComponent } from './components/all-components/all-components.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllComponentsRoutingModule } from './all-components-routing.module';
import { GridComponent } from './components/grid/grid.component';

@NgModule({
  declarations: [
    AllComponentsComponent,
    BtnComponent,
    ComponentsCardsComponent,
    GridComponent,
    RippleExComponent,
    DropdownExComponent,
    ContainerExComponent,
    CheckboxExComponent,
  ],
  imports: [
    CommonModule,
    AllComponentsRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class AllComponentsModule {}
