import { Component } from '@angular/core';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/models/Bank';
import { BankList } from 'src/app/models/BankList';
import { BankWidthdraw } from 'src/app/models/Bankwithdraw';
import { DepostiWithDrawTyes } from 'src/app/models/DepositWithDrawTypes';
import { BankService } from 'src/app/service/shared/bank/bank.service';
import { BankwithdrawService } from 'src/app/service/shared/bankwithdraw/bankwithdraw.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-bank-withdraw',
  templateUrl: './bank-withdraw.component.html',
  styleUrls: ['./bank-withdraw.component.css'],
})
export class BankWithdrawComponent {
  withdrawId!: number;
  bankId!: number;
  companyId!: number;
  branchId!: number;
  banks: Bank[] = [];
  showForm!: boolean;
  withdraw: BankWidthdraw[] = [];
  objwidthdraw: BankWidthdraw = new BankWidthdraw();
  currentPageNumber: number = 1;
  pageTotalItems: number = 5;
  AdDateForDisplayOnly!: string;
  withDrawTypes!: DepostiWithDrawTyes[];
  bankWithDrawUpdateId!: number;
  showWithDrawEditComponent: boolean = false;
  isAccountant: boolean = false;
  isMaster: boolean = false;

  bankList: BankList[] = [];
  keyword = 'name';
  data: Array<any> = [];

  constructor(
    private loginService: LoginService,
    private bankService: BankService,
    private toastrService: ToastrService,
    private BankwithdrawService: BankwithdrawService,
    private ngxSmartModalService: NgxSmartModalService,
    public CommonService: CommonService
  ) {}

  ngOnInit() {
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.getAllBankWithdraw();
    this.getAllWithDrawTypes();
    this.fetchRelatedBanks();
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
      'createBankWithDrawPopup',
      'createBankWithDrawpopup'
    );
  }

  // for modal

  onCreate() {
    this.ngxSmartModalService.getModal('createBankWithDrawPopup').open();
  }

  getBankList() {
    this.bankService.getBankList().subscribe((data) => {
      this.data = data.data;
      this.bankList = data.data;
    });
  }

  // ng-autocomplete

  selectEvent(item) {
    this.bankId = item.bankId;
    alert(JSON.stringify(item));
  }

  cancel() {
    this.ngxSmartModalService.getModal('createBankWithDrawPopup').close();
  }

  getAllWithDrawTypes() {
    this.bankService.getDepositWithDrawTypes().subscribe((res) => {
      this.withDrawTypes = res.data;
    });
  }

  fetchRelatedBanks() {
    this.bankService
      .getAllBanks(this.companyId, this.branchId)
      .subscribe((data) => {
        this.banks = data.data;
      });
  }
  getAllBankWithdraw() {
    this.BankwithdrawService.getAllwithdraw(
      this.companyId,
      this.branchId
    ).subscribe((res) => {
      this.withdraw = res.data;
    });
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedWithdraws();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedWithdraws();
    }
  }

  fetchLimitedWithdraws() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    alert("df")
    this.BankwithdrawService.getLimitedWithdraw(
      offset,
      this.pageTotalItems,
      this.companyId,
      this.branchId
    ).subscribe((res) => {
      if (res.data.length === 0) {
        this.toastrService.error('withdraw not found ');
        this.currentPageNumber -= 1;
      } else {
        this.withdraw = res.data;
      }
    });
  }

  openForm() {
    this.resetForm();
    this.fetchRelatedBanks();
    // Reset form data
    this.companyId = this.companyId;
    this.branchId = this.branchId;
    this.showForm = true;

    // Show form
    setTimeout(() => {
      const dateEl = document.getElementById(
        'nepali-datepicker'
      ) as HTMLInputElement;
      dateEl.value = String(adToBs(new Date().toJSON().slice(0, 10)));

      const dateAdEl = document.getElementById('AdDate') as HTMLInputElement;
      dateAdEl.value = new Date().toJSON().slice(0, 10);
      this.AdDateForDisplayOnly = dateAdEl.value;
    }, 100);

    const bankForm = document.getElementById('createNewCategoryPopup');
    if (bankForm) {
      bankForm.style.display = 'block';
    }
  }
  creatwithdraw(form: any) {
    if (!this.objwidthdraw.bankId) {
      this.toastrService.error('Please Select a Bank');
      return;
    }
    this.showForm = false;
    this.objwidthdraw.companyId = this.loginService.getCompnayId();
    this.objwidthdraw.branchId = this.loginService.getBranchId();
    this.objwidthdraw.withdrawDate = new Date();

    var mainInput = document.getElementById(
      'nepali-datepicker'
    ) as HTMLInputElement;
    var nepaliDate = mainInput.value;

    var Input = document.getElementById('AdDate') as HTMLInputElement;
    var englishDate = Input.value;
    this.objwidthdraw.nepaliDate = nepaliDate;
    this.objwidthdraw.englishDate = new Date(englishDate + 'T00:00:00'); //avoid any potential time zone discrepancies so to ensure consistency
    this.BankwithdrawService.addWithdraw(this.objwidthdraw).subscribe({
      next: (data) => {
        this.toastrService.success(
          'widthdraw added sucessfull' + data.widthdrawId
        );
        this.getAllBankWithdraw();
        this.resetForm();
        this.ngxSmartModalService.getModal('createBankWithDrawPopup').close();
      },
      error: (err) => {
        this.toastrService.error('something wrong');
      },
    });
    const bankForm = document.getElementById('createNewCategoryPopup');
    if (bankForm) {
      bankForm.style.display = 'none';
      this.resetForm();
    }
  }
  cancel_btn() {
    this.resetForm();
    this.showForm = false;
    const bankForm = document.getElementById('createNewCategoryPopup');
    if (bankForm) {
      bankForm.style.display = 'none';
    }
  }
  disableWithDrawEditComponent($event: boolean) {
    this.showWithDrawEditComponent = false;
  }

  deletewithdraw(branchId: number, withdrawId: number) {
    this.BankwithdrawService.deletewithdraw(branchId, withdrawId).subscribe({
      next: (res) => {
        this.toastrService.success('deposite has been deleted' + withdrawId);
        this.getAllBankWithdraw();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.getAllBankWithdraw();
      },
    });
  }

  resetForm() {
    this.objwidthdraw = new BankWidthdraw();
  }

  editBankWithdraw(id: number) {
    this.ngxSmartModalService.getModal('editBankWithDrawPopup').open();
    this.showWithDrawEditComponent = true;
    this.bankWithDrawUpdateId = id;
  }

  checkWithDrawType(var1: any, var2: any): boolean {
    if (parseInt(var1) === parseInt(var2)) {
      return true;
    } else {
      return false;
    }
  }
}
