import { Component } from '@angular/core';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import { ToastrService } from 'ngx-toastr';
import { LoanRepay } from 'src/app/models/Loan-Repay/loanRepay';
import { LoanRepayService } from 'src/app/service/loan-repay/loan-service.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-loan-repay',
  templateUrl: './loan-repay.component.html',
  styleUrls: ['./loan-repay.component.css'],
})
export class LoanRepayComponent {
  msg: string = 'are you sure want to delete';

  isAccountant: boolean = false;
  isMaster: boolean = false;
  selectedOption: string = '';
  deleteTheLoanRepayFlag: boolean = false;
  repayFormData: LoanRepay = new LoanRepay();
  loanRepayData!: LoanRepay[];

  toggleEditLoanRepay!: boolean;

  loadRepayIdForEdit!: number;
  showLoanAmount !: number;
  constructor(
    private loginService: LoginService,
    private loanRepayService: LoanRepayService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    let roles = this.loginService.getCompanyRoles();
    if (roles?.includes('ACCOUNTANT')) {
      this.isAccountant = true;
    } else if (roles.includes('ADMIN')) {
      this.isMaster = true;
    } else {
      this.isAccountant = false;
      this.isMaster = false;
    }
    this.getLoanRepay();
  }

  findLoanId(id: number) {
    this.loanRepayService
      .getLoanNameForLoanRepay(
        id,
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe((res) => {
        if (res) {

          this.repayFormData.loanName = res.data['name']!;
          this.showLoanAmount = Number(res.data['amount']);
        }

        else return;
      });
  }

  getLoanRepay() {
    this.loanRepayService
      .getLoanRepay(
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe((res) => {
        this.loanRepayData = res.data;
      });
  }

  deleteLoanRepay(loanRepayId: number) {
    console.log(loanRepayId);
    this.loanRepayService.deleteLoanRepay(loanRepayId).subscribe({
      next: (res) => {
        this.getLoanRepay();
      },
    });
  }

  createLoanRepay() {
    if (this.selectedOption === 'service') {
      this.repayFormData.service = true;
    }
    if (this.selectedOption === 'interest') {
      this.repayFormData.interest = true;
    }
    if (this.selectedOption === 'principle') {
      this.repayFormData.principle = true;
    }
    if (this.selectedOption === 'penalty') {
      this.repayFormData.penalty = true;
    }
    this.repayFormData.companyId = this.loginService.getCompnayId();
    this.repayFormData.branchId = this.loginService.getBranchId();

    const mainInput = document.getElementById(
      'nepali-datepicker'
    ) as HTMLInputElement;
    var currentNepaliDate = mainInput.value;
    if (currentNepaliDate && currentNepaliDate != '') {
      this.repayFormData.nepaliDate = String(currentNepaliDate);
    } else {
      var date = adToBs(new Date().toJSON().slice(0, 10));
      this.repayFormData.nepaliDate = String(date);
    }

    if (
      this.repayFormData.loanName !== '' &&
      this.repayFormData.loanName !== undefined &&
      this.repayFormData.loanNo !== null &&
      this.selectedOption !== '' &&
      this.repayFormData.amount !== undefined
    ) {
      this.loanRepayService.addLoanRepay(this.repayFormData).subscribe({
        next: (res) => {
          if (res) {
            this.repayFormData = new LoanRepay();
            this.toastrService.success('Added Successfully');
            this.getLoanRepay();
            this.cancel();
          }
        },
      });
    } else {
      this.toastrService.error('Please Enter All Fields');
    }
  }

  delete(e: any) {
    if (e === true) {
      this.deleteTheLoanRepayFlag = true;
    }
  }

  editLoanRepay(loanRepayId: number) {
    if (loanRepayId) this.loadRepayIdForEdit = loanRepayId;
    this.toggleEditLoanRepay = true;
  }

  // for modal
  onCreate() {
    const createPopUp = document.getElementById(
      'loanrepayPopup'
    ) as HTMLButtonElement;
    createPopUp.click();
  }
  cancel() {
    const popClose = document.getElementById('closeButton') as HTMLInputElement;
    popClose.click();
  }
}
