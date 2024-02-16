import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { UserConfiguration } from 'src/app/models/user-configuration';
import { LoginService } from 'src/app/service/shared/login.service';
import { RoleService } from 'src/app/service/shared/role.service';
import { UserConfigurationService } from 'src/app/service/shared/user-configuration.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  UsersByCompanyId!: UserConfiguration[];
  loggedInUserId!: number;
  addRoleData!: UserConfiguration[];
  selectedUserId!: number;
  selectedUser!: string;
  selectedUserCompanyName!: string;

  // Feature Control
  userIdForFeatureControl!: number;

  // serach tab section 1
  currentPageNumber: number = 1;
  pageTotalItems: number = 5;
  searchInput: string = '';

  // assign company
  triggerAssignCompanyPopup!: boolean;

  toggleAddRole!: boolean;
  toggleAddControl!: boolean;

  @Output() resetFeatureControlTable = new EventEmitter<boolean>(false);
  @Output() resetUserRole = new EventEmitter<boolean>(true);

  // v2 changes

  enableDisableStatus!: boolean;
  enableDisableUserId!: number;
  enableDisableBoolean: boolean = false;

  constructor(
    private userConfigurationService: UserConfigurationService,
    private loginService: LoginService,
    private roleService: RoleService,
    private toasterService: ToastrService
  ) {}

  ngOnInit() {
    this.toggleAddRole = false;
    this.toggleAddControl = false;
    this.triggerAssignCompanyPopup = false;
    this.loggedInUserId = this.loginService.getUserId();
    this.fetchLimitedUsersForSearch();
  }

  ngAfterViewInit() {
    this.fetchLimitedUsersForSearch();
  }

  initAssignCompanyPopup() {
    this.triggerAssignCompanyPopup = true;
  }

  resetAssignPopup() {
    this.triggerAssignCompanyPopup = !this.triggerAssignCompanyPopup;
  }

  getUsersByCompanyId() {
    this.userConfigurationService
      .getUsersByCompanyId(this.loginService.getCompnayId())
      .subscribe((res) => {
        this.UsersByCompanyId = res.data;
      });
  }

  onCheckboxChanged(e: any, userId: number) {
    this.enableDisableStatus = e.target.checked;
    this.enableDisableUserId = userId;
    this.enableDisableBoolean = true;
  }

  addRole(
    e: any,
    userId: number,
    firstName: string,
    lastName: string,
    companyName: string
  ) {
    this.toggleAddRole = true;
    this.selectedUser = firstName + ' ' + lastName;
    this.selectedUserId = userId;
    this.selectedUserCompanyName = companyName;
  }

  // feature Control
  addControl(userId: number) {
    this.userIdForFeatureControl = userId;
    this.toggleAddControl = true;
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedUsersForSearch();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedUsersForSearch();
    }
  }

  fetchLimitedUsersForSearch() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    offset = Math.max(1, offset);
    this.userConfigurationService
      .getLimitedUsersForSearchInUserConfiguration(
        offset,
        this.pageTotalItems,
        this.loginService.getCompnayId(),
        this.searchInput
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.UsersByCompanyId = [];
          this.toasterService.error('User Not Found');
        } else {
          this.UsersByCompanyId = res.data;
        }
      });
  }

  getUserListing() {
    this.getUsersByCompanyId();
  }
  triggerUserRole() {
    this.resetUserRole.emit(true);
  }
  triggerTheUserFeatureList() {
    this.resetFeatureControlTable.emit(true);
  }

  onSubmit() {
    if (this.enableDisableBoolean && this.enableDisableUserId !== null) {
      this.userConfigurationService
        .updateUserCompanyStatus(
          String(this.enableDisableStatus),
          this.enableDisableUserId
        )
        .subscribe({
          next: (res) => {
            this.toasterService.success('Status Successfully Changed');
            this.enableDisableBoolean = false;
            this.fetchLimitedUsersForSearch();
          },
          error: () => {
            this.toasterService.error('Something Went Wrong');
          },
        });
    } else {
      this.toasterService.error('Something Went Wrong');
    }
  }
}
