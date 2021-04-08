import { FormsModule } from '@angular/forms';
import { SharedModule } from './../../../shared/shared.module';
import { AllComponentsComponent } from './components/all-components/all-components.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllComponentsRoutingModule } from './all-components-routing.module';

@NgModule({
  declarations: [AllComponentsComponent],
  imports: [
    CommonModule,
    AllComponentsRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class AllComponentsModule {}
