import { MainComponent } from './components/main/main.component';
import { ProductiveModule } from '../../../shared/productive.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, MainRoutingModule, ProductiveModule],
})
export class MainModule {}
