import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Roles } from 'src/app/models/Roles';
import { Company } from 'src/app/models/company';
import { Logo } from 'src/app/models/company-logo/CompanyImage';
import { FeatureControlService } from 'src/app/service/shared/Feature-Control/feature-control.service';
import { BranchService } from 'src/app/service/shared/branch.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { CounterService } from 'src/app/service/shared/counter/counter.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { RoleService } from 'src/app/service/shared/role.service';

@Component({
  selector: 'app-select-company',
  templateUrl: './select-company.component.html',
  styleUrls: ['./select-company.component.css'],
})
export class SelectCompanyComponent {
  IsAdmin!: boolean;
  user_id!: number;
  companyId!: number;
  companyLogo!: Logo;
  company!: Company[];
  role!: Roles[];
  roles: string[] = [];

  // Register Popup
  initCreateNewCompanyPopUp!: boolean;

  constructor(
    private companyService: CompanyServiceService,
    private loginService: LoginService,
    private router: Router,
    private branchService: BranchService,
    private roleService: RoleService,
    private featureControlService: FeatureControlService,
    private counterService: CounterService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.initCreateNewCompanyPopUp = false;
    this.loginService.userObservable.subscribe((LogggedInUser) => {
      this.user_id = LogggedInUser.user.id;

      this.IsAdmin = LogggedInUser.user.roles.some(
        (role) => role.role === 'ADMIN'
      );
    });

    this.getCompanyDetails();
  }

  initCreateCompanyPopUp() {
    this.initCreateNewCompanyPopUp = true;
  }

  resetCreateCompanyPopup() {
    this.initCreateNewCompanyPopUp = !this.initCreateNewCompanyPopUp;
  }
  getCompanyDetails() {
    this.companyService.getCompnayDetails(this.user_id).subscribe((res) => {
      this.company = res.data;
    });
  }

  proceed(company: Company) {
    const encryptedCompanyDetails =
      this.commonService.encryptUsingAES256(company);
    localStorage.setItem('companyDetails', encryptedCompanyDetails);
    this.branchService
      .getBranchDetailsByCompanyAndUserId(company.companyId, this.user_id)
      .subscribe((res) => {
        if (res.data) {
          const encryptedBranchDetails = this.commonService.encryptUsingAES256(
            res.data
          );
          localStorage.setItem('BranchDetails', encryptedBranchDetails);
        }
        if (!res.data || Object.keys(res.data).length === 0) {
          let branchStatus = [{ branchId: 0 }];
          const encryptedBranchDetails =
            this.commonService.encryptUsingAES256(branchStatus);
          localStorage.setItem('BranchDetails', encryptedBranchDetails);
        }

        this.roleService
          .getUserRoleDetailsBasedOnCompanyIdAndUserId(
            company.companyId,
            this.user_id
          )
          .subscribe((res) => {
            const roles = res.data.map((user) => user.role);
            const encryptedRoles = this.commonService.encryptUsingAES256(roles);
            localStorage.setItem('CompanyRoles', encryptedRoles);
          });

        this.router.navigateByUrl('/home/dashboard');
      });

    this.featureControlService
      .getFeatureControlDetailsForLocalStorage(
        company.companyId,
        this.loginService.getUserId()
      )
      .subscribe((res) => {
        let data = res.data.map((data) => {
          return { featureId: data.featureId, featureName: data.feature };
        });
        const encryptedFeatureControl =
          this.commonService.encryptUsingAES256(data);
        localStorage.setItem('User_Features', encryptedFeatureControl);
      });

    this.counterService
      .getUserCounterDetailsForLocalStorage(
        company.companyId,
        this.loginService.getUserId()
      )
      .subscribe((res) => {
        if (res) {
          let data = res.data.map((counter) => {
            return counter;
          });

          const encryptedCounterDetais =
            this.commonService.encryptUsingAES256(data);
          localStorage.setItem('User_Couter_Details', encryptedCounterDetais);
        }
        if (!res.data || Object.keys(res.data).length === 0) {
          let data = [{ counterId: 0 }];
          const encryptedCounterDetais =
            this.commonService.encryptUsingAES256(data);
          localStorage.setItem('User_Couter_Details', encryptedCounterDetais);
        }
      });
    this.commonService.setTheNotification = true;
  }
  getAllCompanyDetails() {
    this.getCompanyDetails();
  }

  logout() {
    this.loginService.logout();
  }
}
