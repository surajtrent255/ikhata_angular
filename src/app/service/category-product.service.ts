import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../constants/urls';
import { CategoryProduct } from '../models/CategoryProduct';
import { RJResponse } from '../models/rjresponse';
import { LoginService } from './shared/login.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryProductService {
  compId = 0;
  branchId = 0;
  constructor(private http: HttpClient, private loginService: LoginService) {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
   }

  getAllCategories(compId: number, branchId: number): Observable<RJResponse<CategoryProduct[]>> {
    let url = `${BASE_URL}/category/all?compId=${compId}&branchId=${branchId}`;
    return this.http.get<RJResponse<CategoryProduct[]>>(url);
  }

  addNewCategory(category: CategoryProduct): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/category`;
    return this.http.post<RJResponse<number>>(url, category);
  }

  deleteCategory(id: number) {
    let url = `${BASE_URL}/category/${id}?compId=${this.compId}&branchId=${this.branchId}`;
    return this.http.delete(url);
  }

  getSingleCategory(catid: number){
    let url = `${BASE_URL}/category/single/${catid}?compId=${this.compId}&branchId=${this.branchId}`;
    return this.http.get<RJResponse<CategoryProduct>>(url);
  }
}
