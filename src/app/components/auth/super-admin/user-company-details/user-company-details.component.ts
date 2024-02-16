import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/models/company';
import { SuperAdminService } from 'src/app/service/shared/Super Admin/super-admin.service';

@Component({
  selector: 'app-user-company-details',
  templateUrl: './user-company-details.component.html',
  styleUrls: ['./user-company-details.component.css'],
})
export class UserCompanyDetailsComponent {
  @Input() toggleModel!: boolean;

  @Input() userId!: number;
  @Output() sucsessful = new EventEmitter<Boolean>(false);
  @Output() emitToReset = new EventEmitter<boolean>(false);

  GetuserId!: number;

  userDetails!: Company[];
  isApprovedCheckedValue!: boolean;
  selectedCompanyId!: number;

  constructor(
    private superAdminService: SuperAdminService,
    private toasterService: ToastrService
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.toggleModel) {
      setTimeout(() => {
        const detailsModel = document.getElementById(
          'user-company-detailsPopUp'
        ) as HTMLButtonElement;
        detailsModel.click();
        this.emitToReset.emit(true);
      });
    }
    if (this.userId) {
      setTimeout(() => {
        this.superAdminService
          .getCompanyDetailsOfUserForSuperAdmin(this.userId)
          .subscribe((res) => {
            this.userDetails = res.data;
            this.sucsessful.emit(true);
          });
      });
    }
  }
  IsApprovedCheckboxChanged(e: any, companyId: number) {
    this.isApprovedCheckedValue = e.target.checked;
    this.selectedCompanyId = companyId;
  }

  onSubmit() {
    this.superAdminService
      .allowDisallowToProceedBySuperAdmin(
        this.selectedCompanyId,
        this.isApprovedCheckedValue
      )
      .subscribe((res) => {
        if (res.data) {
          if (this.isApprovedCheckedValue === true) {
            this.toasterService.success(res.data);
          }
          this.toasterService.success('Permission Revoked');
          const button = document.getElementById('closeButton') as HTMLElement;
          button.click();
        } else {
          this.toasterService.error('Something went wrong');
        }
      });
  }
}
