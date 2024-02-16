import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditExpenseComponent } from './edit-expense/edit-expense.component';
import { ExpenseComponent } from './expense.component';

const routes: Routes = [
  {
    path: '',
    component: ExpenseComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseRoutingModule {}
