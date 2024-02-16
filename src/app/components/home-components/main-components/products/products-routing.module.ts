import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetriveProductsComponent } from './retrive-products/retrive-products.component';


const routes: Routes = [
  {
    path: 'list',
    component: RetriveProductsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
