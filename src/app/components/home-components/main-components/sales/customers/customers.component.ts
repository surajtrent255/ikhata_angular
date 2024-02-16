import { Component } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Company } from 'src/app/models/company';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent {
  currentPageNumber: number = 1;
  pageTotalItems: number = 5;
  nextPage: boolean = false;
  searchBy: string = '';
  searchWildCard: string = '';

  sortBy: string = 'id';

  earlierPageNumber: number = 1;
  availableCustomer: Company[] = [];

  isAccountant: boolean = false;
  isMaster: boolean = false;

  createCustomerEnable: boolean = false;
  createCustomerToggle: boolean = false;
  constructor(
    private companyService: CompanyServiceService,
    private ngxSmartModalService: NgxSmartModalService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.fetchLimitedCustomer();
    let roles = this.loginService.getCompanyRoles();
    if (roles?.includes('ACCOUNTANT')) {
      this.isAccountant = true;
    } else if (roles.includes('ADMIN')) {
      this.isMaster = true;
    } else {
      this.isAccountant = false;
      this.isMaster = false;
    }
  }

  onCreate() {
    this.createCustomerEnable = true;
    this.createCustomerToggle = true;
    this.ngxSmartModalService.getModal('createNewCustomer').open();
  }

  changePage(type: string) {
    this.earlierPageNumber = this.currentPageNumber;
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
    } else if (type === 'next') {
      if (this.availableCustomer.length < this.pageTotalItems) return; //this logic is only valid if api data length is less than page size. for equal below is the code.
      this.currentPageNumber += 1;
    }
    this.fetchLimitedCustomer();
  }

  fetchLimitedCustomer() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    offset = Math.max(1, offset);

    this.companyService
      .fetchLimitedCustomer(
        offset,
        this.pageTotalItems,
        this.searchBy,
        this.searchWildCard,
        this.sortBy,
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe((res) => {
        this.availableCustomer = res.data;
      });
  }

  editCustomer(compId: number) {}

  deleteCustomer(compId: number) {}
  customerAddedSuccessfully($event) {}

  destroyCreateCustomerComp($event) {
    this.createCustomerEnable = false;
    this.createCustomerToggle = false;
    this.ngxSmartModalService.getModal('createNewCustomer').close();
  }
}
