import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../constants/urls';
import { InventoryProducts } from '../models/InventoryProducts';
import { Product } from '../models/Product';
import { RJResponse } from '../models/rjresponse';
import { VatRateTypes } from '../models/VatRateTypes';
import { Unit } from '../models/Unit';
import { PaginationCustom } from '../interfaces/PaginatinCustom';
import { LoginService } from './shared/login.service';
const productURL = 'product';
const endpoint = 'https://jsonplaceholder.typicode.com/posts';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  compId: number = 0;
  branchId: number = 0;

  constructor(private httpClient: HttpClient, private loginService:LoginService) {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
   }

  addNewProduct(product: Product, totalQty: number): Observable<any> {
    let url = `${BASE_URL}/${productURL}?stockqty=${totalQty}`;
    return this.httpClient.post(url, product);
  }

  getAllProducts(
    compId: number,
    branchId: number
  ): Observable<RJResponse<Product[]>> {
    let url = `${BASE_URL}/${productURL}?compId=${compId}&branchId=${branchId}`;
    return this.httpClient.get<RJResponse<Product[]>>(url);
  }

  getLimitedProducts(
    offset: number,
    pageTotalItems: number,
    searchBy: string,
    searchWildCard: string,
    sortBy: string,
    compId: number,
    branchId: number
  ): Observable<RJResponse<Product[]>> {
    let url = `${BASE_URL}/${productURL}/limited?offset=${offset}&pageTotalItems=${pageTotalItems}&searchBy=${searchBy}&searchWildCard=${searchWildCard}&sortBy=${sortBy}&compId=${compId}&branchId=${branchId}`;
    return this.httpClient.get<RJResponse<Product[]>>(url);
  }

  getProductById(
    id: number,
    searchByBarCode: boolean
  ): Observable<RJResponse<Product>> {
    let url = `${BASE_URL}/product/${id}?compId=${this.compId}&branchId=${this.branchId}&searchByBarCode=${searchByBarCode}`;
    return this.httpClient.get<RJResponse<Product>>(url);
  }

  getProductByWildCardName(
    name: string,
    compId: number,
    branchId: number
  ): Observable<RJResponse<Product[]>> {
    let url = `${BASE_URL}/product/searchByWildCard?name=${name}&compId=${compId}&branchId=${branchId}`;
    return this.httpClient.get<RJResponse<Product[]>>(url);
  }

  getProductForSearch(
    compId: number,
    branchId: number,
    search: string
  ): Observable<RJResponse<Product[]>> {
    let url = `${BASE_URL}/product/search?compId=${compId}&branchId=${branchId}&search=${search}`;
    return this.httpClient.get<RJResponse<Product[]>>(url);
  }

  getAllProductsForInventory(
    companyId: number
  ): Observable<RJResponse<InventoryProducts[]>> {
    let url = `${BASE_URL}/${productURL}/inventory?companyId=${companyId}`;
    return this.httpClient.get<RJResponse<InventoryProducts[]>>(url);
  }

  editProduct(productInfo: Product) {
    let url = `${BASE_URL}/${productURL}/${productInfo.id}`;
    return this.httpClient.put(url, productInfo);
  }

  deleteProductById(id: number) {
    let url = `${BASE_URL}/product/${id}`;
    return this.httpClient.delete(url);
  }

  getProductsByProductIds(
    productsIds: number[]
  ): Observable<RJResponse<Product[]>> {
    let url = `${BASE_URL}/product/getProductsByIds?productsIds=${productsIds}`;
    return this.httpClient.get<RJResponse<Product[]>>(url);
  }

  getAllVatRateTypes(): Observable<RJResponse<VatRateTypes[]>> {
    let url = `${BASE_URL}/vatRateType`;
    // console.log("url = " + url)
    // console.log(this.httpClient.get<RJResponse<VatRateTypes[]>>(url));
    return this.httpClient.get<RJResponse<VatRateTypes[]>>(url);
  }
  getAllUnit(): Observable<RJResponse<Unit[]>> {
    let url = `${BASE_URL}/unit`;
    return this.httpClient.get<RJResponse<Unit[]>>(url);
  }

  getAllPosts(): Observable<any> {
    return this.httpClient.get(endpoint);
  }
}
