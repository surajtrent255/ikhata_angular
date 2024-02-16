import { Component } from '@angular/core';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from '../../../service/shared/login.service';
import { Company } from 'src/app/models/company';

declare function toggleSideBar(): void;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  companyData: Company = new Company();

  isMaster: boolean = false;

  constructor(private LoginService: LoginService) {}

  ngOnInit() {
    this.companyData = this.LoginService.getCompany();
    setTimeout(() => {
      let roles = this.LoginService.getCompanyRoles();
      if (roles.includes('ADMIN')) {
        this.isMaster = true;
      }
    }, 200);
  }

  // For role Based Rendering
  OnSwitchCompany() {
    localStorage.removeItem('CompanyRoles');
    localStorage.removeItem('User_Couter_Details');
    localStorage.removeItem('User_Features');
    localStorage.removeItem('companyDetails');
    localStorage.removeItem('BranchDetails');
    localStorage.removeItem('Company');
  }

  toggle() {
    toggleSideBar();
  }

  logout() {
    this.LoginService.logout();
  }
}
