import { Component } from '@angular/core';
import { UserConfiguration } from 'src/app/models/user-configuration';
import { SuperAdminService } from 'src/app/service/shared/Super Admin/super-admin.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css'],
})
export class SuperAdminComponent {
  users!: UserConfiguration[];
  selectedUserIdForAssign!: number;
  selectedEnableDisableUser!: number;
  selectedEnableDisableUserStatus!: boolean;

  userIdForListing: number = 0;

  togglePopup: boolean = false;

  currentPageNumber: number = 1;
  pageTotalItems: number = 10;

  searchInput: string = '';
  searchValue: string = '';

  constructor(
    private superAdminService: SuperAdminService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.getAllUsersForSuperAdminListing();
    this.togglePopup = false;
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.getAllUsersForSuperAdminListing();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.getAllUsersForSuperAdminListing();
    }
  }

  getAllUsersForSuperAdminListing(isClearSearch?) {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    offset = Math.max(1, offset);
    if (isClearSearch) {
      this.searchInput = '';
    }
    this.superAdminService
      .getAllUsersForSuperAdminListing(
        offset,
        this.pageTotalItems,
        this.searchInput
      )
      .subscribe((res) => {
        this.users = res.data;
      });
  }
  assignAdminRole(userId: number) {
    this.selectedUserIdForAssign = userId;
  }
  enableDisable(userId: number, e: any) {
    this.selectedEnableDisableUser = userId;
    this.selectedEnableDisableUserStatus = e.target.checked;
  }
  logout() {
    this.loginService.logout();
  }

  submit() {
    if (this.selectedUserIdForAssign) {
      this.superAdminService
        .assignAdminRoleBySuperAdmin(this.selectedUserIdForAssign)
        .subscribe({
          next: (res) => {
            this.getAllUsersForSuperAdminListing();
          },
        });
    }
    if (this.selectedEnableDisableUser) {
      this.superAdminService
        .updateUserStatusFromSuperAdmin(
          this.selectedEnableDisableUserStatus,
          this.selectedEnableDisableUser
        )
        .subscribe({
          next: (res) => {
            this.getAllUsersForSuperAdminListing();
          },
        });
    }
  }

  getUserId(userId: number) {
    this.togglePopup = true;
    if (userId) {
      this.userIdForListing = userId;
    }
  }

  triggerList() {
    this.getAllUsersForSuperAdminListing();
  }
  resetDetailPopup() {
    this.togglePopup = !this.togglePopup;
  }
}
