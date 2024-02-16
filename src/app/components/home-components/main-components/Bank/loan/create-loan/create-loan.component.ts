import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/models/Bank';
import { BankList } from 'src/app/models/BankList';
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
  selector: 'app-create-loan',
  templateUrl: './create-loan.component.html',
  styleUrls: ['./create-loan.component.css'],
})
export class CreateLoanComponent {
  @Input() toggleCreateLoan!: boolean;
  @Output() destroyCreateLoanComp = new EventEmitter<boolean>(false);
  @Output() emitToReset = new EventEmitter<boolean>(false);
  banks: Bank[] = [];
  loan: Loan = new Loan();

  bankList: BankList[] = [];
  loanTypes: LoanTypes[] = [];
  loanNames: LoanNames[] = [];
  lenders: Company[] = [];
  lenderSearchMethod: number = 1;

  compId!: number;
  branchId!: number;
  lenderPanOrPhone!: number;
  selectLender: boolean = false;
  customerMetaData: CustomerMetaData = new CustomerMetaData();

  constructor(
    private loanService: LoanService,
    private loginService: LoginService,
    private companyService: CompanyServiceService,
    private bankService: BankService,
    private ngxSmartModalService: NgxSmartModalService,
    private toastrService: ToastrService,
    public CommonService: CommonService
  ) {}

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.fetchLoanTypes();
    this.fetchLoanNames();
    this.fetchRelatedBanks();
    this.getBankList();
  }

  ngOnChanges() {
    if (this.toggleCreateLoan) {
      this.ngxSmartModalService.getModal('createLoanPopup').open();

      this.emitToReset.emit(true);
    }
  }

  ngAfterViewInit() {
    this.CommonService.enableDragging('createLoanPopup', 'createLoanpopup');
  }
  getBankList() {
    this.bankService.getBankList().subscribe((data) => {
      this.bankList = data.data;
    });
  }

  fetchRelatedBanks() {
    this.bankService
      .getAllBanks(this.compId, this.branchId)
      .subscribe((data) => {
        this.banks = data.data;
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

  fetchLenderInfo() {
    if (this.lenderPanOrPhone === null || this.lenderPanOrPhone === undefined) {
      this.toastrService.error(`pan or phone`, 'invalid number');
      return;
      // return;
    }
    this.selectLender = true;
    setTimeout(() => {
      this.ngxSmartModalService.getModal("selectCustomerPopup").open();
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

  createLoan(form: any) {
    if (this.loan.bankId > 0 && !(this.loan.serviceCharge > 0)) {
      this.toastrService.error('enter service charge');
      return;
    }
    this.loan.companyId = this.compId;
    this.loan.branchId = this.branchId;
    this.loanService.createLoan(this.loan).subscribe({
      next: (data) => {
        this.toastrService.success(
          'Loan successfully created ! id:' + data.data
        );
      },
      error: (error) => {
        this.toastrService.error(' something went wrong ');
      },
      complete: () => {
        form.reset();
        this.destroyComp();
      },
    });
  }

  setLenderId(id: number) {
    this.loan.lenderId = id;
    this.destroySelectLenderComponent(true);
  }

  destroyComp() {
    this.ngxSmartModalService.getModal('createLoanPopup').close();
    this.destroyCreateLoanComp.emit(true);
  }

  destroySelectLenderComponent($event) {
    if ($event) {
      this.selectLender = false;
      this.ngxSmartModalService.getModal("selectCustomerPopup").close();
    }
  }

  testPopup(){
    this.ngxSmartModalService.getModal("carPopup").open();

  }
}
