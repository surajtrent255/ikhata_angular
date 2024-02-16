import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryprodComponent } from '../categoryprod.component';

const routes: Routes = [
  {
    path: 'list',
    component: CategoryprodComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
