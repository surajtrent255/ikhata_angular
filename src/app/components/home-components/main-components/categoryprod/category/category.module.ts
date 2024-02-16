import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryprodComponent } from '../categoryprod.component';
import { SelectCategoryComponent } from '../select-category/select-category.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { FormsModule } from '@angular/forms';
import { NgxSmartModalComponent, NgxSmartModalModule } from 'ngx-smart-modal';


@NgModule({
  declarations: [
    CategoryprodComponent,
    SelectCategoryComponent,
    CreateCategoryComponent,
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    FormsModule,
    NgxSmartModalModule
  ],
  exports: [
    SelectCategoryComponent,
  ]
})
export class CategoryModule { }
