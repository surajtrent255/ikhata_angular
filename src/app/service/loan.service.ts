import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RJResponse } from '../models/rjresponse';
import { LoanTypes } from '../models/LoanTypes';
import { BASE_URL } from '../constants/urls';
import { LoanNames } from '../models/LoanNames';
import { Loan } from '../models/Loan';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor(private http: HttpClient) { }


  getAllLoanTypes(): Observable<RJResponse<LoanTypes[]>> {
    let url = `${BASE_URL}/loan/types`;
    return this.http.get<RJResponse<LoanTypes[]>>(url);
  }

  getAllLoanNames(): Observable<RJResponse<LoanNames[]>> {
    let url = `${BASE_URL}/loan/names`;
    return this.http.get<RJResponse<LoanNames[]>>(url);
  }

  createLoan(loan: Loan): Observable<RJResponse<Number>> {
    let url = `${BASE_URL}/loan`;
    return this.http.post<RJResponse<Number>>(url, loan)
  }

  getLoans(compId: number, branchId: number): Observable<RJResponse<Loan[]>> {
    let url = `${BASE_URL}/loan/all?compId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<Loan[]>>(url);
  }

  getLimitedLoans(offset: number, pageTotalItems: number, searchBy: string,
    searchWildCard: string,
    sortBy: string, compId: number, branchId: number): Observable<RJResponse<Loan[]>> {
    let url = `${BASE_URL}/loan/limited?offset=${offset}&pageTotalItems=${pageTotalItems}&searchBy=${searchBy}&searchWildCard=${searchWildCard}&sortBy=${sortBy}&compId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<Loan[]>>(url);
  }

  getSingleLoan(id: number, compId: number, branchId: number): Observable<RJResponse<Loan>> {
    let url = `${BASE_URL}/loan?id=${id}&compId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<Loan>>(url);
  }

  deleteLoan(loanId: number, compId: number, branchId: number) {
    let url = `${BASE_URL}/loan/${loanId}?compId=${compId}&branchId=${branchId}`;
    return this.http.delete(url);
  }

  editLoan(loanId: number, compId: number, branchId: number, loan: Loan) {
    let url = `${BASE_URL}/loan/${loanId}?id=${loanId}&compId=${compId}&branchId=${branchId}`;
    return this.http.post(url,  loan );
  }
}
