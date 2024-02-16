import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from 'src/app/constants/urls';
import { VatRateTypes } from 'src/app/models/VatRateTypes';
import { RJResponse } from 'src/app/models/rjresponse';
@Injectable({
  providedIn: 'root'
})
export class VatRateTypesService {

  constructor(private http: HttpClient) { }
  url = "vatRateType";
  getAllVatRateTypes(): Observable<RJResponse<VatRateTypes[]>> {
    let url = `${BASE_URL}/${this.url}`;
    console.log("url = " + url)
    return this.http.get<RJResponse<VatRateTypes[]>>(url);
  }
}
