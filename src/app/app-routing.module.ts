import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/common/login/login.component';
import { SelectCompanyComponent } from './components/common/select-company/select-company.component';
import { CreateCompanyComponent } from './components/common/create-company/create-company.component';
import { HomeComponent } from './components/home-components/home/home.component';
import { DashboardComponent } from './components/home-components/dashboard/dashboard.component';
import { SalesBillInvoiceComponent } from './components/home-components/main-components/sales/sales-bill-invoice/sales-bill-invoice.component';
import { ForgPassEnterEmailComponent } from './components/home-components/main-components/security/forg-pass-enter-email/forg-pass-enter-email.component';
import { ResetPasswordComponent } from './components/home-components/main-components/security/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'select/company', component: SelectCompanyComponent },
  { path: 'create', component: CreateCompanyComponent },
  {
    path: 'superAdmin',
    loadChildren: () =>
      import('../app/components/auth/super-admin/super-admin.module').then(
        (module) => module.SuperAdminModule
      ),
  },
  {
    path: 'forgot-password/enter-email',
    component: ForgPassEnterEmailComponent
  },
  {
    path: 'reset-password/:token/:email',
    component: ResetPasswordComponent
  },
  {
    path: 'salesBillPrint/:billId',
    component: SalesBillInvoiceComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'configuration',
        loadChildren: () =>
          import(
            './components/home-components/configuration-tabs/configuration/configuration.module'
          ).then((mod) => mod.ConfigurationModule),
      },
      {
        path: 'edit-profile',
        loadChildren: () =>
          import('./components/common/edit-profile/edit-profile.module').then(
            (mod) => mod.EditProfileModule
          ),
      },
      {
        path: 'sales',
        loadChildren: () =>
          import(
            './components/home-components/main-components/sales/sales.module'
          ).then((mod) => mod.SalesModule),
      },
      {
        path: 'split/merge',
        loadChildren: () =>
          import(
            '../app/components/home-components/main-components/split-merge-product/split-merge-product.module'
          ).then((module) => module.SplitMergeProductModule),
      },
      {
        path: 'categoryprod',
        loadChildren: () =>
          import(
            '../app/components/home-components/main-components/categoryprod/category/category.module'
          ).then((module) => module.CategoryModule),
      },
      {
        path: 'product',
        loadChildren: () =>
          import(
            '../app/components/home-components/main-components/products/products.module'
          ).then((module) => module.ProductsModule),
      },
      {
        path: 'employee',
        loadChildren: () =>
          import(
            '../app/components/home-components/main-components/employee/employee.module'
          ).then((module) => module.EmployeeModule),
      },
      {
        path: 'purchasebills',
        loadChildren: () =>
          import(
            '../app/components/home-components/main-components/purchase/purchase.module'
          ).then((mod) => mod.PurchaseModule),
      },
      {
        path: 'creditnote',
        loadChildren: () =>
          import(
            '../app/components/home-components/main-components/credit-note/credit-note.module'
          ).then((module) => module.CreditNoteModule),
      },
      {
        path: 'debitnote',
        loadChildren: () =>
          import(
            '../app/components/home-components/main-components/debit-note/debit-note.module'
          ).then((module) => module.DebitNoteModule),
      },
      {
        path: 'expense',
        loadChildren: () =>
          import(
            './components/home-components/main-components/expense/expense.module'
          ).then((mod) => mod.ExpenseModule),
      },
      {
        path: 'fixedAsset',
        loadChildren: () =>
          import(
            './components/home-components/main-components/fixed-assets/fixed-assets.module'
          ).then((mod) => mod.FixedAssetsModule),
      },
      {
        path: 'payment',
        loadChildren: () =>
          import(
            './components/home-components/main-components/payment/payment.module'
          ).then((mod) => mod.PaymentModule),
      },
      {
        path: 'receipt',
        loadChildren: () =>
          import(
            './components/home-components/main-components/receipt/receipt.module'
          ).then((mod) => mod.ReceiptModule),
      },
      {
        path: 'bank',
        loadChildren: () =>
          import(
            './components/home-components/main-components/Bank/bank.module'
          ).then((mod) => mod.BankModule),
      },
      {
        path: 'loanRepay',
        loadChildren: () =>
          import(
            './components/home-components/main-components/loan-repay/loan-repay.module'
          ).then((mod) => mod.LoanRepayModule),
      },
      {
        path: 'utility',
        loadChildren: () =>
          import(
            './components/home-components/main-components/utility/utility.module'
          ).then((mod) => mod.UtilityModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
