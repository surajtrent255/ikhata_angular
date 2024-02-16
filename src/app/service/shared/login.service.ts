import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import {
  BASE_URL,
  USER_LOGIN_URL,
  USER_REGISTER_URL,
} from 'src/app/constants/urls';
import { UserLogin } from 'src/app/interfaces/user-login';
import { RJResponse } from 'src/app/models/rjresponse';
import { ToastrService } from 'ngx-toastr';

import { User } from 'src/app/models/user';
import { IUserRegistration } from 'src/app/interfaces/iuser-registration';
import { Company } from 'src/app/models/company';
import { UserFeature } from 'src/app/models/UserFeatures';
import { CommonService } from './common/common.service';

const USER_KEY = 'User';
const USER_TOKEN = 'UserToken';
const COMPANY_KEY = 'Company';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private userSubject = new BehaviorSubject<User>(
    this.getUserFromLocalStorage()
  );

  public userObservable: Observable<User>;

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private commonService: CommonService
  ) {
    this.userObservable = this.userSubject.asObservable();
  }

  public get currentUser(): User {
    return this.userSubject.value;
  }

  getUserId(): number {
    return this.userSubject.value.user.id;
  }

  // rought
  getCompnayId(): number {
    const debryptedCompanyDetails = this.commonService.decryptUsingAES256(
      String(localStorage.getItem('companyDetails')!)
    );
    var compnay: any = debryptedCompanyDetails;
    return compnay.companyId;
  }

  getBranchId(): number {
    const debryptedBranchDetails = this.commonService.decryptUsingAES256(
      String(localStorage.getItem('BranchDetails')!)
    );
    var branchDetail: any = debryptedBranchDetails;
    var branchId = branchDetail[0].branchId;
    return branchId;
  }

  login(userLogin: UserLogin): Observable<RJResponse<User>> {
    return this.http.post<RJResponse<User>>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (response) => {
          this.setUserToLocalStorage(response.data);
          this.setUserTokenToLocalStorage(response.data.token);
          this.userSubject.next(response.data);
          this.toastrService.success(
            `Welcome to Iaccounting ${response.data.user.firstname}!`,
            'Login Successful'
          );
        },
        error: (errorResponse) => {
          this.toastrService.error('Login Failed Please Try Again');
        },
      })
    );
  }

  register(registerData: IUserRegistration): Observable<RJResponse<User>> {
    return this.http
      .post<RJResponse<User>>(USER_REGISTER_URL, registerData)
      .pipe(
        tap({
          next: (response) => {
            this.toastrService.success(
              `User Successfully Added`,
              `Register Successful`
            );
          },
          error: (err) => {
            this.toastrService.error(err.error, 'Registration Failed');
          },
        })
      );
  }

  private setUserToLocalStorage(user: User) {
    const encryptedUser = this.commonService.encryptUsingAES256(user);
    localStorage.setItem(USER_KEY, encryptedUser);
  }

  private setUserTokenToLocalStorage(token: string) {
    localStorage.setItem(USER_TOKEN, JSON.stringify(token));
  }

  private getUserFromLocalStorage(): User {
    const decryptedUser = this.commonService.decryptUsingAES256(
      localStorage.getItem(USER_KEY)!
    );
    const userJson = decryptedUser;
    if (userJson) return userJson as User;
    return new User();
  }

  logout() {
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('companyDetails');
    localStorage.removeItem('BranchDetails');
    localStorage.removeItem('Company');
    localStorage.removeItem(USER_TOKEN);
    localStorage.removeItem('CompanyRoles');
    localStorage.removeItem('User_Couter_Details');
    localStorage.removeItem('User_Features');
  }

  getCounterId() {
    const debryptedCounterDetails = this.commonService.decryptUsingAES256(
      String(localStorage.getItem('User_Couter_Details')!)
    );
    const userCounter = debryptedCounterDetails;
    return userCounter[0].counterId;
  }

  getFeatureObjs(): UserFeature[] {
    const debryptedFeature = this.commonService.decryptUsingAES256(
      String(localStorage.getItem('User_Features')!)
    );
    const featureObjs: UserFeature[] = debryptedFeature;
    return featureObjs;
  }

  getCompanyRoles() {
    const debryptedCompanyRoles = this.commonService.decryptUsingAES256(
      String(localStorage.getItem('CompanyRoles')!)
    );
    const companyRolesObj = debryptedCompanyRoles;
    return companyRolesObj;
  }

  getCompany() {
    const debryptedCompanyDetails = this.commonService.decryptUsingAES256(
      String(localStorage.getItem('companyDetails')!)
    );
    var company: any = debryptedCompanyDetails;
    return company;
  }

  enterEmailForForgotPassword(email: string) {
    let url = `${BASE_URL}/api/v1/auth/enterEmailForForgotPassword`;
    let emailBody = { email: email };
    return this.http.post(url, emailBody);
  }

  resetPassword(mapInfo: Map<string, string>): Observable<RJResponse<string>> {
    let resetInfo = {
      token: mapInfo.get('token'),
      newPassword: mapInfo.get('newPassword'),
      email: mapInfo.get('email'),
    };
    let url = `${BASE_URL}/api/v1/auth/reset-password`;
    return this.http.post<RJResponse<string>>(url, resetInfo);
  }
}
