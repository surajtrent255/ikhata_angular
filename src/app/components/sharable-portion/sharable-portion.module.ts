import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharablePortionRoutingModule } from './sharable-portion-routing.module';
import { ConfirmAlertComponent } from './confirm-alert/confirm-alert.component';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectCustomerComponent } from './select-customer/select-customer.component';
import { SelectProductComponent } from './select-product/select-product.component';
import { CreateProductComponent } from '../home-components/main-components/products/create-product/create-product.component';
import { CategoryModule } from '../home-components/main-components/categoryprod/category/category.module';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SearchComponent } from '../home-components/main-components/search/search.component';

@NgModule({
  declarations: [
    ConfirmAlertComponent,
    CreateCustomerComponent,
    SelectCustomerComponent,
    SelectProductComponent,
    CreateProductComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    SharablePortionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CategoryModule,
    NgxSmartModalModule.forRoot(),
    DragDropModule,
  ],
  exports: [
    ConfirmAlertComponent,
    CreateCustomerComponent,
    SelectCustomerComponent,
    SelectProductComponent,
    CreateProductComponent,
    NgxSmartModalModule,
    SearchComponent,
  ],
})
export class SharablePortionModule {}
