import { Component, ElementRef, Renderer2 } from '@angular/core';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/models/Bank';
import { Deposit } from 'src/app/models/BankDeposite';
import { BankList } from 'src/app/models/BankList';
import { CustomerMetaData } from 'src/app/models/CustomerMetaData';
import { DepostiWithDrawTyes } from 'src/app/models/DepositWithDrawTypes';
import { Company } from 'src/app/models/company';
import { BankService } from 'src/app/service/shared/bank/bank.service';
import { BankdepositeService } from 'src/app/service/shared/bankdeposite/bankdeposite.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-bank-deposit',
  templateUrl: './bank-deposit.component.html',
  styleUrls: ['./bank-deposit.component.css'],
})
export class BankDepositComponent {
  depositId!: number;
  bankId!: number;
  branchId!: number;
  companyId!: number;
  depositAmount!: number;
  depositeType!: string;
  chequeNumber!: string;
  selectDepositorEnable: boolean = false;
  deposites: Deposit[] = [];
  banks: Bank[] = [];
  bankList: BankList[] = [];

  showForm!: boolean;
  localStorageCompanyId!: string;
  AdDateForDisplayOnly: string = '55';
  objdeposite: Deposit = new Deposit();
  depositTypes!: DepostiWithDrawTyes[];
  showDepositEditComponent = false;
  bankDepositUpdateId!: number;
  selectMenusForDepositor!: Company[];
  selectMenusForDepositorSize!: number;
  depositorSearchMethod: number = 1;
  depositorPhoneOrPan!: number;
  depositorMetaData: CustomerMetaData = new CustomerMetaData();
  createCustomerToggle: boolean = false;
  createCustomerEnable: boolean = false;

  currentPageNumber: number = 1;
  pageTotalItems: number = 5;

  isAccountant: boolean = false;
  isMaster: boolean = false;

  constructor(
    private bankdepositeService: BankdepositeService,
    private bankService: BankService,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private companyService: CompanyServiceService,
    private renderer: Renderer2,
    private el: ElementRef,
    private ngxSmartModalService: NgxSmartModalService,
    public CommonService: CommonService
  ) {}
  ngOnInit() {
    // const data = localStorage.getItem('companyDetails');
    // const parsedData = JSON.parse(data || '{}');
    // const { companyId } = parsedData;
    // this.localStorageCompanyId = companyId;

    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.getAllBankDeposite();
    this.getAlldepositTypes();
    this.fetchRelatedBanks();
    this.getBankList();

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
      'createBankDeposit',
      'createBankDepositPopup'
    );
  }

  onEnter(event: Event): void {
    event.preventDefault(); // Prevent the default form submission behavior
    // You can add any custom logic here if needed
  }

  getBankList() {
    this.bankService.getBankList().subscribe((data) => {
      this.bankList = data.data;
    });
  }

  fetchRelatedBanks() {
    this.bankService
      .getAllBanks(this.companyId, this.branchId)
      .subscribe((data) => {
        this.banks = data.data;
      });
  }
  getAllBankDeposite() {
    this.bankdepositeService
      .getAlldeposite(this.companyId, this.branchId)
      .subscribe((res) => {
        this.deposites = res.data;
      });
  }

  getAlldepositTypes() {
    this.bankService.getDepositWithDrawTypes().subscribe((res) => {
      this.depositTypes = res.data;
    });
  }

  disableDepositEditComp($event: any) {
    this.showDepositEditComponent = false;
    this.getAllBankDeposite();
  }

  openForm() {
    this.resetForm();
    console.log('Opening form...');
    this.fetchRelatedBanks();
    // console.log(this.banks[0])
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

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedBankDeposits();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedBankDeposits();
    }
  }

  fetchLimitedBankDeposits() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.bankdepositeService
      .getLimitedDeposits(
        offset,
        this.pageTotalItems,
        this.companyId,
        this.branchId
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.toastrService.error('deposits not found ');
          this.currentPageNumber -= 1;
        } else {
          this.deposites = res.data;
        }
      });
  }

  creatdepostie(form: any) {
    this.showForm = false;
    this.objdeposite.companyId = this.companyId;
    this.objdeposite.branchId = this.branchId;
    this.objdeposite.submitDate = new Date();
    var mainInput = document.getElementById(
      'nepali-datepicker'
    ) as HTMLInputElement;
    var nepaliDate = mainInput.value;

    var Input = document.getElementById('AdDate') as HTMLInputElement;
    var englishDate = Input.value;
    this.objdeposite.nepaliDate = nepaliDate;
    this.objdeposite.englishDate = new Date(englishDate + 'T00:00:00'); //avoid any potential time zone discrepancies so to ensure consistency
    console.log(this.objdeposite);
    this.bankdepositeService.addDeposite(this.objdeposite).subscribe({
      next: (data) => {
        this.cancel(form);
        this.toastrService.success('deposite added sucessfull' + data.bankId);
        this.getAllBankDeposite();
      },
      error: (err) => {
        this.toastrService.error('something wrong');
      },
    });

    // submitForm() {
    //   // if (this.bankId.trim() === '' || this.depositAmount.trim() === '' || this.depositeType.trim() === '' || this.chequeNumber.trim() === '') {
    //   //   alert('Please fill in all fields');
    //   //   return;
    //   // }

    //   // Replace this with the code that handles the form data
    //   console.log('Company ID:', this.companyId);
    //   console.log('Branch ID:', this.branchId);
    //   console.log('Bank ID:', this.bankId);
    //   console.log('depositAmount:', this.depositAmount);
    //   // console.log('Initial Amount:', this.initialAmount);
    //   // console.log('Account Type:', this.accountType);
    //   this.showForm = false;
    //   this.bankdepositeService.addDeposite({
    //     bankId: this.bankId, companyId: this.companyId, branchId: this.branchId, depositAmount: this.depositAmount, depositeType: this.depositeType,
    //     depositId: '0',
    //     chequeNumber: this.chequeNumber
    //   }).subscribe({
    //     next:()=>{
    //       this.getAllBankDeposite()
    //     },error:(err)=>{
    //       console.log(err)
    //     }
    //   })

    const bankForm = document.getElementById('createNewCategoryPopup');
    if (bankForm) {
      bankForm.style.display = 'none';
      this.resetForm();
    }
  }

  fetchDepositer(panOrPhone: number) {
    if (panOrPhone === null || panOrPhone === undefined) {
      this.toastrService.error(' invalid pan or phone ');
      return;
    }
    this.selectDepositorEnable = true;

    setTimeout(() => {
      this.ngxSmartModalService.getModal('selectDepositorPopup').open();
    }, 1);
    this.companyService
      .getCustomerInfoByPanOrPhone(this.depositorSearchMethod, panOrPhone)
      .subscribe((res) => {
        this.selectMenusForDepositor = res.data;
        this.selectMenusForDepositorSize = res.data.length;
        let depositoryData = new CustomerMetaData();
        depositoryData.customers = res.data;
        depositoryData.customerPanOrPhone = panOrPhone;
        this.depositorMetaData = depositoryData;
      });
  }

  setDepositorInfo(compId: number) {
    let comp: Company = this.selectMenusForDepositor.find((comp) => {
      return Number(comp.companyId) === compId;
    })!;

    this.objdeposite.depositedBy = compId;
    const depositorNameEl = document.getElementById(
      'depositorName'
    ) as HTMLSpanElement;
    depositorNameEl.innerText = comp.name;
    this.destroySelectDepositorComponent(true);
  }

  destroySelectDepositorComponent($event: boolean) {
    this.selectDepositorEnable = false;
    this.ngxSmartModalService.getModal('selectDepositorPopup').close();
  }

  cancel_btn() {
    this.resetForm();
    this.showForm = false;
    const bankForm = document.getElementById('createNewCategoryPopup');
    if (bankForm) {
      bankForm.style.display = 'none';
    }
  }

  deleteDeposite(branchId: number, depositId: number) {
    this.bankdepositeService.deleteDeposite(branchId, depositId).subscribe({
      next: (res) => {
        this.toastrService.success('deposite has been deleted' + depositId);
        this.getAllBankDeposite();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.getAllBankDeposite();
      },
    });
  }
  resetForm() {
    this.objdeposite = new Deposit();
  }

  editBankDeposit(id: number) {
    this.showDepositEditComponent = true;
    this.bankDepositUpdateId = id;
  }

  // for modal

  onCreate() {
    this.ngxSmartModalService.getModal('createBankDeposit').open();
    const dsf = document.getElementsByClassName(
      'nsm-content'
    ) as HTMLCollection;
    const el = dsf[0] as HTMLElement;
    el.style.width = '900px';
  }
  cancel(createDepositeForm: any) {
    this.ngxSmartModalService.getModal('createBankDeposit').close();
    createDepositeForm.reset();
  }

  getDepositTypeName(id: any) {
    this.depositTypes.forEach((dt) => {
      if (dt.id === parseInt(id)) {
        return dt.name;
      }
      return;
    });
  }

  displayAddCustomerPopup() {
    this.createCustomerToggle = true;
    this.createCustomerEnable = true;
  }

  destroyCreateCustomerComp($event: boolean) {
    this.createCustomerToggle = false;
  }
  customerAddedSuccessfully($event: number) {
    this.toastrService.success('Customer successfully added with id ' + $event);
  }

  checkDepositType(v1: any, v2: any): boolean {
    if (parseInt(v1) === parseInt(v2)) {
      return true;
    } else {
      return false;
    }
  }
}
