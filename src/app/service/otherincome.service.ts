import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OtherIncome } from '../models/OtherIncome';
import { RJResponse } from '../models/rjresponse';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../constants/urls';
import { OtherIncomeSource } from '../models/OtherIncomeSource';

@Injectable({
  providedIn: 'root'
})
export class OtherIncomeService {

  updateOtherIncome(otherIncome: OtherIncome) {
    let url = `${BASE_URL}/otherIncome/${otherIncome.sn}`;
    return this.http.put<void>(url, otherIncome);
  }

  getOtherIncomeById(id: number, companyId: number, branchId: number): Observable<RJResponse<OtherIncome>> {
    let url = `${BASE_URL}/otherIncome/single?id=${id}&compId=${companyId}&branchId=${branchId}`;
    return this.http.get<RJResponse<OtherIncome>>(url);
  }

  deleteOtherIncomeById(deleteOtherIncomeId: number, compId: number, branchId: number) {
    let url = `${BASE_URL}/otherIncome/${deleteOtherIncomeId}?compId=${compId}&branchId=${branchId}`;
    return this.http.delete(url);
  }

  createNewOtherIncome(value: OtherIncome): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/otherIncome`;
    return this.http.post<RJResponse<number>>(url, value);
  }

  getLimitedOtherIncomes(offset: number, pageTotalItems: number, searchBy: string, searchWildCard: string, sortBy: string, compId: number, branchId: number): Observable<RJResponse<OtherIncome[]>> {
    let url = `${BASE_URL}/otherIncome?compId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<OtherIncome[]>>(url);
  }

  createNewOtherIncomeSource(value: OtherIncomeSource): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/otherIncomeSource`;
    return this.http.post<RJResponse<number>>(url, value)
  }

  getOtherIncomeSourceList(compId: number, branchId: number): Observable<RJResponse<OtherIncomeSource[]>> {
    let url = `${BASE_URL}/otherIncomeSource?compId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<OtherIncomeSource[]>>(url);
  }


  constructor(private http: HttpClient) { }
}
