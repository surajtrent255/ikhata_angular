import { Component } from '@angular/core';
import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { BankList } from 'src/app/models/BankList';
import { Loan } from 'src/app/models/Loan';
import { LoanService } from 'src/app/service/loan.service';
import { BankService } from 'src/app/service/shared/bank/bank.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css'],
})
export class LoanComponent {
  isAccountant: boolean = false;
  isMaster: boolean = false;

  loans: Loan[] = [];
  updateLoanEnable: boolean = false;
  createLoanEnable: boolean = false;
  compId!: number;
  branchId!: number;
  bankList: BankList[] = [];

  loanForUpdateId!: number;
  currentPageNumber: number = 1;
  pageTotalItems: number = 3;
  deleteLoanId!: number;
  earlierPageNumber: number = 1;
  searchBy: string = '';
  searchWildCard: string = '';
  sortBy: string = 'id';
  nextPage: boolean = false;
  confirmAlertDisplay: boolean = false;

  constructor(
    private loanService: LoanService,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private ngxSmartModal: NgxSmartModalService,
    private bankService: BankService,
    public CommonService: CommonService
  ) {}

  ngOnInit() {
    this.branchId = this.loginService.getBranchId();
    this.compId = this.loginService.getCompnayId();
    // this.getAllLoans();
    this.fetchLimitedLoans(true);
    let roles = this.loginService.getCompanyRoles();
    if (roles?.includes('ACCOUNTANT')) {
      this.isAccountant = true;
    } else if (roles.includes('ADMIN')) {
      this.isMaster = true;
    } else {
      this.isAccountant = false;
      this.isMaster = false;
    }
    this.getBankList();
  }
  ngAfterViewInit() {
    this.CommonService.enableDragging(
      'confirmAlertDisplayPopup',
      'confirmAlertDisplaypopup'
    );
  }
  getBankList() {
    this.bankService.getBankList().subscribe((data) => {
      this.bankList = data.data;
    });
  }

  getAllLoans() {
    this.loanService.getLoans(this.compId, this.branchId).subscribe((data) => {
      this.loans = data.data;
    });
  }

  changePage(type: string) {
    this.earlierPageNumber = this.currentPageNumber;
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
    } else if (type === 'next') {
      if (this.loans.length < this.pageTotalItems) return;
      this.currentPageNumber += 1;
    }
    this.fetchLimitedLoans();
  }

  fetchLimitedLoans(oninit?: boolean) {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    offset = Math.max(1, offset);
    this.loanService
      .getLimitedLoans(
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
          this.loans = [];
          this.toastrService.error('loan infos not found ');
          // this.currentPageNumber -= 1;
          if (this.nextPage === false) {
            this.currentPageNumber = this.earlierPageNumber;
            if (oninit === false) this.fetchLimitedLoans();
            this.nextPage = false;
          }
        } else {
          this.loans = res.data;
          this.nextPage = false;
        }
      });
  }

  disableLoanComponent($event: boolean) {
    if ($event === true) {
      this.createLoanEnable = false;
      this.fetchLimitedLoans();
    }
  }

  disableEditComponent($event: boolean) {
    if ($event === true) {
      this.updateLoanEnable = false;
      this.fetchLimitedLoans();
    }
  }

  deleteLoan(id: number) {
    this.confirmAlertDisplay = true;
    this.deleteLoanId = id;
    this.ngxSmartModal.getModal('confirmAlertDisplayPopup').open();
  }

  loanForUpdate(id: number) {
    this.updateLoanEnable = true;
    this.loanForUpdateId = id;
  }

  enableLoanComponent() {
    this.createLoanEnable = true;
  }

  continuingDeletingLoan(id: number) {
    this.loanService
      .deleteLoan(id, this.compId, this.branchId)
      .subscribe((data) => {
        this.toastrService.success('loan has been deleted !');
        this.fetchLimitedLoans();
      });
  }

  destroyConfirmAlertSectionEmitter($event: boolean) {
    this.confirmAlertDisplay = false;
    this.ngxSmartModal.getModal('confirmAlertDisplayPopup').close();
    if ($event === true) {
      this.continuingDeletingLoan(this.deleteLoanId);
    }
  }
}
