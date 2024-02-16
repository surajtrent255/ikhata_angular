import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankRoutingModule } from './bank-routing.module';
import { BankDepositComponent } from './bank-deposit/bank-deposit.component';
import { BankWithdrawComponent } from './bank-withdraw/bank-withdraw.component';
import { CreateBankComponent } from './create-bank/create-bank.component';
import { BankDepositEditComponent } from './bank-deposit/bank-deposit-edit/bank-deposit-edit.component';
import { BankWithdrawEditComponent } from './bank-withdraw/bank-withdraw-edit/bank-withdraw-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoanComponent } from './loan/loan.component';
import { CreateLoanComponent } from './loan/create-loan/create-loan.component';
import { SharablePortionModule } from 'src/app/components/sharable-portion/sharable-portion.module';
import { EditLoanComponent } from './loan/edit-loan/edit-loan.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { EditBankComponent } from './edit-bank/edit-bank.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
  declarations: [
    BankDepositComponent,
    BankWithdrawComponent,
    CreateBankComponent,
    BankDepositEditComponent,
    BankWithdrawEditComponent,
    LoanComponent,
    CreateLoanComponent,
    EditLoanComponent,
    EditBankComponent,
  ],
  imports: [
    CommonModule,
    BankRoutingModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    SharablePortionModule,
    AutocompleteLibModule,
  ],
})
export class BankModule {}
