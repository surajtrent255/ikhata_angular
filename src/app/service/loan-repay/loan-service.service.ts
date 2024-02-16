import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoanRepay } from 'src/app/models/Loan-Repay/loanRepay';
import { BASE_URL } from 'src/app/constants/urls';
import { RJResponse } from 'src/app/models/rjresponse';

@Injectable({
  providedIn: 'root',
})
export class LoanRepayService {
  constructor(private http: HttpClient) {}

  getLoanRepay(
    companyId: number,
    branchId: number
  ): Observable<RJResponse<LoanRepay[]>> {
    return this.http.get<RJResponse<LoanRepay[]>>(
      `${BASE_URL}/api/v1/loan/repay?companyId=${companyId}&branchId=${branchId}`
    );
  }

  getSingleLoanRepay(
    companyId: number,
    branchId: number,
    id: number
  ): Observable<RJResponse<LoanRepay>> {
    return this.http.get<RJResponse<LoanRepay>>(
      `${BASE_URL}/api/v1/loan/repay/${id}?companyId=${companyId}&branchId=${branchId}`
    );
  }

  addLoanRepay(loanRepay: LoanRepay): Observable<any> {
    return this.http.post(`${BASE_URL}/api/v1/loan/repay`, loanRepay);
  }

  deleteLoanRepay(id: number): Observable<any> {
    return this.http.delete(`${BASE_URL}/api/v1/loan/repay?id=${id}`);
  }

  updateLoanRepay(loanRepay: LoanRepay): Observable<any> {
    return this.http.put(`${BASE_URL}/api/v1/loan/repay`, loanRepay);
  }

  getLoanNameForLoanRepay(
    id: number,
    companyId: number,
    branchId: number
  ): Observable<RJResponse<Map<string, string>>> {
    return this.http.get<RJResponse<Map<string, string>>>(
      `${BASE_URL}/loan/name/repay?Id=${id}&companyId=${companyId}&branchId=${branchId}`
    );
  }
}
