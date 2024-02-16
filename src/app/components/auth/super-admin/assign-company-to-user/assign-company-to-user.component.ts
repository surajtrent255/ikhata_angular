import { Component, ElementRef, ViewChild } from '@angular/core';
import { SuperAdminService } from '../../../../service/shared/Super Admin/super-admin.service';
import { Company } from 'src/app/models/company';
import { UserConfiguration } from 'src/app/models/user-configuration';
import { User } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-company-to-user',
  templateUrl: './assign-company-to-user.component.html',
  styleUrls: ['./assign-company-to-user.component.css'],
})
export class AssignCompanyToUserComponent {
  companiesWithNoUsers!: Company[];
  currentPageNumber: number = 1;
  pageTotalItems: number = 10;
  currentUserPageNumber: number = 1;
  AllUsers!: UserConfiguration[];

  searchWildCard: string = '';
  searchUserWildCard: string = '';

  selectedCompany!: number;
  selectedCompanyName: string = '';
  selectedUser: any;

  @ViewChild('assignUser') assignUserPopUp!: ElementRef;
  @ViewChild('closeButton') closeButton!: ElementRef;

  constructor(
    private SuperAdminService: SuperAdminService,
    private tostrService: ToastrService
  ) {}

  ngOnInit() {
    this.getCompaniesWithNoUsers();
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.getCompaniesWithNoUsers();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.getCompaniesWithNoUsers();
    }
  }

  getCompaniesWithNoUsers() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    offset = Math.max(1, offset);
    this.SuperAdminService.getAllCompaniesWithNoUsers(
      offset,
      this.pageTotalItems,
      this.searchWildCard,
      'name'
    ).subscribe({
      next: (res) => {
        if (res) {
          this.companiesWithNoUsers = res.data;
        }
      },
    });
  }
  assignUserPopup(company: Company) {
    this.selectedUser = null;
    this.selectedCompanyName = company.name;
    this.selectedCompany = company.companyId;
    this.getAllUser();
    this.assignUserPopUp.nativeElement.click();
  }
  SelectedUser(user: UserConfiguration) {
    this.selectedUser = user.userId;
  }

  getAllUser() {
    let pageId = this.currentUserPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    offset = Math.max(1, offset);
    this.SuperAdminService.getAllUsersForSuperAdminListing(
      offset,
      this.pageTotalItems,
      this.searchUserWildCard
    ).subscribe({
      next: (res) => {
        this.AllUsers = res.data;
      },
    });
  }

  changeUserPage(type: string) {
    if (type === 'prev') {
      if (this.currentUserPageNumber === 1) return;
      this.currentUserPageNumber -= 1;
      this.getAllUser();
    } else if (type === 'next') {
      this.currentUserPageNumber += 1;
      this.getAllUser();
    }
  }

  submit() {
    if (this.selectedUser && this.selectedCompany) {
      this.SuperAdminService.assignUserWithNoCompany(
        this.selectedCompany,
        this.selectedUser
      ).subscribe({
        next: () => {
          this.getAllUser();
          this.tostrService.success('User Successfully Added to the Company');
          this.closeButton.nativeElement.click();
        },
        error: () => {
          this.tostrService.error('Error in Assigning User to the Company');
        },
      });
    } else {
      this.tostrService.error('Please Select a User');
    }
  }
}
