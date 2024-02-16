import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import {
  ADD_TO_MULTIPLE_ROLE_TABLE,
  ADD_TO_USER_ROLE_TABLE,
  ROLE_INFO_BASED_ON_COMPANYID,
  USER_UPDATE_STATUS_URL,
} from 'src/app/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  addToUserRole(
    userId: number,
    companyId: number,
    roleId: number
  ): Observable<any> {
    return this.http.post(
      `${ADD_TO_USER_ROLE_TABLE}?userId=${userId}&companyId=${companyId}&roleId=${roleId}`,
      ''
    );
  }

  addToMultipleUserRole(
    userId: number[],
    companyId: number,
    roleId: number
  ): Observable<any> {
    return this.http.post(
      `${ADD_TO_MULTIPLE_ROLE_TABLE}?userId=${userId}&companyId=${companyId}&roleId=${roleId}`,
      ''
    );
  }

  getUserRoleDetailsBasedOnCompanyIdAndUserId(
    companyId: number,
    userId: number
  ): Observable<any> {
    return this.http.get(
      `${ROLE_INFO_BASED_ON_COMPANYID}/${companyId}/${userId}`
    );
  }

  updateUserRoleStatus(
    status: string,
    userId: number,
    companyId: number,
    roleId: number
  ): Observable<any> {
    return this.http
      .post(
        `${USER_UPDATE_STATUS_URL}?status=${status}&userId=${userId}&companyId=${companyId}&roleId=${roleId}`,
        ''
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
}
