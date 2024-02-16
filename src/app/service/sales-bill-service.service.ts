import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SweetAlertResult } from 'sweetalert2';
import { BASE_URL } from '../constants/urls';
import { RJResponse } from '../models/rjresponse';
import { SalesBill } from '../models/SalesBill';
import { SalesBillDetail } from '../models/SalesBillDetail';
import { SalesBillInvoice } from '../models/SalesBillInvoice';
import { SalesBillMaster } from '../models/SalesBillMaster';
import { CompanyLabelInfo } from '../models/CompanyLabelInfo';
import { FiscalYear } from '../models/FiscalYear';

@Injectable({
  providedIn: 'root',
})
export class SalesBillServiceService {

  constructor(private http: HttpClient) { }

  getAllSalesBill(
    id: number,
    branchId: number
  ): Observable<RJResponse<SalesBill[]>> {
    let url = `${BASE_URL}/salesBill/company?compId=${id}&branchId=${branchId}`;
    return this.http.get<RJResponse<SalesBill[]>>(url);
  }

  getLimitedSalesBillForIrd(
    fiscalYear: string,
    quarter: number,
    offset: number,
    pageTotalItems: number,
    searchBy: string,
    searchWildCard: string,
    sortBy: string,
    compId: number,
    branchId: number
  ): Observable<RJResponse<SalesBill[]>> {
    let url = `${BASE_URL}/utility/salesBill/list?fiscalYear=${fiscalYear}&quarter=${quarter}&offset=${offset}&pageTotalItems=${pageTotalItems}&searchBy=${searchBy}&searchWildCard=${searchWildCard}&sortBy=${sortBy}&compId=${compId}&branchId=${branchId}`;

    return this.http.get<RJResponse<SalesBill[]>>(url);
  }

  getLimitedSalesBill(

    offset: number,
    pageTotalItems: number,
    searchBy: string,
    searchWildCard: string,
    sortBy: string,
    compId: number,
    branchId: number,
    forSalesReport = false
  ): Observable<RJResponse<SalesBill[]>> {
    let url = `${BASE_URL}/salesBill/company/limited?offset=${offset}&pageTotalItems=${pageTotalItems}&searchBy=${searchBy}&searchWildCard=${searchWildCard}&sortBy=${sortBy}&compId=${compId}&branchId=${branchId}&forSalesReport=${forSalesReport}`;
    return this.http.get<RJResponse<SalesBill[]>>(url);
  }

  createNewSalesBill(
    salesBillMasterInfo: SalesBillMaster
  ): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/createSalesBill`;
    return this.http.post<RJResponse<number>>(url, salesBillMasterInfo);
  }

  getBillDetailById(billId: number): Observable<RJResponse<SalesBillDetail[]>> {
    let url = `${BASE_URL}/salesBillDetail/getByBillId?billId=${billId}`;
    return this.http.get<RJResponse<SalesBillDetail[]>>(url);
  }
  fetchSalesBillDetailForInvoice(
    billId: number
  ): Observable<RJResponse<SalesBillInvoice>> {
    let url = `${BASE_URL}/salesBillDetail?billId=${billId}`;
    return this.http.get<RJResponse<SalesBillInvoice>>(url);
  }

  fetchSalesBillDetailForInvoiceByBillNo(
    billNo: string
  ): Observable<RJResponse<SalesBillInvoice>> {
    let url = `${BASE_URL}/salesBillDetail/billNo?billNo=${billNo}`;
    return this.http.get<RJResponse<SalesBillInvoice>>(url);
  }

  printTheBill(
    billId: number,
    printerId: number
  ): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/salesBill/print/${billId}`;
    console.log('print url = ' + url);
    return this.http.post<RJResponse<number>>(url, { printerId: printerId });
  }

  approveTheBill(id: number) {
    let url = `${BASE_URL}/salesBill/approve/${id}`;
    return this.http.post<RJResponse<number>>(url, {});
  }

  cancelTheBill(id: number) {
    let url = `${BASE_URL}/salesBill/${id}`;
    return this.http.delete(url);
  }

  fetchCompanyInfo(
    compId: number,
    label: string
  ): Observable<RJResponse<CompanyLabelInfo>> {
    let url = `${BASE_URL}/api/v1/company/label/${compId}/${label}`;
    return this.http.get<RJResponse<CompanyLabelInfo>>(url);
  }

  getTodayTotalSalesBillAmount(
    todayDate: string,
    companyId: number,
    branchId: number
  ): Observable<any> {
    return this.http.get(
      `${BASE_URL}/salesBill/date/today?todayDate=${todayDate}&companyId=${companyId}&branchId=${branchId}`
    );
  }

  getThisMonthTotalSalesBillAmount(
    month: string,
    companyId: number,
    branchId: number
  ): Observable<any> {
    return this.http.get(
      `${BASE_URL}/salesBill/date/month?month=${month}&companyId=${companyId}&branchId=${branchId}`
    );
  }

  getThisFiscalYearTotalSalesBillAmount(
    fiscalYear: string,
    companyId: number,
    branchId: number
  ): Observable<any> {
    return this.http.get(
      `${BASE_URL}/salesBill/date/fiscalYear?fiscalYear=${fiscalYear}&companyId=${companyId}&branchId=${branchId}`
    );
  }

  getTodayTotalSalesBillTaxAmount(
    todayDate: string,
    companyId: number,
    branchId: number
  ): Observable<any> {
    return this.http.get(
      `${BASE_URL}/salesBill/date/tax/today?todayDate=${todayDate}&companyId=${companyId}&branchId=${branchId}`
    );
  }

  getThisMonthTotalSalesBillTaxAmount(
    month: string,
    companyId: number,
    branchId: number
  ): Observable<any> {
    return this.http.get(
      `${BASE_URL}/salesBill/date/tax/month?month=${month}&companyId=${companyId}&branchId=${branchId}`
    );
  }

  getThisFiscalYearTotalSalesBillTaxAmount(
    fiscalYear: string,
    companyId: number,
    branchId: number
  ): Observable<any> {
    return this.http.get(
      `${BASE_URL}/salesBill/date/tax/fiscalYear?fiscalYear=${fiscalYear}&companyId=${companyId}&branchId=${branchId}`
    );
  }

  changeFiscalYear(fiscalYear?: FiscalYear): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/fiscalYearInfo/createNewFiscalYear`;
    return this.http.post<RJResponse<number>>(url, fiscalYear);
  }

  getAllDebtors(companyId, branchId): Observable<RJResponse<SalesBill[]>> {
    let url = `${BASE_URL}/salesBill/debtors?companyId=${companyId}&branchId=${branchId}`;
    return this.http.get<RJResponse<SalesBill[]>>(url);
  }

  fetchDebtorsBillDetailByBillId(offset: number, searchInput: string, searchBy: string, debtorPan: number, companyId: number, branchId: number): Observable<RJResponse<SalesBill[]>> {
    let url = `${BASE_URL}/salesBill/debtors/billList/${debtorPan}?offset=${offset}&searchBy=${searchBy}&searchWildCard=${searchInput}&debtorPan=${debtorPan}&compId=${companyId}&branchId=${branchId}`;
    return this.http.get<RJResponse<SalesBill[]>>(url);
  }

  getLimitedDebtors(offset: number,
    pageTotalItems: number,
    searchBy: string,
    searchWildCard: string,
    sortBy: string,
    companyId: number,
    branchId: number,
    currentFiscalYear: string = '',
    salesTally:boolean = false): Observable<RJResponse<SalesBill[]>> {

    let url = `${BASE_URL}/salesBill/debtors`;
    const httpParams = new HttpParams()
      .set('compId', companyId)
      .set('branchId', branchId)
      .set('offset', offset)
      .set('pageTotalItems', pageTotalItems)
      .set('searchBy', searchBy)
      .set('searchWildCard', searchWildCard)
      .set('currentFiscalYear', currentFiscalYear)
      .set('salesTally', salesTally);
    return this.http.get<RJResponse<SalesBill[]>>(url, { params: httpParams });
  }

}
