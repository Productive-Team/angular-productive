import { BtnComponent } from './btn/btn.component';
import { AllComponentsComponent } from './all-components/all-components.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AllComponentsComponent,
  },
  // {
  //   path: '',
  //   component: BtnComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
