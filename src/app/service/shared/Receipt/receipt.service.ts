import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { RECEIPT_URL } from 'src/app/constants/urls';
import { Receipts } from 'src/app/models/Receipt';
import { RJResponse } from 'src/app/models/rjresponse';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  constructor(private http: HttpClient, private toastrService: ToastrService) { }

  getReceipts(companyId: number): Observable<RJResponse<Receipts[]>> {
    return this.http.get<RJResponse<Receipts[]>>(`${RECEIPT_URL}/${companyId}`);
  }

  getLimitedReceipts(offset: number, pageTotalItems: number, compId: number, branchId: number): Observable<RJResponse<Receipts[]>> {
    let url = `${RECEIPT_URL}/limited?offset=${offset}&pageTotalItems=${pageTotalItems}&compId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<Receipts[]>>(url);
  }
  addReceipts(receipt: Receipts): Observable<any> {
    return this.http.post(RECEIPT_URL, receipt).pipe(
      tap({
        next: (res) => {
          this.toastrService.success('Successfully Added');
        },
        error: (err) => {
          this.toastrService.error(err);
        },
      })
    );
  }

  deleteReceipt(SN: number) {
    return this.http.delete(`${RECEIPT_URL}/${SN}`);
  }
}
