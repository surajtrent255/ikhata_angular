import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SplitMergeProductRoutingModule } from './split-merge-product-routing.module';
import { CreateSplitProductComponent } from './create-split-product/create-split-product.component';
import { ListSplitProductComponent } from './list-split-product/list-split-product.component';
import { FormsModule } from '@angular/forms';
import { MergeProductComponent } from './merge-product/merge-product.component';
import { BankModule } from '../Bank/bank.module';
import { SelectProductComponent } from 'src/app/components/sharable-portion/select-product/select-product.component';
import { SharablePortionModule } from 'src/app/components/sharable-portion/sharable-portion.module';
import { NgxSmartModalComponent, NgxSmartModalModule } from 'ngx-smart-modal';


@NgModule({
  declarations: [
    CreateSplitProductComponent,
    ListSplitProductComponent,
    MergeProductComponent
  ],
  imports: [
    CommonModule,
    SplitMergeProductRoutingModule,
    FormsModule,
    BankModule,
    SharablePortionModule,
    NgxSmartModalModule
  ]
})
export class SplitMergeProductModule { }
