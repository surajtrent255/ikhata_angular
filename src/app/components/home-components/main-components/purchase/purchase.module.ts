import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HttpClientModule,
  HttpClientXsrfModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseBillDetailComponent } from './purchase-bill-detail/purchase-bill-detail.component';
import { PurchaseComponent } from './purchase.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreatePurchaseBillComponent } from './create-purchase-bill/create-purchase-bill.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharablePortionModule } from 'src/app/components/sharable-portion/sharable-portion.module';
import { PurchaseReportComponent } from './purchase-report/purchase-report.component';
import { PurchaseReportDetailsComponent } from './purchase-report/purchase-report-details/purchase-report-details.component';
import { PurchaseAdditionalInfoDetailsComponent } from './purchase-additional-info-details/purchase-additional-info-details.component';
import { CreditorsComponent } from './creditors/creditors.component';
import { CreditorsDetailComponent } from './creditors/creditors-detail/creditors-detail.component';

@NgModule({
  declarations: [
    PurchaseBillDetailComponent,
    PurchaseComponent,
    CreatePurchaseBillComponent,
    PurchaseReportComponent,
    PurchaseReportDetailsComponent,
    PurchaseAdditionalInfoDetailsComponent,
    CreditorsComponent,
    CreditorsDetailComponent,
  ],

  imports: [
    CommonModule,
    PurchaseRoutingModule,
    ReactiveFormsModule,
    SharablePortionModule,
    FormsModule,
  ],
})
export class PurchaseModule {}
