import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DEBIT_NOTE } from 'src/app/constants/urls';
import { DebitNote } from 'src/app/models/Debit-Note/debitNote';
import { DebitNoteDetails } from 'src/app/models/Debit-Note/debitNoteDetails';
import { RJResponse } from 'src/app/models/rjresponse';

@Injectable({
  providedIn: 'root',
})
export class DebitNoteService {
  constructor(private http: HttpClient, private ToastrService: ToastrService) {}

  addDebitNote(debitNote: DebitNote): Observable<any> {
    return this.http.post(DEBIT_NOTE, debitNote).pipe(
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

  addDebitNoteDetails(debitNotedetails: DebitNoteDetails): Observable<any> {
    return this.http.post(`${DEBIT_NOTE}/details`, debitNotedetails).pipe(
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

  getDebitNotes(
    companyId: number,
    branchId: number
  ): Observable<RJResponse<DebitNote[]>> {
    return this.http.get<RJResponse<DebitNote[]>>(
      `${DEBIT_NOTE}?companyId=${companyId}&branchId=${branchId}`
    );
  }

  getLimitedDebitNotes(
    offset: number,
    pageTotalItems: number,
    compId: number,
    branchId: number
  ): Observable<RJResponse<DebitNote[]>> {
    let url = `${DEBIT_NOTE}/limited?offset=${offset}&pageTotalItems=${pageTotalItems}&compId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<DebitNote[]>>(url);
  }

  searchDebitNoteBySearchInput(
    offset: number,
    pageTotalItems: number,
    compId: number,
    searchInput: string,
    searchValue: string
  ): Observable<RJResponse<DebitNote[]>> {
    let url = `${DEBIT_NOTE}/searchBy?offset=${offset}&pageTotalItems=${pageTotalItems}&compId=${compId}&searchInput=${searchInput}&searchValue=${searchValue}`;
    return this.http.get<RJResponse<DebitNote[]>>(url);
  }

  getDebitNoteDetails(
    billNumber: number
  ): Observable<RJResponse<DebitNoteDetails[]>> {
    return this.http.get<RJResponse<DebitNoteDetails[]>>(
      `${DEBIT_NOTE}/details?billNumber=${billNumber}`
    );
  }
}
