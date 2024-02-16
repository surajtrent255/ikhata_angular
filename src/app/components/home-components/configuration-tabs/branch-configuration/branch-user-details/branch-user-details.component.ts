import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BranchConfig } from 'src/app/models/BranchConfig';
import { BranchService } from 'src/app/service/shared/branch.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-branch-user-details',
  templateUrl: './branch-user-details.component.html',
  styleUrls: ['./branch-user-details.component.css'],
})
export class BranchUserDetailsComponent {
  @Input() resetTable!: boolean;
  @Output() toggleInput = new EventEmitter<boolean>(false);

  branchUsers!: BranchConfig[];
  branchUserTabStatus!: boolean;

  // v2 changes
  enableDisbaleBoolean: boolean = false;
  enableDisableStatus!: boolean;
  enableDisableUserId!: number;
  enableDiableBranchId!: number;

  constructor(
    private branchService: BranchService,
    private loginService: LoginService,
    private ToastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getBranchUsersByCompanyId();
  }

  ngOnChanges() {
    if (this.resetTable) {
      setTimeout(() => {
        this.getBranchUsersByCompanyId();
        this.toggleInput.emit(true);
      });
    }
  }

  getBranchUsersByCompanyId() {
    this.branchService
      .getBranchUsersByCompanyId(this.loginService.getCompnayId())
      .subscribe((res) => {
        this.branchUsers = res.data;
      });
  }

  onBranchCheckboxChanged(e: any, userId: number, branchId: number) {
    this.enableDisbaleBoolean = true;
    this.enableDiableBranchId = branchId;
    this.enableDisableStatus = e.target.checked;
    this.enableDisableUserId = userId;
  }

  OnSubmit() {
    if (
      this.enableDisbaleBoolean &&
      this.enableDiableBranchId !== null &&
      this.enableDisbaleBoolean !== null
    ) {
      this.branchService
        .enableDisableUser(
          this.enableDisableStatus,
          this.enableDisableUserId,
          this.loginService.getCompnayId(),
          this.enableDiableBranchId
        )
        .subscribe({
          next: (res) => {
            this.ToastrService.success('Status Successfully Changed');
            this.getBranchUsersByCompanyId();
          },
          error: () => {
            this.ToastrService.error('Something Went Wrong');
          },
        });
    } else {
      this.ToastrService.error('Something Went Wrong');
    }
  }
}
