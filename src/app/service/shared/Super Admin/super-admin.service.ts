import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BASE_URL,
  GET_ALL_USERS_FOR_SUPER_ADMIN_LISTING,
} from 'src/app/constants/urls';
import { Company } from 'src/app/models/company';
import { RJResponse } from 'src/app/models/rjresponse';
import { UserConfiguration } from 'src/app/models/user-configuration';

@Injectable({
  providedIn: 'root',
})
export class SuperAdminService {
  constructor(private http: HttpClient) {}

  getAllUsersForSuperAdminListing(
    offset: number,
    pageTotalItems: number,
    searchInput: string
  ): Observable<RJResponse<UserConfiguration[]>> {
    return this.http.get<RJResponse<UserConfiguration[]>>(
      `${GET_ALL_USERS_FOR_SUPER_ADMIN_LISTING}?offset=${offset}&pageTotalItems=${pageTotalItems}&searchInput=${searchInput}`
    );
  }

  assignAdminRoleBySuperAdmin(userId: number): Observable<any> {
    return this.http.put(
      `${BASE_URL}/api/v1/userconfig/superAdmin/assign?userId=${userId}`,
      ''
    );
  }

  updateUserStatusFromSuperAdmin(
    status: boolean,
    userId: number
  ): Observable<any> {
    return this.http.put(
      `${BASE_URL}/api/v1/userconfig/superAdmin?status=${status}&userId=${userId}`,
      ''
    );
  }

  getCompanyDetailsOfUserForSuperAdmin(
    userId: number
  ): Observable<RJResponse<Company[]>> {
    return this.http.get<RJResponse<Company[]>>(
      `${BASE_URL}/api/v1/superAdmin?userId=${userId}`
    );
  }

  allowDisallowToProceedBySuperAdmin(
    companyId: number,
    status: boolean
  ): Observable<any> {
    return this.http.put(
      `${BASE_URL}/api/v1/superAdmin?companyId=${companyId}&status=${status}`,
      ''
    );
  }

  getAllCompaniesWithNoUsers(
    offset: number,
    pageTotalItems: number,
    searchWildCard: string,
    sortBy: string
  ): Observable<RJResponse<Company[]>> {
    let url = `${BASE_URL}/api/v1/superAdmin/noUserCompany`;
    const httpParams = new HttpParams()
      .set('offset', offset)
      .set('pageTotalItems', pageTotalItems)
      .set('searchWildCard', searchWildCard)
      .set('sortBy', sortBy);

    return this.http.get<RJResponse<Company[]>>(url, { params: httpParams });
  }

  assignUserWithNoCompany(companyId: number, userId: number): Observable<any> {
    return this.http.put(
      `${BASE_URL}/api/v1/superAdmin/assign/company/existing/user?companyId=${companyId}&userId=${userId}`,
      ''
    );
  }
}
