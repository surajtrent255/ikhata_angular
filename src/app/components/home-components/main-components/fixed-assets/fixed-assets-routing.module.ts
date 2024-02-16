import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FixedAssetsComponent } from './fixed-assets.component';

const routes: Routes = [
  {
    path: '',
    component: FixedAssetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FixedAssetsRoutingModule {}
