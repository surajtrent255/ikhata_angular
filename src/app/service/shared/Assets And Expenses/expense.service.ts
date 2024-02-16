import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { BASE_URL, GET_EXPENSE_DETAILS } from 'src/app/constants/urls';
import { Expense } from 'src/app/models/Expense/Expense';
import { ExpenseTopic } from 'src/app/models/Expense/ExpenseTopic';
import { RJResponse } from 'src/app/models/rjresponse';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  compId = 0;
  branchId = 0;
  constructor(private http: HttpClient, private toastrService: ToastrService, private LoginService: LoginService) { 
    this.compId = this.LoginService.getCompnayId();
    this.branchId = this.LoginService.getBranchId();
  }

  getExpenseDetails(companyId: number): Observable<RJResponse<Expense[]>> {
    return this.http.get<RJResponse<Expense[]>>(
      `${GET_EXPENSE_DETAILS}?companyId=${companyId}`
    );
  }

  getLimitedExpenseDetail(offset: number, pageTotalItems: number, compId: number, branchId: number): Observable<RJResponse<Expense[]>> {
    let url = `${GET_EXPENSE_DETAILS}/limited?offset=${offset}&pageTotalItems=${pageTotalItems}&compId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<Expense[]>>(url);
  }


  getExpenseBySN(sn: number): Observable<any> {
    return this.http.get(`${GET_EXPENSE_DETAILS}/${sn}`);
  }

  updateExpenseDetails(expense: Expense): Observable<any> {
    return this.http.put(GET_EXPENSE_DETAILS, expense).pipe(
      tap({
        next: (res) => {
          this.toastrService.success('Update SuccessFul');
        },
        error: (err) => {
          this.toastrService.error(err);
        },
      })
    );
  }

  addExpenseDetails(expense: Expense): Observable<any> {
    return this.http.post(GET_EXPENSE_DETAILS, expense).pipe(
      tap({
        next: (response) => {
          this.toastrService.success(response.toString());
        },
        error: (err) => {
          this.toastrService.error('Something Went Worng' + err);
        },
      })
    );
  }

  deleteExpenseDetails(SN: number) {
    return this.http.delete(`${GET_EXPENSE_DETAILS}/${SN}`);
  }

  getExpenseTopics(): Observable<RJResponse<ExpenseTopic[]>>{
    let url = `${BASE_URL}/api/v1/expense/topic/all?compId=${this.compId}&branchId=${this.branchId}`;
    return this.http.get<RJResponse<ExpenseTopic[]>>(url);
  }

  createNewExpenseTopic(expense: ExpenseTopic){
    expense.companyId=this.compId;
    expense.branchId = this.branchId;
    console.log("expense => "+JSON.stringify(expense));
    let url = `${BASE_URL}/api/v1/expense/topic/create`;
    return this.http.post(url, expense);
  }

}
