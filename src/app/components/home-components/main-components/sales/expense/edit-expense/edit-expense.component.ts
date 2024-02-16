import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import { Expense } from 'src/app/models/Expense/Expense';
import { ExpenseService } from 'src/app/service/shared/Assets And Expenses/expense.service';
import { CommonService } from 'src/app/service/shared/common/common.service';

@Component({
  selector: 'app-edit-expense',
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.css']
})
export class EditExpenseComponent implements OnDestroy {
  @Input() ExpenseId!: number;
  @Output() updatedSuccessful = new EventEmitter<boolean>(false);
  @Output() destroyExpenseEditEvent = new EventEmitter<boolean>(false);
  expense: Expense = new Expense();
  newDate!: Date;

  constructor(
    private expenseService: ExpenseService,
    private commonService: CommonService,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
  }

  initCss() {
    const elements: HTMLCollectionOf<Element> =
      document.getElementsByClassName('nsm-dialog');

    if (elements) {
      const element = elements[0] as HTMLElement;
      element.style.maxWidth = 'fit-content';
    }
  }

  ngOnChanges() {
    this.getExpenseDetailsBySN(this.ExpenseId);
    this.initCss();

  }

  ngAfterViewInit() {
    // this.initCss();
    console.log("ngAfterViewInit " + this)
  }
  ngOnDestroy() {
    console.log("destoy" + this)
  }

  destroyComp() {
    this.ExpenseId = 0;
    this.destroyExpenseEditEvent.emit(true);
  }

  getExpenseDetailsBySN(sn: number) {
    this.expenseService.getExpenseBySN(sn).subscribe((res) => {
      this.expense = res.data;
      let date = this.commonService.formatDate(Number(this.expense.date));
      this.expense.date = date;
      setTimeout(() => {
        const dateEl = document.getElementById(
          'nepali-datepicker'
        ) as HTMLInputElement;
        dateEl.value = String(adToBs(new Date(this.expense.date).toJSON().slice(0, 10)));

        const engDateEl = document.getElementById("AdDate") as HTMLInputElement
        engDateEl.value = String(this.expense.date);
      }
      )
    });
  }

  updateExpense() {
    var mainInput = document.getElementById(
      'nepali-datepicker'
    ) as HTMLInputElement;
    this.expense.nepaliDate = mainInput.value;

    var Input = document.getElementById('AdDate') as HTMLInputElement;
    this.expense.date = Input.value;
    
    this.expenseService.updateExpenseDetails(this.expense).subscribe({
      next: (res) => {
        this.updatedSuccessful.emit(true);
      },
    });
  }
}
