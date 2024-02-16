import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBankComponent } from './create-bank/create-bank.component';
import { BankDepositComponent } from './bank-deposit/bank-deposit.component';
import { BankWithdrawComponent } from './bank-withdraw/bank-withdraw.component';
import { LoanComponent } from './loan/loan.component';

const routes: Routes = [
  {
    path: 'create',
    component: CreateBankComponent,
  },
  {
    path: 'deposit',
    component: BankDepositComponent,
  },
  {
    path: 'withdraw',
    component: BankWithdrawComponent,
  },
  {
    path: 'loan',
    component: LoanComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankRoutingModule {}
