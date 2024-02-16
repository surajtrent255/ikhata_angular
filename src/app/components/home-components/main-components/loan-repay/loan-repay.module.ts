import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanRepayRoutingModule } from './loan-repay-routing.module';
import { LoanRepayComponent } from './loan-repay.component';
import { EditLoanRepayComponent } from './edit-loan-repay/edit-loan-repay.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EditLoanRepayComponent, LoanRepayComponent],
  imports: [
    CommonModule,
    LoanRepayRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class LoanRepayModule {}
