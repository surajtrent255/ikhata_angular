import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GET_ALL_PROVINCE,
  GET_DISTRICT_BY_PROVINCEID,
  GET_MUNICIPALITY,
} from 'src/app/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class DistrictAndProvinceService {
  constructor(private http: HttpClient) {}

  getAllProvince(): Observable<any> {
    return this.http.get(GET_ALL_PROVINCE);
  }

  getDistrictByProvinceId(provinceId: number): Observable<any> {
    return this.http.get(`${GET_DISTRICT_BY_PROVINCEID}/${provinceId}`);
  }

  getAllmunicipality(provinceId: number, districtId: number): Observable<any> {
    return this.http.get(`${GET_MUNICIPALITY}/${provinceId}/${districtId}`);
  }
}
