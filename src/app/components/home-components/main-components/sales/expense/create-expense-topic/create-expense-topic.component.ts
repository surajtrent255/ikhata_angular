import { Component, EventEmitter, Output } from '@angular/core';
import { ExpenseTopic } from 'src/app/models/Expense/ExpenseTopic';
import { ExpenseService } from 'src/app/service/shared/Assets And Expenses/expense.service';

@Component({
  selector: 'app-create-expense-topic',
  templateUrl: './create-expense-topic.component.html',
  styleUrls: ['./create-expense-topic.component.css']
})
export class CreateExpenseTopicComponent {
  @Output() expenseTopicAdditionCompleted = new EventEmitter<boolean>(false);
  @Output() destroyExpenseTopicAdditionComponent = new EventEmitter<boolean>(false);

  constructor(private expenseService: ExpenseService,) {

  }

  destroyComp() {
    this.destroyExpenseTopicAdditionComponent.emit(false);
  }



  addTopic($topic: string) {
    let topic: ExpenseTopic = new ExpenseTopic;
    if ($topic.trim() !== "") {
      topic.name = $topic;
 

      this.expenseService.createNewExpenseTopic(topic).subscribe(res => {
        // this.getAllDesignation();
        this.expenseTopicAdditionCompleted.emit(true);
      })
    }
  }
}
