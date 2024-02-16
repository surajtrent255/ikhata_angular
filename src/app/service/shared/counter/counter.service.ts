import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { COUNTER_DETAILS } from 'src/app/constants/urls';
import { Counter } from 'src/app/models/counter/Counter';
import { UserCounter } from 'src/app/models/counter/UserCounter';
import { RJResponse } from 'src/app/models/rjresponse';
import { UserConfiguration } from 'src/app/models/user-configuration';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getCounterDetails(companyId): Observable<RJResponse<Counter[]>> {
    return this.http.get<RJResponse<Counter[]>>(
      `${COUNTER_DETAILS}/${companyId}`
    );
  }

  addCounterDetails(counter: Counter): Observable<any> {
    return this.http.post(COUNTER_DETAILS, counter).pipe(
      tap({
        next: (res) => {
          console.log(res);
          this.toastrService.success('Data SuccessFully Addded');
        },
        error: (err) => {
          console.log(err);
          this.toastrService.error('Something Went Wrong');
        },
      })
    );
  }

  enableDisableCounter(status: boolean, id: number): Observable<any> {
    return this.http
      .put(`${COUNTER_DETAILS}/update?status=${status}&id=${id}`, '')
      .pipe(
        tap({
          next: (res) => {
            console.log(res);
            this.toastrService.success('Status Changed Successfully');
          },
          error: (err) => {
            console.log(err);
            this.toastrService.error('Something Went Wrong');
          },
        })
      );
  }

  getUsersForAssignCounter(
    companyId: number,
    branchId: number
  ): Observable<RJResponse<UserConfiguration[]>> {
    return this.http.get<RJResponse<UserConfiguration[]>>(
      `${COUNTER_DETAILS}/get/users?companyId=${companyId}&branchId=${branchId}`
    );
  }

  assignUsersToCounter(counter: Counter): Observable<any> {
    return this.http.post(`${COUNTER_DETAILS}/assign/users`, counter).pipe(
      tap({
        next: (res) => {
          console.log(res);
          this.toastrService.success('Counter Successfully Assigned');
        },
        error: (err) => {
          console.log(err);
          this.toastrService.error('Something Went Wrong');
        },
      })
    );
  }

  // for counter user listing
  getUsersForCounterListing(
    companyId: number
  ): Observable<RJResponse<UserCounter[]>> {
    return this.http.get<RJResponse<UserCounter[]>>(
      `${COUNTER_DETAILS}/get/users/forListing/${companyId}`
    );
  }

  updateUserStatusInCounter(
    status: boolean,
    userId: number,
    counterId: number
  ): Observable<any> {
    return this.http
      .put(
        `${COUNTER_DETAILS}/update/user/counter/status?status=${status}&userId=${userId}&counterId=${counterId}`,
        ''
      )
      .pipe(
        tap({
          next: (res) => {
            this.toastrService.success('Status Changed Successfully');
          },
          error: (err) => {
            this.toastrService.error('Something Wnet wrong');
          },
        })
      );
  }

  getUserCounterDetailsForLocalStorage(
    companyId: number,
    userId: number
  ): Observable<RJResponse<Counter[]>> {
    return this.http.get<RJResponse<Counter[]>>(
      `${COUNTER_DETAILS}/for/localStorage?companyId=${companyId}&userId=${userId}`
    );
  }
}
