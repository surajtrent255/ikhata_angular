import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserConfiguration } from 'src/app/models/user-configuration';
import { LoginService } from 'src/app/service/shared/login.service';
import { RoleService } from 'src/app/service/shared/role.service';
import { UserConfigurationService } from 'src/app/service/shared/user-configuration.service';
import { ENABLE_DISABLE_BRANCH_USER } from '../../../../../constants/urls';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css'],
})
export class UserRoleComponent {
  currentPageNumberTab2: number = 1;
  pageTotalItemsTab2: number = 5;
  searchInputTab2: string = '';
  userRoleconfiguration!: UserConfiguration[];
  loggedInUserId!: number;
  usersTabsStatus!: boolean;

  @Input() resetTable!: boolean;
  @Output() emitToReset = new EventEmitter<boolean>(false);

  // v2 changes
  enableDisableStatus!: boolean;
  enableDisableRoleId!: number;
  enableDisableUserId!: number;
  enableDisableBoolean: boolean = false;

  constructor(
    private userConfigurationService: UserConfigurationService,
    private loginService: LoginService,
    private toasterService: ToastrService,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    this.loggedInUserId = this.loginService.getUserId();

    this.fetchLimitedUsersRoleForSearch();
  }

  ngOnChanges() {
    if (this.resetTable) {
      setTimeout(() => {
        this.emitToReset.emit(true);
        this.getUserRoleDetailsBasedOnCompanyId();
      });
    }
  }

  // For tab secton 2
  changePageTabSection2(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumberTab2 === 1) return;
      this.currentPageNumberTab2 -= 1;
      this.fetchLimitedUsersRoleForSearch();
    } else if (type === 'next') {
      this.currentPageNumberTab2 += 1;
      this.fetchLimitedUsersRoleForSearch();
    }
  }

  fetchLimitedUsersRoleForSearch() {
    let pageIdTab2 = this.currentPageNumberTab2 - 1;
    let offsetTab2 = pageIdTab2 * this.pageTotalItemsTab2 + 1;
    offsetTab2 = Math.max(1, offsetTab2);
    this.userConfigurationService
      .getLimitedUsersRoleForSearchInUserConfiguration(
        offsetTab2,
        this.pageTotalItemsTab2,
        this.loginService.getCompnayId(),
        this.searchInputTab2
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.userRoleconfiguration = [];
          this.toasterService.error('User Role Not Found');
        } else {
          this.userRoleconfiguration = res.data;
        }
      });
  }

  getUserRoleDetailsBasedOnCompanyId() {
    this.userConfigurationService
      .getUserRoleDetailsBasedOnCompanyId(this.loginService.getCompnayId())
      .subscribe((res) => {
        if (res) this.userRoleconfiguration = res.data;
      });
  }

  onRoleInConfigurationChecked(e: any, userId: number, roleId: number) {
    let status = e.target.checked;
    this.enableDisableStatus = status;
    this.enableDisableRoleId = roleId;
    this.enableDisableBoolean = true;
    this.enableDisableUserId = userId;
  }

  onSubmit() {
    if (
      this.enableDisableBoolean &&
      this.enableDisableRoleId !== null &&
      this.enableDisableUserId !== null
    ) {
      this.roleService
        .updateUserRoleStatus(
          String(this.enableDisableStatus),
          this.enableDisableUserId,
          this.loginService.getCompnayId(),
          this.enableDisableRoleId
        )
        .subscribe({
          next: (res) => {
            this.enableDisableBoolean = false;
            this.toasterService.success('Status Successfully Changed');
            this.fetchLimitedUsersRoleForSearch();
          },
          error: (err) => {
            this.toasterService.error('Something Went Wrong');
          },
        });
    } else {
      this.toasterService.error('Something Went Wrong');
    }
  }
}
