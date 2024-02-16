import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { CreateSalesComponent } from './create-sales/create-sales.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharablePortionModule } from 'src/app/components/sharable-portion/sharable-portion.module';
import { ProductsModule } from '../products/products.module';
import { SplitMergeProductModule } from '../split-merge-product/split-merge-product.module';
import { SalesBillingComponent } from './sales-billing/sales-billing.component';
import { SalesBillEditComponent } from './sales-bill-edit/sales-bill-edit.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { SalesBillInvoiceComponent } from './sales-bill-invoice/sales-bill-invoice.component';
import { BillTemplate1Component } from './sales-bill-invoice/bill-template1/bill-template1.component';
import { BillTemplate2Component } from './sales-bill-invoice/bill-template2/bill-template2.component';
import { ExpenseComponent } from './expense/expense.component';
import { EditExpenseComponent } from './expense/edit-expense/edit-expense.component';
import { NgxSmartModalComponent, NgxSmartModalModule } from 'ngx-smart-modal';
import { OtherIncomeComponent } from './other-income/other-income.component';
import { CreateOtherIncomeComponent } from './other-income/create-other-income/create-other-income.component';
import { CreateOtherIncomeSourceComponent } from './other-income/create-other-income-source/create-other-income-source.component';
import { UpdateOtherIncomeComponent } from './other-income/update-other-income/update-other-income.component';
import { SalesReportDetailComponent } from './sales-report/sales-report-detail/sales-report-detail.component';
import { CreateExpenseTopicComponent } from './expense/create-expense-topic/create-expense-topic.component';
import { CustomersComponent } from './customers/customers.component';
import { CreateFiscalYearComponent } from './create-fiscal-year/create-fiscal-year.component';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { DebtorsComponent } from './debtors/debtors.component';
import { DebtorsBillDetailComponent } from './debtors/debtors-bill-detail/debtors-bill-detail.component';
import { DebtorsBillListComponent } from './debtors/debtors-bill-list/debtors-bill-list.component';
@NgModule({
  declarations: [
    CreateSalesComponent,
    SalesBillingComponent,
    SalesBillEditComponent,
    SalesReportComponent,
    SalesBillInvoiceComponent,
    BillTemplate1Component,
    BillTemplate2Component,
    ExpenseComponent,
    EditExpenseComponent,
    OtherIncomeComponent,
    CreateOtherIncomeComponent,
    CreateOtherIncomeSourceComponent,
    UpdateOtherIncomeComponent,
    SalesReportDetailComponent,
    CreateExpenseTopicComponent,
    CustomersComponent,
    CreateFiscalYearComponent,
    DebtorsComponent,
    DebtorsBillDetailComponent,
    DebtorsBillListComponent,
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharablePortionModule,
    ProductsModule,
    SplitMergeProductModule,
    NgxSmartModalModule.forRoot(),
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ],
})
export class SalesModule {}
