import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/main/main.module').then((e) => e.MainModule),
  },
  // {
  //   path: '',
  //   redirectTo: '/Components',
  //   pathMatch: 'full',
  // },
  // {
  //   path: 'Components',
  //   component: AllComponentsComponent,
  // },
  // {
  //   path: 'Button',
  //   component: BtnComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
