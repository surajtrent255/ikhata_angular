import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseComponent } from './purchase.component';
import { PurchaseBillDetailComponent } from './purchase-bill-detail/purchase-bill-detail.component';
import { CreatePurchaseBillComponent } from './create-purchase-bill/create-purchase-bill.component';
import { PurchaseReportComponent } from './purchase-report/purchase-report.component';
import { PurchaseReportDetailsComponent } from './purchase-report/purchase-report-details/purchase-report-details.component';
import { PurchaseAdditionalInfoDetailsComponent } from './purchase-additional-info-details/purchase-additional-info-details.component';
import { CreditorsComponent } from './creditors/creditors.component';
import { CreditorsDetailComponent } from './creditors/creditors-detail/creditors-detail.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseComponent,
  },
  {
    path: ':billNo',
    component: PurchaseBillDetailComponent,
  },
  {
    path: 'create/bill',
    component: CreatePurchaseBillComponent,
  },
  {
    path: 'purchse-bill/report',
    component: PurchaseReportComponent,
  },
  {
    path: 'purchase-bill/invoice/report/:id',
    component: PurchaseReportDetailsComponent,
  },
  {
    path: 'additionalInfo/:billNo',
    component: PurchaseAdditionalInfoDetailsComponent,
  },
  {
    path: 'creditors/list',
    component: CreditorsComponent,
  },
  {
    path: 'creditors/detail/:sellerPan',
    component: CreditorsDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseRoutingModule {}
