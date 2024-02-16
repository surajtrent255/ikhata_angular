import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/models/Bank';
import { CustomerMetaData } from 'src/app/models/CustomerMetaData';
import { Loan } from 'src/app/models/Loan';
import { LoanNames } from 'src/app/models/LoanNames';
import { LoanTypes } from 'src/app/models/LoanTypes';
import { Company } from 'src/app/models/company';
import { LoanService } from 'src/app/service/loan.service';
import { BankService } from 'src/app/service/shared/bank/bank.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-edit-loan',
  templateUrl: './edit-loan.component.html',
  styleUrls: ['./edit-loan.component.css'],
})
export class EditLoanComponent {
  @Input() loanId!: number;
  @Input() toggleEditLoan!: boolean;
  @Output() destroyEditLoanComp = new EventEmitter<boolean>(false);
  @Output() editSuccessfullFlag = new EventEmitter<boolean>(false);
  @Output() emitToReset = new EventEmitter<boolean>();
  banks: Bank[] = [];
  loan: Loan = new Loan();
  compId!: number;
  branchId!: number;

  loanTypes: LoanTypes[] = [];
  loanNames: LoanNames[] = [];
  lenders: Company[] = [];
  lenderSearchMethod: number = 1;

  lenderPanOrPhone!: number;
  selectLender: boolean = false;
  customerMetaData: CustomerMetaData = {
    customerPanOrPhone: 0,
    customers: [],
  };

  constructor(
    private loginService: LoginService,
    private bankService: BankService,
    private loanService: LoanService,
    private companyService: CompanyServiceService,
    private toastrService: ToastrService,
    private ngxSmartModalService: NgxSmartModalService,
    public CommonService: CommonService
  ) {
    this.loanId;
  }

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.fetchLoanTypes();
    this.fetchLoanNames();
    this.fetchRelatedBanks();
  }

  ngOnChanges() {
    if (this.toggleEditLoan) {
      this.ngxSmartModalService.getModal('editLoanPopup').open();
      this.emitToReset.emit(true);
    }
    this.fetchSingleLoan(this.loanId);
  }
  ngAfterViewInit() {
    this.CommonService.enableDragging('editLoanPopup', 'editLoanpopup');
  }

  fetchRelatedBanks() {
    this.bankService
      .getAllBanks(this.compId, this.branchId)
      .subscribe((data) => {
        this.banks = data.data;
      });
  }

  fetchSingleLoan(loanId: number) {
    this.loanService
      .getSingleLoan(loanId, this.compId, this.branchId)
      .subscribe((data) => {
        this.loan = data.data;
      });
  }

  fetchLoanTypes() {
    this.loanService.getAllLoanTypes().subscribe((data) => {
      this.loanTypes = data.data;
    });
  }

  fetchLoanNames() {
    this.loanService.getAllLoanNames().subscribe((data) => {
      this.loanNames = data.data;
    });
  }

  lenderSearch(id: number) {
    this.lenderSearchMethod = id;
  }
  fetchLenderInfo($event?:any) {
    if($event){
      $event.preventDefault();
    }
    if (this.lenderPanOrPhone === null || this.lenderPanOrPhone === undefined) {
      this.toastrService.error(`pan or phone`, 'invalid number');
      return;
      // return;
    }
    this.selectLender = true; 
    setTimeout(() => {
      this.ngxSmartModalService.getModal("eselectCustomerPopup").open();
    }, 300);

    this.companyService
      .getCustomerInfoByPanOrPhone(
        this.lenderSearchMethod,
        this.lenderPanOrPhone
      )
      .subscribe({
        next: (data) => {
          this.lenders = data.data;
          let customerMetaData = new CustomerMetaData();
          customerMetaData.customers = data.data;
          customerMetaData.customerPanOrPhone = this.lenderPanOrPhone;
          this.customerMetaData = customerMetaData;
        },
        complete: () => {},
      });
  }

  editLoan(form: any) {
    this.loanService
      .editLoan(this.loan.id, this.compId, this.branchId, this.loan)
      .subscribe((data) => {
        this.toastrService.success('loan successfully updated');
        this.editSuccessfullFlag.emit(true);

        this.destroyComp();
      });
  }

  destroyComp() {
    this.ngxSmartModalService.getModal('editLoanPopup').close();
    this.destroyEditLoanComp.emit(true);
  }

  setLenderId(id: number) {
    this.loan.lenderId = id;
    this.selectLender = false;
    this.ngxSmartModalService.getModal("eselectCustomerPopup").close();

  }

  destroySelectLenderComponent($event) {
    this.selectLender = false;
    this.ngxSmartModalService.getModal("eselectCustomerPopup").close();
    if ($event) {
    }
  }
}
