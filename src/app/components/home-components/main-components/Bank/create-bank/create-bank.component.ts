import { Component } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { AccountType } from 'src/app/models/AccountTypes';
import { Bank } from 'src/app/models/Bank';
import { BankList } from 'src/app/models/BankList';
import { BankService } from 'src/app/service/shared/bank/bank.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-create-bank',
  templateUrl: './create-bank.component.html',
  styleUrls: ['./create-bank.component.css'],
})
export class CreateBankComponent {
  companyId!: number;
  branchId!: number;
  bankName!: string;
  accountNumber!: string;
  initialAmount!: string;
  accountType!: string;

  showInput!: boolean;

  Bank: Bank[] = [];
  accountTypes: AccountType[] = [];
  showForm!: boolean;
  localStorageCompanyId!: number;
  UserbranchId!: number;
  showableEditBank: boolean = false;
  bankList: BankList[] = [];
  editBank: Bank = new Bank();
  confirmAlertDisplay: boolean = false;
  bankObj: Bank = new Bank();
  deleteBankId: number = 0;

  isAccountant: boolean = false;
  isMaster: boolean = false;

  currentPageNumber: number = 1;
  pageTotalItems: number = 5;

  constructor(
    private bankService: BankService,
    private toastrService: ToastrService,
    private loginService: LoginService,
    private ngxModalService: NgxSmartModalService,
    public CommonService: CommonService
  ) {}

  ngOnInit() {
    this.localStorageCompanyId = this.loginService.getCompnayId();

    this.UserbranchId = this.loginService.getBranchId();
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.getAllBank();
    this.getBankList();
    this.getAllAccountTypes();

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
    this.CommonService.enableDragging('editBankPopup', 'editBankpopup');
  }

  getBankList() {
    this.bankService.getBankList().subscribe((data) => {
      this.bankList = data.data;
    });
  }

  getAllBank() {
    this.bankService
      .getAllBanks(this.companyId, this.branchId)
      .subscribe((res) => {
        this.Bank = res.data;
      });
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedBanks();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedBanks();
    }
  }

  fetchLimitedBanks() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.bankService
      .getLimitedBank(
        offset,
        this.pageTotalItems,
        this.companyId,
        this.branchId
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.toastrService.error('banks not found ');
          this.currentPageNumber -= 1;
        } else {
          this.Bank = res.data;
        }
      });
  }
  getAllBankNames() {}

  getAllAccountTypes() {
    this.bankService.getAccountTypes().subscribe((data) => {
      this.accountTypes = data.data;
    });
  }

  SelecetBankChange(bankName: string) {
    if (bankName === 'other') {
      this.showInput = true;
    } else {
      this.showInput = false;
    }
  }

  createBank(form: any) {
    this.showForm = true;
    this.bankObj.companyId = this.companyId;
    this.bankObj.branchId = this.branchId;
    this.bankService.addBank(this.bankObj).subscribe({
      next: (data) => {
        form.reset();
        this.toastrService.success(
          'bank is successfully added with id ' + data.data
        );
        this.getAllBank();
      },
      error: (err) => {
        this.toastrService.error('something went wrong');
      },
    });
  }

  cancel_btn() {
    this.showForm = false;
    const bankForm = document.getElementById('createNewCategoryPopup');

    if (bankForm) {
      bankForm.style.display = 'none';
    }
  }

  deleteBank(bankId: number) {
    this.confirmAlertDisplay = true;
    this.deleteBankId = bankId;
    this.ngxModalService.getModal('confirmAlertPopup').open();
  }

  continuingDeleting(id: number) {
    this.bankService.deletebank(id).subscribe({
      next: (res) => {
        this.toastrService.success('bank has been deleted');
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.getAllBank();
      },
    });
  }

  destroyConfirmAlertSectionEmitter($event: boolean) {
    this.confirmAlertDisplay = false;
    this.ngxModalService.getModal('confirmAlertPopup').close();
    if ($event === true) {
      this.continuingDeleting(this.deleteBankId);
    }
  }

  resetForm() {
    this.bankObj = new Bank();
  }
  // for modal

  onCreate() {
    const createPopUp = document.getElementById(
      'bankPopup'
    ) as HTMLButtonElement;
    createPopUp.click();
  }

  cancel() {
    const popClose = document.getElementById('closeButton') as HTMLInputElement;
    popClose.click();
  }

  displayEditBankPopUp(bankData: Bank) {
    this.showableEditBank = true;
    this.editBank = bankData;
    this.ngxModalService.getModal('editBankPopup').open();
  }

  destroyEditBankPopup($event) {
    this.showableEditBank = false;
    this.ngxModalService.getModal('editBankPopup').close();
    if ($event === true) {
      this.getAllBank();
    }
  }
}
