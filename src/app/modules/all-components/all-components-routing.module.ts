import { CheckboxComponent } from './../../../shared/components/checkbox/checkbox.component';
import { ContainerExComponent } from './components/container-ex/container-ex.component';
import { DropdownExComponent } from './components/dropdown-ex/dropdown-ex.component';
import { RippleExComponent } from './components/ripple-ex/ripple-ex.component';
import { ComponentsCardsComponent } from './components/components-cards/components-cards.component';
import { BtnComponent } from './components/btn/btn.component';
import { AllComponentsComponent } from './components/all-components/all-components.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridComponent } from './components/grid/grid.component';
import { CheckboxExComponent } from './components/checkbox-ex/checkbox-ex.component';
import { AllExComponent } from './components/all-ex/all-ex.component';

const routes: Routes = [
  {
    path: '',
    component: AllComponentsComponent,
    children: [
      {
        path: '',
        component: ComponentsCardsComponent,
      },
      {
        path: 'Buttons',
        component: BtnComponent,
      },
      {
        path: 'Grid',
        component: GridComponent,
      },
      {
        path: 'Ripple',
        component: RippleExComponent,
      },
      {
        path: 'Menu',
        component: DropdownExComponent,
      },
      {
        path: 'Containers',
        component: ContainerExComponent,
      },
      {
        path: 'Checkbox',
        component: CheckboxExComponent,
      },
      {
        path: 'AllEx',
        component: AllExComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllComponentsRoutingModule {}
