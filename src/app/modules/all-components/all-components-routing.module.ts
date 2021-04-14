import { RippleExComponent } from './components/ripple-ex/ripple-ex.component';
import { ComponentsCardsComponent } from './components/components-cards/components-cards.component';
import { BtnComponent } from './components/btn/btn.component';
import { AllComponentsComponent } from './components/all-components/all-components.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridComponent } from './components/grid/grid.component';

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllComponentsRoutingModule {}
