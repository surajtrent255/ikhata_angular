import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { BASE_URL } from 'src/app/constants/urls';
import { MergeProduct } from 'src/app/models/MergeProduct';

@Injectable({
  providedIn: 'root'
})
export class MergeProductService {

  constructor(private http: HttpClient, private toastrService: ToastrService) { }
  getAllMergeProduct(companyId: number, branchId: number): Observable<any> {
    return this.http.get(`${BASE_URL}`+`/merge/`+`${companyId}/${companyId}?companyid=${companyId}&branchid=${branchId}`);
  }


  addMergeProduct(MergeProduct :MergeProduct): Observable<any> {
    return this.http.post(`${BASE_URL}`+`/merge`, MergeProduct).pipe(
      tap({
        next: (response) => {
          this.toastrService.success('MergeProduct Added Successfully');
          console.log(response)
        },
        error: (error) => {
          console.log(error);
          this.toastrService.error('MergeProduct Adding Failed');
        },
      })
    );
  }
  
  getAllSplitProductByProductId(productId:number): Observable<any> {
    return this.http.get(`${BASE_URL}`+`/split/`+`${productId}?productId=${productId}`);
  }
  
}
