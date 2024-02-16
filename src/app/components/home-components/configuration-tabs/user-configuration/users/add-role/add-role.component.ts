import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Roles } from 'src/app/models/Roles';
import { UserConfiguration } from 'src/app/models/user-configuration';
import { LoginService } from 'src/app/service/shared/login.service';
import { RoleService } from 'src/app/service/shared/role.service';
import { UserConfigurationService } from 'src/app/service/shared/user-configuration.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css'],
})
export class AddRoleComponent {
  @Input() toggleAddRole!: boolean;
  @Input() userId!: number;
  @Input() selectUserName!: string;
  @Input() selectUserCompanyName!: string;
  @Output() emitToReset = new EventEmitter<boolean>(false);
  @Output() successFullyAdded = new EventEmitter<boolean>(false);

  addRoleData!: UserConfiguration[];
  role!: Roles[];
  usersName!: string;
  userscompanyName!: string;
  PopupRoleId!: number;
  selectedUserId!: number;

  @ViewChild('addRolePopup', { static: false }) addRolePopup!: ElementRef;
  @ViewChild('closeButton', { static: false }) closeButton!: ElementRef;

  constructor(
    private roleService: RoleService,
    private loginService: LoginService,
    private userConfigurationService: UserConfigurationService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getRoles();
  }

  ngOnChanges() {
    if (this.toggleAddRole) {
      setTimeout(() => {
        this.addRolePopup.nativeElement.click();
        this.usersName = this.selectUserName;
        this.userscompanyName = this.selectUserCompanyName;
        this.selectedUserId = this.userId;
        this.emitToReset.emit(true);
        if (this.selectedUserId)
          this.getUserRoleDetailsBasedOnCompanyIdAndUserId();
      });
    }
  }

  getRoles() {
    this.userConfigurationService.getRoles().subscribe((res) => {
      this.role = res.data;
    });
  }
  getUserRoleDetailsBasedOnCompanyIdAndUserId() {
    this.roleService
      .getUserRoleDetailsBasedOnCompanyIdAndUserId(
        this.loginService.getCompnayId(),
        this.selectedUserId
      )
      .subscribe({
        next: (res) => {
          this.addRoleData = res.data;
        },
      });
  }

  hasRole(roleName: string) {
    if (!this.addRoleData) {
      return;
    } else {
      return this.addRoleData.some((user) => user.role.includes(roleName));
    }
  }

  onAssignRolePopupSaveClicked() {
    if (this.PopupRoleId !== null && this.PopupRoleId != undefined) {
      this.roleService
        .addToUserRole(
          this.selectedUserId,
          this.loginService.getCompnayId(),
          this.PopupRoleId
        )
        .subscribe({
          next: () => {
            this.successFullyAdded.emit(true);
            this.closeButton.nativeElement.click();
            this.toastrService.success('Successfully Added');
          },
        });
    } else {
      this.toastrService.error('Please Change the role');
    }
  }

  onRoleChecked(e: any, roleId: number) {
    this.PopupRoleId = roleId;

    // }
  }

  resetForm() {
    this.getUserRoleDetailsBasedOnCompanyIdAndUserId();
  }
}
