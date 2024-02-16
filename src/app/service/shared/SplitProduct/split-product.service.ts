import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { BASE_URL } from 'src/app/constants/urls';
import { SplitProduct } from 'src/app/models/SplitProduct';
import { RJResponse } from 'src/app/models/rjresponse';

@Injectable({
  providedIn: 'root',
})
export class SplitProductService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}
  getAllSplitProduct(companyId: number, branchId: number): Observable<any> {
    return this.http.get(
      `${BASE_URL}` + `/split` + `?companyid=${companyId}&branchid=${branchId}`
    );
  }

  getLimitedSplitProduct(
    offset: number,
    pageTotalItems: number,
    compId: number,
    branchId: number
  ): Observable<RJResponse<SplitProduct[]>> {
    let url = `${BASE_URL}/split/company/limited?offset=${offset}&pageTotalItems=${pageTotalItems}&compId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<SplitProduct[]>>(url);
  }

  addSplitProduct(splitProducts: SplitProduct): Observable<any> {
    console.log(JSON.stringify(splitProducts));
    return this.http.post(`${BASE_URL}` + `/split`, splitProducts).pipe(
      tap({
        next: (response) => {
          this.toastrService.success('splitProducts Added Successfully');
          console.log(response);
        },
        error: (error) => {
          console.log(error);
          this.toastrService.error('splitProducts Adding Failed');
        },
      })
    );
  }
  getSplitProductById(productId: number): Observable<any> {
    console.log(`${BASE_URL}/split/id/${productId}`);
    return this.http.get(`${BASE_URL}` + `/split/id/${productId}`);
  }

  splitAgain(SplitProductObj: SplitProduct) {
    return this.http.put(`${BASE_URL}/split/splitAgain`, SplitProductObj);
  }

  Merge(SplitProductObj: SplitProduct) {
    return this.http.put(`${BASE_URL}/split/merge`, SplitProductObj);
  }
}
