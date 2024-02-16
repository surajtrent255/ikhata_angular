import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { FEATURE_CONTROL } from 'src/app/constants/urls';
import { FeatureControl } from 'src/app/models/Feature Control/feature-control';
import { UserFeature } from 'src/app/models/Feature Control/user-feature';
import { RJResponse } from 'src/app/models/rjresponse';

@Injectable({
  providedIn: 'root',
})
export class FeatureControlService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getFeatureControls(): Observable<RJResponse<FeatureControl[]>> {
    return this.http.get<RJResponse<FeatureControl[]>>(FEATURE_CONTROL);
  }

  assignFeatureControlToUser(
    featureId: number[],
    userId: number,
    companyId: number
  ) {
    return this.http
      .post(
        `${FEATURE_CONTROL}?featureId=${featureId}&userId=${userId}&companyId=${companyId}`,
        ''
      )
      .pipe(
        tap({
          next: (res) => {
            console.log(res);
            this.toastrService.success('Feature Assigned Successfully');
          },
          error: (err) => {
            console.log(err);
            this.toastrService.error('Something Went Wrong');
          },
        })
      );
  }

  getFeatureControlOfUsersForListing(
    companyId: number
  ): Observable<RJResponse<UserFeature[]>> {
    return this.http.get<RJResponse<UserFeature[]>>(
      `${FEATURE_CONTROL}/${companyId}`
    );
  }

  enableDisableFeatureControlForUser(
    userId: number,
    status: boolean,
    featureId: number
  ): Observable<any> {
    return this.http.put(
      `${FEATURE_CONTROL}?userId=${userId}&status=${status}&featureId=${featureId}`,
      ''
    );
  }

  getAllFeatureControlOfUserByUserId(
    companyId: number,
    userId: number
  ): Observable<RJResponse<UserFeature[]>> {
    return this.http.get<RJResponse<UserFeature[]>>(
      `${FEATURE_CONTROL}/user?companyId=${companyId}&userId=${userId}`
    );
  }

  getFeatureControlDetailsForLocalStorage(
    companyId: number,
    userId: number
  ): Observable<any> {
    return this.http.get(
      `${FEATURE_CONTROL}/for/localStorage?companyId=${companyId}&userId=${userId}`
    );
  }

  getLimitedUserFeatureForSearch(
    offset: number,
    pageTotalItems: number,
    companyId: number,
    searchInput: string
  ): Observable<RJResponse<UserFeature[]>> {
    return this.http.get<RJResponse<UserFeature[]>>(
      `${FEATURE_CONTROL}/for/search?offset=${offset}&pageTotalItems=${pageTotalItems}&companyId=${companyId}&searchInput=${searchInput}`
    );
  }
}
