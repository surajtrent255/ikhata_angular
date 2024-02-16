import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSplitProductComponent } from './list-split-product/list-split-product.component';

const routes: Routes = [
  { path:"list", component: ListSplitProductComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SplitMergeProductRoutingModule { }
