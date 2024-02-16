import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { RetriveProductsComponent } from './retrive-products/retrive-products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { FormsModule } from '@angular/forms';
import { CategoryModule } from '../categoryprod/category/category.module';
import { AppModule } from 'src/app/app.module';
import { SharablePortionModule } from 'src/app/components/sharable-portion/sharable-portion.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    RetriveProductsComponent,
    // CreateProductComponent,
    EditProductComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FormsModule,
    SharablePortionModule,
    DragDropModule,
    CategoryModule
  ],
  exports: [
    //  CreateProductComponent
  ],
})
export class ProductsModule {}
