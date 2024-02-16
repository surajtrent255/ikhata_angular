import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanRepayComponent } from './loan-repay.component';

const routes: Routes = [
  {
    path: '',
    component: LoanRepayComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoanRepayRoutingModule {}
