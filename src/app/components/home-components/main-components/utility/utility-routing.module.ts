import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilityTaxFileComponent } from './utility-tax-file/utility-tax-file.component';
import { ListSalesBillsComponent } from './utility-tax-file/list-sales-bills/list-sales-bills.component';
import { ListPurchaseBillsComponent } from './utility-tax-file/list-purchase-bills/list-purchase-bills.component';
import { SalesTallyComponent } from './sales-tally/sales-tally.component';
import { SalesTallyBillDetailComponent } from './sales-tally/sales-tally-bill-detail/sales-tally-bill-detail.component';
import { PurchaseTallyComponent } from './purchase-tally/purchase-tally.component';
import { PurchaseTallyDetailComponent } from './purchase-tally/purchase-tally-detail/purchase-tally-detail.component';

const routes: Routes = [
  {
    path: '', component: UtilityTaxFileComponent
  },
  {
    path: 'salestally', component: SalesTallyComponent,
  },
  {
    path: 'purchasetally',
    component: PurchaseTallyComponent
  },
  {
    path: 'total-sale-bill', component: ListSalesBillsComponent
  },
  {
    path: 'total-purchase-bill', component: ListPurchaseBillsComponent
  },
  {
    path: 'salestally/bill/:customer_pan',
    component: SalesTallyBillDetailComponent
  },
  {
    path: 'purchasetally/bill/:sellerPan',
    component: PurchaseTallyDetailComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilityRoutingModule {
  constructor() {
  }
}
