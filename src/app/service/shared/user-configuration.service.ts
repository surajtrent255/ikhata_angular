import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import {
  ASSIGN_COMPANY_TO_USER,
  BASE_URL,
  GET_ALL_ROLES,
  GET_ALL_USER,
  GET_ALL_USERS_FOR_SUPER_ADMIN_LISTING,
  GET_USERS_BY_COMPANYID,
  ROLE_INFO_BASED_ON_COMPANYID,
  UPDATE_USER_COMPANY_STATUS,
} from 'src/app/constants/urls';
import { RJResponse } from 'src/app/models/rjresponse';
import { UserConfiguration } from 'src/app/models/user-configuration';

@Injectable({
  providedIn: 'root',
})
export class UserConfigurationService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getUserRoleDetailsBasedOnCompanyId(companyId: number): Observable<any> {
    return this.http.get(`${ROLE_INFO_BASED_ON_COMPANYID}/${companyId}`);
  }

  getRoles(): Observable<any> {
    return this.http.get(GET_ALL_ROLES);
  }

  updateUserCompanyStatus(status: string, userId: number): Observable<any> {
    return this.http
      .post(
        `${UPDATE_USER_COMPANY_STATUS}?status=${status}&userId=${userId}`,
        'success'
      )
      .pipe(
        tap({
          next: (respone) => {
            console.log(respone);
          },
          error: (err) => {
            console.log(err);
          },
        })
      );
  }

  getAllUser(
    companyId: number,
    offset: number,
    pageTotalItems: number,
    searchInput: string
  ): Observable<any> {
    return this.http.get(
      `${GET_ALL_USER}?companyId=${companyId}&offset=${offset}&pageTotalItems=${pageTotalItems}&searchInput=${searchInput}`
    );
  }

  getUsersByCompanyId(companyId: number): Observable<any> {
    return this.http.get(`${GET_USERS_BY_COMPANYID}?companyId=${companyId}`);
  }

  assignCompanyToUser(companyId: number, userId: number[]): Observable<any> {
    console.log('assign controller is hit');
    return this.http.post(
      `${ASSIGN_COMPANY_TO_USER}?companyId=${companyId}&userId=${userId}`,
      ''
    );
  }

  getLimitedUsersForSearchInUserConfiguration(
    offset: number,
    pageTotalItems: number,
    companyId: number,
    searchInput: string
  ): Observable<any> {
    return this.http.get(
      `${BASE_URL}/api/v1/userconfig/search/users?offset=${offset}&pageTotalItems=${pageTotalItems}&compId=${companyId}&searchInput=${searchInput}`
    );
  }

  getLimitedUsersRoleForSearchInUserConfiguration(
    offset: number,
    pageTotalItems: number,
    companyId: number,
    searchInput: string
  ): Observable<any> {
    return this.http.get(
      `${BASE_URL}/api/v1/userconfig/search/users/role?offset=${offset}&pageTotalItems=${pageTotalItems}&compId=${companyId}&searchInput=${searchInput}`
    );
  }
}
