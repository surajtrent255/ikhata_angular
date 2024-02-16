import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseRoutingModule } from './expense-routing.module';
import { EditExpenseComponent } from './edit-expense/edit-expense.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpenseComponent } from './expense.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [EditExpenseComponent, ExpenseComponent],
  imports: [
    CommonModule,
    ExpenseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
  ],
})
export class ExpenseModule {}
