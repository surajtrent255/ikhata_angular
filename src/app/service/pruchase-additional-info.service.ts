import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PurchaseAdditionalInfo } from '../models/PurchaseAdditionalInfo';
import { Observable } from 'rxjs';
import { BASE_URL } from '../constants/urls';
import { RJResponse } from '../models/rjresponse';

@Injectable({
  providedIn: 'root',
})
export class PruchaseAdditionalInfoService {
  constructor(private httpClient: HttpClient) {}

  addPurchaseAdditionalInfo(
    purachaseAdditionalInfo: PurchaseAdditionalInfo
  ): Observable<any> {
    return this.httpClient.post(
      `${BASE_URL}/api/v1/purchase/additionalInfo`,
      purachaseAdditionalInfo
    );
  }

  getPurchaseAdditionalInfoByBillNo(
    billNo: number
  ): Observable<RJResponse<PurchaseAdditionalInfo[]>> {
    return this.httpClient.get<RJResponse<PurchaseAdditionalInfo[]>>(
      `${BASE_URL}/api/v1/purchase/additionalInfo/billno?billNo=${billNo}`
    );
  }

  getPurchaseAdditionalAttributes(
    comapnyId: number
  ): Observable<RJResponse<PurchaseAdditionalInfo[]>> {
    return this.httpClient.get<RJResponse<PurchaseAdditionalInfo[]>>(
      `${BASE_URL}/api/v1/purchase/additionalInfo/attribute?companyId=${comapnyId}`
    );
  }

  addNewAttribute(attributeName: string, comapnyId: number): Observable<any> {
    return this.httpClient.post(
      `${BASE_URL}/api/v1/purchase/additionalInfo/add/attribute?attributeName=${attributeName}&companyId=${comapnyId}`,
      ''
    );
  }
}
