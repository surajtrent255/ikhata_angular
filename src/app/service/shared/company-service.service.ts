import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import {
  ADD_COMPANY_URL,
  BASE_URL,
  COMPANY_BASE_URL,
  USER_COMPANY_URL,
} from 'src/app/constants/urls';

import { Company } from 'src/app/models/company';
import { Logo } from 'src/app/models/company-logo/CompanyImage';
import { RJResponse } from 'src/app/models/rjresponse';
import { User } from 'src/app/models/user';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyServiceService {
  constructor(
    private httpClient: HttpClient,
    private toastrService: ToastrService,
    private loginService: LoginService
  ) {}

  getCompnayDetails(user_id: number): Observable<any> {
    return this.httpClient.get(`${USER_COMPANY_URL}/${user_id}`);
  }

  getCompnayDetailsByCompanyid(
    companyId: number
  ): Observable<RJResponse<Company>> {
    let url = `/api/v1/company/getById?${companyId}`;
    return this.httpClient.get<RJResponse<Company>>(url);
  }

  // updateUserCompany(comapanyId: number, userId: number): Observable<any> {
  //   const body = { comapanyId, userId };
  //   return this.httpClient.post(UPDATE_USER_COMPANY_URL, body);
  // }

  addCompany(companyDTO: Company, userId: number): Observable<any> {
    const body = { companyDTO: companyDTO, userId: userId };
    return this.httpClient.post(ADD_COMPANY_URL, body).pipe(
      tap({
        next: (respone) => {
          this.toastrService.success('Company Addded successfully added');
        },
        error: (err) => {
          console.log(err);
          this.toastrService.error('Something went wrong');
        },
      })
    );
  }

  getAllCompanies(): Observable<RJResponse<Company[]>> {
    return this.httpClient.get<RJResponse<Company[]>>(COMPANY_BASE_URL);
  }

  // addcompany(company: Company) {
  //   return this.httpClient.post(ADD_COMPANY_URL, company);
  // }

  getCustomerInfoByPanOrPhone(
    searchMethod: number,
    customerPhoneOrPan: number
  ): Observable<RJResponse<Company[]>> {
    let url = `${COMPANY_BASE_URL}/searchBy?searchMethod=${searchMethod}&customerPhoneOrPan=${customerPhoneOrPan}`;
    console.log(url);
    return this.httpClient.get<RJResponse<Company[]>>(url);
  }

  fetchLimitedCustomer(
    offset: number,
    pageTotalItems: number,
    searchBy: string,
    searchWildCard: string,
    sortBy: string,
    compId: number,
    branchId: number
  ): Observable<RJResponse<Company[]>> {
    let url = `${BASE_URL}/api/v1/company/customers?offset=${offset}&pageTotalItems=${pageTotalItems}&searchBy=${searchBy}&searchWildCard=${searchWildCard}&sortBy=${sortBy}&companyId=${compId}&branchId=${branchId}`;
    return this.httpClient.get<RJResponse<Company[]>>(url);
  }
  // company Logo

  getCompanyLogo(companyId: number): Observable<RJResponse<Logo>> {
    return this.httpClient.get<RJResponse<Logo>>(
      `${COMPANY_BASE_URL}/image?companyId=${companyId}`
    );
  }

  addCompanyLogo(file: File, companyId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('companyId', String(companyId));
    return this.httpClient
      .post(`${COMPANY_BASE_URL}/logo/upload`, formData)
      .pipe(
        tap({
          next: (respone) => {
            this.toastrService.success('Logo Successfully Addded');
          },
          error: (err) => {
            console.log(err);
            this.toastrService.error('Something Went Wrong');
          },
        })
      );
  }

  editLogo(file: File, companyId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('companyId', String(companyId));
    return this.httpClient.put(
      `${COMPANY_BASE_URL}/edit/companyLogo`,
      formData
    );
  }

  editCompany(comapanyDTO: Company): Observable<any> {
    return this.httpClient.put(`${COMPANY_BASE_URL}/edit`, comapanyDTO);
  }

  getCompanyByPanNo(panNo: number): Observable<RJResponse<Company>> {
    return this.httpClient.get<RJResponse<Company>>(
      `${COMPANY_BASE_URL}/panNo?panNo=${panNo}`
    );
  }

  customerAddedToday(todayDate: string, companyId: number): Observable<any> {
    return this.httpClient.get(
      `${COMPANY_BASE_URL}/date/today?todayDate=${todayDate}&companyId=${companyId}`
    );
  }

  customerAddedThisMonth(month: string, companyId: number): Observable<any> {
    return this.httpClient.get(
      `${COMPANY_BASE_URL}/date/month?month=${month}&companyId=${companyId}`
    );
  }

  customerAddedThisYear(
    fiscalYear: string,
    companyId: number
  ): Observable<any> {
    return this.httpClient.get(
      `${COMPANY_BASE_URL}/date/fiscalYear?fiscalYear=${fiscalYear}&companyId=${companyId}`
    );
  }

  getSingleCompany(id: number): Observable<RJResponse<Company>>{
    return this.httpClient.get<RJResponse<Company>>(`${BASE_URL}/api/v1/company/single?id=${id}`);
  }
}
