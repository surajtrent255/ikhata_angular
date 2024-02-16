import { Component } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { OtherIncome } from 'src/app/models/OtherIncome';
import { OtherIncomeSource } from 'src/app/models/OtherIncomeSource';
import { OtherIncomeService } from 'src/app/service/otherincome.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-other-income',
  templateUrl: './other-income.component.html',
  styleUrls: ['./other-income.component.css'],
})
export class OtherIncomeComponent {
  availableOtherIncomes: OtherIncome[] = [];
  enableCreateOtherIncome: boolean = false;
  confirmAlertDisplay: boolean = false;
  showOtherIncomeEditComp: boolean = false;
  otherIncomeEditId!: number;

  otherIncome!: OtherIncome;
  IsAuditor!: boolean;
  deleteOtherIncomeId!: number;
  otherIncomeInfoForUpdateId!: number;
  compId!: number;
  branchId!: number;

  isAccountant: boolean = false;
  isMaster: boolean = false;

  currentPageNumber: number = 1;
  pageTotalItems: number = 5;

  searchBy: string = 'name';
  searchWildCard: string = '';

  sortBy: string = 'sn';
  otherIncomeSources: OtherIncomeSource[] = [];

  constructor(
    private loginService: LoginService,
    private otherIncomeService: OtherIncomeService,
    private ngxSmartModalService: NgxSmartModalService,
    private toastrService: ToastrService,
    public CommonService: CommonService
  ) {}

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.fetchLimitedOtherIncomes();
    this.getAllOtherIncomeSources();
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

  ngAfterViewInit() {
    this.CommonService.enableDragging(
      'createOtherIncomePopup',
      'createOtherIncomePopUp'
    );
    this.CommonService.enableDragging(
      'updateOtherIncomePopup',
      'updateOtherIncomepopup'
    );
  }

  fetchLimitedOtherIncomes() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    offset = Math.max(1, offset);

    this.otherIncomeService
      .getLimitedOtherIncomes(
        offset,
        this.pageTotalItems,
        this.searchBy,
        this.searchWildCard,
        this.sortBy,
        this.compId,
        this.branchId
      )
      .subscribe((res) => {
        if (res.data.length === 0 || res.data === undefined) {
          this.availableOtherIncomes = [];
          this.toastrService.error('Other income not found ');
          // this.currentPageNumber -= 1;
        } else {
          this.availableOtherIncomes = res.data;
        }
      });
  }

  createNewOtherIncome($event) {}

  otherIncomeUpdatedSuccessfully($event) {
    this.disableShowEditComp($event);
  }

  editOtherIncome(id: number) {
    this.showOtherIncomeEditComp = true;
    this.otherIncomeEditId = id;
    this.ngxSmartModalService.getModal('updateOtherIncomePopup').open();
  }

  disableShowEditComp($event: boolean) {
    this.showOtherIncomeEditComp = false;
    this.ngxSmartModalService.getModal('updateOtherIncomePopup').close();
    this.fetchLimitedOtherIncomes();
  }

  otherIncomeAddedSuccesfully($event) {
    this.disableShowEditComp($event);
  }

  deleteOtherIncome(id: number) {
    this.confirmAlertDisplay = true;
    this.deleteOtherIncomeId = id;
    this.ngxSmartModalService.getModal('confirmAlertPopup').open();
  }

  destroyCreateOtherIncome($event: boolean) {
    this.enableCreateOtherIncome = false;
    this.ngxSmartModalService.getModal('createOtherIncomePopup').close();
  }

  destroyConfirmAlertSectionEmitter($event: boolean) {
    this.confirmAlertDisplay = false;
    this.ngxSmartModalService.getModal('confirmAlertPopup').close();
    if ($event === true) {
      this.continuingDeleting(this.deleteOtherIncomeId);
    }
  }

  continuingDeleting(deleteOtherIncomeId: number) {
    this.otherIncomeService
      .deleteOtherIncomeById(deleteOtherIncomeId, this.compId, this.branchId)
      .subscribe((res) => {
        this.toastrService.success(
          'Other income with id ' +
            deleteOtherIncomeId +
            ' has been deleted successfully.'
        );
        this.fetchLimitedOtherIncomes();
      });
  }

  changePage(element: string) {}

  displayCreateOtherIncomeComp() {
    this.enableCreateOtherIncome = true;
    this.ngxSmartModalService.getModal('createOtherIncomePopup').open();
  }

  getAllOtherIncomeSources() {
    this.otherIncomeService
      .getOtherIncomeSourceList(this.compId, this.branchId)
      .subscribe((res) => {
        this.otherIncomeSources = res.data;
      });
  }
}
