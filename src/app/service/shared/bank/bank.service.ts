import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { BASE_URL, GET_ALL_BANK, post_ALL_BANK } from 'src/app/constants/urls';
import { AccountType } from 'src/app/models/AccountTypes';
import { Bank } from 'src/app/models/Bank';
import { Deposit } from 'src/app/models/BankDeposite';
import { BankList } from 'src/app/models/BankList';
import { BankWidthdraw } from 'src/app/models/Bankwithdraw';
import { DepostiWithDrawTyes } from 'src/app/models/DepositWithDrawTypes';
import { RJResponse } from 'src/app/models/rjresponse';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  httpClient: any;

  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getAllBanks(companyId: number, branchId: number): Observable<any> {
    return this.http.get(
      `${GET_ALL_BANK}?companyId=${companyId}&branchId=${branchId}`
    );
  }

  getLimitedBank(
    offset: number,
    pageTotalItems: number,
    compId: number,
    branchId: number
  ): Observable<RJResponse<Bank[]>> {
    let url = `${BASE_URL}/api/v1/bank/limited?offset=${offset}&pageTotalItems=${pageTotalItems}&compId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<Bank[]>>(url);
  }

  getBankList(): Observable<RJResponse<BankList[]>> {
    let url = `${BASE_URL}/api/v1/bank/list`;
    return this.http.get<RJResponse<BankList[]>>(url);
  }

  getDepositWithDrawTypes(): Observable<RJResponse<DepostiWithDrawTyes[]>> {
    let url = `${BASE_URL}/depositWithdrawTypes`;
    return this.http.get<RJResponse<DepostiWithDrawTyes[]>>(url);
  }

  getBankDepositById(
    id: number,
    companyId: number,
    branchId: number
  ): Observable<RJResponse<Deposit>> {
    let url = `${BASE_URL}/api/v1/bank/deposite/single?id=${id}&compId=${companyId}&branchId=${branchId}`;
    return this.http.get<RJResponse<Deposit>>(url);
  }

  getBankWithdrawById(
    id: number,
    companyId: number,
    branchId: number
  ): Observable<RJResponse<BankWidthdraw>> {
    let url = `${BASE_URL}/api/v1/bank/withdraw/single?id=${id}&compId=${companyId}&branchId=${branchId}`;
    return this.http.get<RJResponse<BankWidthdraw>>(url);
  }

  getAccountTypes(): Observable<RJResponse<AccountType[]>> {
    let url = `${BASE_URL}/api/v1/bank/accounttype`;
    return this.http.get<RJResponse<AccountType[]>>(url);
  }

  addBank(bank: Bank): Observable<any> {
    const bank_data = bank;
    return this.http.post(post_ALL_BANK, bank_data).pipe(
      tap({
        next: (response) => {
          this.toastrService.success('Bank Added Successfully');
          console.log(response);
        },
        error: (error) => {
          console.log(error);
          this.toastrService.error('Bank Adding Failed');
        },
      })
    );
  }
  
  updateBank(bank: Bank):Observable<RJResponse<number>>{
    let url =  `${BASE_URL}/api/v1/bank`;
    return this.http.put<RJResponse<number>>(url, bank);
  }

  deletebank(bankId: number) {
    let url = `${BASE_URL}/api/v1/bank/${bankId}`;
    return this.http.delete(url);
  }

  updateBankDeposit(deposit: Deposit): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/api/v1/bank/deposite`;
    return this.http.put<RJResponse<number>>(url, deposit);
  }

  updateBankWithDraw(withDraw: BankWidthdraw): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/api/v1/bank/withdraw`;
    return this.http.put<RJResponse<number>>(url, withDraw);
  }
}
