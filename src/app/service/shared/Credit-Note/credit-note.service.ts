import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CREDIT_NOTE } from 'src/app/constants/urls';
import { CreditNote } from 'src/app/models/Credit-Note/creditNote';
import { CreditNoteDetails } from 'src/app/models/Credit-Note/creditNoteDetails';
import { RJResponse } from 'src/app/models/rjresponse';

@Injectable({
  providedIn: 'root',
})
export class CreditNoteService {
  constructor(private http: HttpClient, private ToastrService: ToastrService) {}

  addCreditNote(creditNote: CreditNote): Observable<any> {
    return this.http.post(CREDIT_NOTE, creditNote).pipe(
      tap({
        next: (res) => {
          this.ToastrService.success('Successfully Added');
        },
        error: (err) => {
          this.ToastrService.error(err);
        },
      })
    );
  }

  addCreditNoteDetails(creditNoteDetails: CreditNoteDetails): Observable<any> {
    return this.http.post(`${CREDIT_NOTE}/details`, creditNoteDetails).pipe(
      tap({
        next: (res) => {
          this.ToastrService.success('Successfully Added');
        },
        error: (err) => {
          this.ToastrService.error(err);
        },
      })
    );
  }

  getCreditNote(
    companyId: number,
    branchId: number
  ): Observable<RJResponse<CreditNote[]>> {
    return this.http.get<RJResponse<CreditNote[]>>(
      `${CREDIT_NOTE}?companyId=${companyId}&branchId=${branchId}`
    );
  }

  getLimitedCreditNote(
    offset: number,
    pageTotalItems: number,
    compId: number,
    branchId: number
  ): Observable<RJResponse<CreditNote[]>> {
    let url = `${CREDIT_NOTE}/limited?offset=${offset}&pageTotalItems=${pageTotalItems}&compId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<CreditNote[]>>(url);
  }

  searchCreditNoteBySearchInput(
    offset: number,
    pageTotalItems: number,
    compId: number,
    searchInput: string,
    searchValue: string
  ): Observable<RJResponse<CreditNote[]>> {
    let url = `${CREDIT_NOTE}/searchBy?offset=${offset}&pageTotalItems=${pageTotalItems}&compId=${compId}&searchInput=${searchInput}&searchValue=${searchValue}`;
    return this.http.get<RJResponse<CreditNote[]>>(url);
  }

  searchCreditNoteByDate(
    offset: number,
    pageTotalItems: number,
    compId: number,
    date: Date
  ): Observable<RJResponse<CreditNote[]>> {
    let url = `${CREDIT_NOTE}/searchBy/date?offset=${offset}&pageTotalItems=${pageTotalItems}&compId=${compId}&date=${date}`;
    return this.http.get<RJResponse<CreditNote[]>>(url);
  }

  searchCreditNoteByDateBetween(
    offset: number,
    pageTotalItems: number,
    compId: number,
    startDate: String,
    endDate: String
  ): Observable<RJResponse<CreditNote[]>> {
    let url = `${CREDIT_NOTE}/searchBy/date/between?offset=${offset}&pageTotalItems=${pageTotalItems}&compId=${compId}&startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<RJResponse<CreditNote[]>>(url);
  }

  getCreditNoteDetails(
    billNumber: string
  ): Observable<RJResponse<CreditNoteDetails[]>> {
    return this.http.get<RJResponse<CreditNoteDetails[]>>(
      `${CREDIT_NOTE}/details?billNumber=${billNumber}`
    );
  }
}
