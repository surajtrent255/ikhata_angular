import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from 'src/app/constants/urls';
import { RJResponse } from 'src/app/models/rjresponse';
import { Stock } from 'src/app/models/Stock';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  fetchstock: Stock[] = [];

  constructor(private httpClient: HttpClient) {}

  getStockWithProdIdAndCompanyId(
    prodId: number,
    compId: number
  ): Observable<RJResponse<Stock>> {
    let url = `${BASE_URL}/stock?prodId=${prodId}&compId=${compId}`;
    return this.httpClient.get<RJResponse<Stock>>(url);
  }
  getStockWithProdId(prodId: number): Observable<RJResponse<Stock>> {
    let url = `${BASE_URL}/stock/product/${prodId}`;
    return this.httpClient.get<RJResponse<Stock>>(url);
  }

  updateStockWithProdIdAndCompanyId(stock: Stock) {
    let url = `${BASE_URL}/stock`;
    return this.httpClient.put(url, stock);
  }
  updateStockWithProdId(Id: number, stock: Stock) {
    let url = `${BASE_URL}/stock/${Id}`;
    return this.httpClient.put(url, stock);
  }

  addStock(stock: Stock) {
    let url = `${BASE_URL}/stock`;
    return this.httpClient.post(url, stock);
  }

  getTopFiveStock(): Observable<any> {
    return this.httpClient.get(`${BASE_URL}/stock/top`);
  }

  getLastFiveStock(): Observable<any> {
    return this.httpClient.get(`${BASE_URL}/stock/last`);
  }
}
