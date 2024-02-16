import { Injectable } from '@angular/core';
import { PurchaseBillMaster } from '../models/PurchaseBillMaster';
import { BASE_URL } from '../constants/urls';
import { RJResponse } from '../models/rjresponse';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseBill } from '../models/PurchaseBill';
import { PurchaseBillInvoice } from '../models/PurchaseBillInvoice';
import { PurchaseReport } from '../models/PurchaseReport';

@Injectable({
  providedIn: 'root',
})
export class PurchaseBillService {
  constructor(private http: HttpClient) {}

  createNewPurchaseBill(
    purchaseBillMasterInfo: PurchaseBillMaster
  ): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/createPurchaseBill`;
    return this.http.post<RJResponse<number>>(url, purchaseBillMasterInfo);
  }

  getAllPurchaseBillByCompId(
    id: number,
    branchId: number
  ): Observable<RJResponse<PurchaseBill[]>> {
    let url = `${BASE_URL}/purchaseBill/company?compId=${id}&branchId=${branchId}`;
    return this.http.get<RJResponse<PurchaseBill[]>>(url);
  }

  getLimitedPurchaseBill(
    offset: number,
    pageTotalItems: number,
    compId: number,
    branchId: number,
    searchInput: string,
    searchValue: string
  ): Observable<RJResponse<PurchaseBill[]>> {
    let url = `${BASE_URL}/purchaseBill/company/limited?offset=${offset}&pageTotalItems=${pageTotalItems}&compId=${compId}&branchId=${branchId}&searchInput=${searchInput}&searchValue=${searchValue}`;
    return this.http.get<RJResponse<PurchaseBill[]>>(url);
  }

  getLimitedPurchaseBillForIRD(
    offset: number,
    fiscalYear: string,
    quarter: number,
    pageTotalItems: number,
    compId: number,
    branchId: number,
    searchInput: string,
    searchValue: string
  ): Observable<RJResponse<PurchaseBill[]>> {
    let url = `${BASE_URL}/utility/purchaseBill/list/limited?offset=${offset}&fiscalYear=${fiscalYear}&quarter=${quarter}&pageTotalItems=${pageTotalItems}&compId=${compId}&branchId=${branchId}&searchInput=${searchInput}&searchValue=${searchValue}`;
    return this.http.get<RJResponse<PurchaseBill[]>>(url);
  }

  fetchPurchaseBillDetailForInvoice(
    billId: number,
    compId: number,
    branchId: number
  ): Observable<RJResponse<PurchaseBillInvoice>> {
    let url = `${BASE_URL}/purchaseBillDetail?billId=${billId}&companyId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<PurchaseBillInvoice>>(url);
  }

  fetchPurchaseBillInfoForReport(
    billId: number,
    compId: number,
    branchId: number
  ): Observable<RJResponse<PurchaseReport>> {
    let url = `${BASE_URL}/purchaseBill/report/${billId}?compId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<PurchaseReport>>(url);
  }

  getTodayTotalPurchaseBillAmount(
    todayDate: string,
    companyId: number,
    branchId: number
  ): Observable<any> {
    return this.http.get(
      `${BASE_URL}/purchaseBill/date/today?todayDate=${todayDate}&companyId=${companyId}&branchId=${branchId}`
    );
  }

  getThisMonthTotalPurchaseBillAmount(
    month: string,
    companyId: number,
    branchId: number
  ): Observable<any> {
    return this.http.get(
      `${BASE_URL}/purchaseBill/date/month?month=${month}&companyId=${companyId}&branchId=${branchId}`
    );
  }

  getThisFiscalYearTotalPurchaseBillAmount(
    fiscalYear: string,
    companyId: number,
    branchId: number
  ): Observable<any> {
    return this.http.get(
      `${BASE_URL}/purchaseBill/date/fiscalYear?fiscalYear=${fiscalYear}&companyId=${companyId}&branchId=${branchId}`
    );
  }

  getTodayTotalPurchaseBillTaxAmount(
    todayDate: string,
    companyId: number,
    branchId: number
  ): Observable<any> {
    return this.http.get(
      `${BASE_URL}/purchaseBill/date/tax/today?todayDate=${todayDate}&companyId=${companyId}&branchId=${branchId}`
    );
  }

  getThisMonthTotalPurchaseBillTaxAmount(
    month: string,
    companyId: number,
    branchId: number
  ): Observable<any> {
    return this.http.get(
      `${BASE_URL}/purchaseBill/date/tax/month?month=${month}&companyId=${companyId}&branchId=${branchId}`
    );
  }

  getThisFiscalYearTotalPurchaseBillTaxAmount(
    fiscalYear: string,
    companyId: number,
    branchId: number
  ): Observable<any> {
    return this.http.get(
      `${BASE_URL}/purchaseBill/date/tax/fiscalYear?fiscalYear=${fiscalYear}&companyId=${companyId}&branchId=${branchId}`
    );
  }

  getAllCreditors(
    offset: number,
    pageTotalItems: number,
    compId: number,
    branchId: number,
    searchBy: string,
    searchWildCard: string,
    purchaseTally: boolean = false
  ): Observable<RJResponse<PurchaseBill[]>> {
    const httpParams = new HttpParams()
      .set('compId', compId)
      .set('branchId', branchId)
      .set('offset', offset)
      .set('pageTotalItems', pageTotalItems)
      .set('searchBy', searchBy)
      .set('searchWildCard', searchWildCard)
      .set("purchaseTally", purchaseTally);
    return this.http.get<RJResponse<PurchaseBill[]>>(
      `${BASE_URL}/purchaseBill/creditors`,
      { params: httpParams }
    );
  }

  getDataForCreditorDetail(
    offset: number,
    pageTotalItems: number,
    compId: number,
    branchId: number,
    sellerPan: string,
    searchInput: string
  ): Observable<RJResponse<PurchaseBill[]>> {
    return this.http.get<RJResponse<PurchaseBill[]>>(
      `${BASE_URL}/purchaseBill/creditors/detail?offset=${offset}&pageTotalItems=${pageTotalItems}&companyId=${compId}&branchId=${branchId}&sellerPan=${sellerPan}&searchInput=${searchInput}`
    );
  }
}
