import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import {
  ASSIGN_BRANCH_TO_USER,
  ENABLE_DISABLE_BRANCH_USER,
  GET_BRANCH_DETAILS,
  GET_BRANCH_DETAILS_BY_USERID_COMPANYID,
  GET_BRANCH_USERS,
  GET_USER_FOR_ASSIGN_BRANCH_LIST,
} from 'src/app/constants/urls';
import { Branch } from 'src/app/models/Branch';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getBranchDetails(companyId: number): Observable<any> {
    return this.http.get(`${GET_BRANCH_DETAILS}?companyId=${companyId}`);
  }

  addBranch(branch: Branch): Observable<any> {
    return this.http.post(GET_BRANCH_DETAILS, branch).pipe(
      tap({
        next: (response) => {
          this.toastrService.success('Branch Added Successfully');
        },
        error: (error) => {
          console.log(error);
          this.toastrService.error('Branch Adding Failed');
        },
      })
    );
  }

  AssignBranchToUser(
    userId: number,
    branchId: number,
    companyId: number
  ): Observable<any> {
    const body = {
      id: 0,
      userId: userId,
      branchId: branchId,
      companyId: companyId,
      status: true,
    };

    return this.http.post(ASSIGN_BRANCH_TO_USER, body).pipe(
      tap({
        next: (response) => {
          this.toastrService.success('Branch Assigned Successfully');
        },
        error: (error) => {
          console.log(error);
          this.toastrService.error('Branch Assign Failed');
        },
      })
    );
  }

  getBranchDetailsByCompanyAndUserId(
    compayId: number,
    userId: number
  ): Observable<any> {
    return this.http.get(
      `${GET_BRANCH_DETAILS_BY_USERID_COMPANYID}?companyId=${compayId}&userId=${userId}`
    );
  }

  getBranchUsersByCompanyId(companyId: number): Observable<any> {
    return this.http.get(`${GET_BRANCH_USERS}?companyId=${companyId}`);
  }

  enableDisableUser(
    status: boolean,
    userId: number,
    companyId: number,
    branchId: number
  ): Observable<any> {
    return this.http.put(
      `${ENABLE_DISABLE_BRANCH_USER}?status=${status}&userId=${userId}&companyId=${companyId}&branchId=${branchId}`,
      ''
    );
  }

  getUserForAssignBranchList(companyId: number): Observable<any> {
    return this.http.get(
      `${GET_USER_FOR_ASSIGN_BRANCH_LIST}?companyId=${companyId}`
    );
  }
}
