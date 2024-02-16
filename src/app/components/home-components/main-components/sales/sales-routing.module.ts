import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSalesComponent } from './create-sales/create-sales.component';
import { SalesBillingComponent } from './sales-billing/sales-billing.component';
import { SalesBillEditComponent } from './sales-bill-edit/sales-bill-edit.component';
import { ExpenseComponent } from './expense/expense.component';
import { OtherIncomeComponent } from './other-income/other-income.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { SalesReportDetailComponent } from './sales-report/sales-report-detail/sales-report-detail.component';
import { CustomersComponent } from './customers/customers.component';
import { DebtorsComponent } from './debtors/debtors.component';
import { DebtorsBillDetailComponent } from './debtors/debtors-bill-detail/debtors-bill-detail.component';

const routes: Routes = [
  { path: 'invoice', component: SalesBillingComponent },

  { path: 'invoice/create', component: CreateSalesComponent },

  {
    path: 'invoice/:billId',
    component: SalesBillEditComponent,
  },
  {
    path: 'expense',
    component: ExpenseComponent,
  },
  {
    path: 'otherIncome',
    component: OtherIncomeComponent,
  },
  {
    path: 'salesbill/report',
    component: SalesReportComponent,
  },
  {
    path: 'salesbill/report/:id',
    component: SalesReportDetailComponent,
  },
  {
    path:'customer',
    component:CustomersComponent
  },{
    path:'debtors',
    component:DebtorsComponent
  },
  {
    path:'debtors/bill/:customer_pan',
    component: DebtorsBillDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
