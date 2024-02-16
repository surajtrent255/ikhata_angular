import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Expense } from 'src/app/models/Expense/Expense';
import { ExpenseService } from 'src/app/service/shared/Assets And Expenses/expense.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent {
  // for Display
  expense: Expense[] = [];
  expenseIdForEdit!: number;

  LoggedInCompanyId!: number;
  LoggedInBranchId!: number;

  isAccountant: boolean = false;
  isMaster: boolean = false;

  currentPageNumber: number = 1;
  pageTotalItems: number = 5;

  initEditExpense!: boolean;

  ExpenseForm = new FormGroup({
    amount: new FormControl('', [Validators.required]),
    topic: new FormControl('', [Validators.required]),
    billNo: new FormControl('', [Validators.required]),
    payTo: new FormControl(0, [Validators.required]),
  });

  constructor(
    private expenseService: ExpenseService,
    private loginService: LoginService,
    private tostrService: ToastrService
  ) {}

  ngOnInit() {
    this.initEditExpense = false;
    this.LoggedInBranchId = this.loginService.getBranchId();
    this.LoggedInCompanyId = this.loginService.getCompnayId();
    this.getExpenseDetails();
    let roles = this.loginService.getCompanyRoles();
    if (roles?.includes('ACCOUNTANT')) {
      this.isAccountant = true;
    } else if (roles.includes('ADMIN')) {
      this.isMaster = true;
    } else {
      this.isAccountant = false;
      this.isMaster = false;
    }
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedExpensesDetail();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedExpensesDetail();
    }
  }

  fetchLimitedExpensesDetail() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.expenseService
      .getLimitedExpenseDetail(
        offset,
        this.pageTotalItems,
        this.LoggedInCompanyId,
        this.LoggedInBranchId
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.tostrService.error('expense not found ');
          this.currentPageNumber -= 1;
        } else {
          this.expense = res.data;
        }
      });
  }

  getExpenseDetails() {
    this.expenseService
      .getExpenseDetails(this.LoggedInCompanyId)
      .subscribe((res) => {
        this.expense = res.data;
      });
  }

  SubmitExpenseForm() {
    var mainInput = document.getElementById(
      'nepali-datepicker'
    ) as HTMLInputElement;
    var nepaliDate = mainInput.value;

    var Input = document.getElementById('AdDate') as HTMLInputElement;
    var englishDate = Input.value;

    this.expenseService
      .addExpenseDetails({
        sn: 0,
        companyId: this.LoggedInCompanyId,
        branchId: this.LoggedInBranchId,
        amount: Number(this.ExpenseForm.value.amount!),
        billNo: this.ExpenseForm.value.billNo!,
        date: englishDate,
        payTo: this.ExpenseForm.value.payTo!,
        status: true,
        topic: Number(this.ExpenseForm.value.topic!),
        nepaliDate: nepaliDate,
      })
      .subscribe({
        complete: () => {
          this.getExpenseDetails();
          const popClose = document.getElementById(
            'closeButton'
          ) as HTMLInputElement;
          popClose.click();
        },
        next: () => {
          this.ExpenseForm.reset();
        },
      });
  }

  deleteExpenseDetails(SN: number) {
    this.expenseService.deleteExpenseDetails(SN).subscribe({
      complete: () => {
        this.getExpenseDetails();
      },
    });
  }

  editExpense(sn: number) {
    this.initEditExpense = true;
    this.expenseIdForEdit = sn;
  }

  getAllExpenseDetails() {
    this.getExpenseDetails();
  }

  onCreate() {
    const createPopUp = document.getElementById(
      'expenseDetailsPopup'
    ) as HTMLButtonElement;
    createPopUp.click();
  }
  cancel() {
    const popClose = document.getElementById('closeButton') as HTMLInputElement;
    popClose.click();
  }
}
