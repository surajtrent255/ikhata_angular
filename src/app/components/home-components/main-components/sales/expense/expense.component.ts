import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { CustomerMetaData } from 'src/app/models/CustomerMetaData';
import { Expense } from 'src/app/models/Expense/Expense';
import { ExpenseTopic } from 'src/app/models/Expense/ExpenseTopic';
import { Company } from 'src/app/models/company';
import { ExpenseService } from 'src/app/service/shared/Assets And Expenses/expense.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent {
  // for Display
  expenses: Expense[] = [];
  expenseIdForEdit!: number;
  expenseTopics: ExpenseTopic[] = [];
  LoggedInCompanyId!: number;
  LoggedInBranchId!: number;
  enableCreateExpenseTopic: boolean = false;
  isAccountant: boolean = false;
  isMaster: boolean = false;
  sellerPhoneOrPan!: number;
  selectSellerEnable: boolean = false;
  sellerSearchMethod: number = 1;
  sellerMetaData: CustomerMetaData = new CustomerMetaData();
  selectMenusForCompanies!: Company[];
  customers: Company[] = [];
  selectMenusForCompaniesSize!: number;
  sellerId: number = 0;
  sellerName: string = '';
  sellerPan: number = 0;
  doesSellerhavePan: boolean = true;

  currentPageNumber: number = 1;
  pageTotalItems: number = 5;
  enableEditExpense: boolean = false;
  ExpenseForm = new FormGroup({
    amount: new FormControl('', [Validators.required]),
    topic: new FormControl(0, [Validators.required]),
    billNo: new FormControl(''),
    payTo: new FormControl(0, [Validators.required]),
  });

  constructor(
    private expenseService: ExpenseService,
    private loginService: LoginService,
    private tostrService: ToastrService,
    private ngxSmartModalService: NgxSmartModalService,
    private ngxSmartModuleService: NgxSmartModalService,
    private companyService: CompanyServiceService,
    private renderer: Renderer2,
    private el: ElementRef,
    public CommonService: CommonService
  ) {}

  ngOnInit() {
    this.LoggedInBranchId = this.loginService.getBranchId();
    this.LoggedInCompanyId = this.loginService.getCompnayId();
    this.getExpenseTopics();
    this.getExpenseDetails();
    this.fetchAllCustomers();
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
    this.CommonService.enableDragging('createExpense', 'createexpense');
    this.CommonService.enableDragging('editExpense', 'editexpense');
    this.CommonService.enableDragging(
      'newExpenseTopicPopup',
      'newExpenseTopicpopup'
    );
  }

  fetchAllCustomers() {
    this.companyService.getAllCompanies().subscribe((data) => {
      this.customers = data.data;
    });
  }
  fetchCustomerInfo() {
    if (this.sellerPhoneOrPan === null || this.sellerPhoneOrPan === undefined) {
      this.tostrService.error(`pan or phone`, 'invalid number');
      return;
    }
    this.selectSellerEnable = true;

    setTimeout(() => {
      this.ngxSmartModalService.getModal("selectSellerPopup").open();
    }, 400);

    setTimeout(() => {
      this.companyService
        .getCustomerInfoByPanOrPhone(
          this.sellerSearchMethod,
          this.sellerPhoneOrPan
        )
        .subscribe({
          next: (data) => {
            this.selectMenusForCompanies = data.data;
            this.selectMenusForCompaniesSize = data.data.length;
            let sellerMetaData = new CustomerMetaData();
            sellerMetaData.customers = data.data;
            sellerMetaData.customerPanOrPhone = this.sellerPhoneOrPan;
            this.sellerMetaData = sellerMetaData;
          },
          complete: () => {},
        });
    }, 600);
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedExpensesDetail();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedExpensesDetail();
    }
  }

  fetchLimitedExpensesDetail() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.expenseService
      .getLimitedExpenseDetail(
        offset,
        this.pageTotalItems,
        this.LoggedInCompanyId,
        this.LoggedInBranchId
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.tostrService.error('expense not found ');
          this.currentPageNumber -= 1;
        } else {
          this.expenses = res.data;
        }
      });
  }

  getExpenseDetails() {
    this.expenseService
      .getExpenseDetails(this.LoggedInCompanyId)
      .subscribe((res) => {
        this.expenses = res.data;
      });
  }

  getExpenseTopics() {
    this.expenseService.getExpenseTopics().subscribe((res) => {
      this.expenseTopics = res.data;
    });
  }

  SubmitExpenseForm() {
    var mainInput = document.getElementById(
      'nepali-datepicker'
    ) as HTMLInputElement;
    var nepaliDate = mainInput.value;

    var Input = document.getElementById('AdDate') as HTMLInputElement;
    var englishDate = Input.value;

    this.expenseService
      .addExpenseDetails({
        sn: 0,
        companyId: this.LoggedInCompanyId,
        branchId: this.LoggedInBranchId,
        amount: Number(this.ExpenseForm.value.amount!),
        billNo: this.ExpenseForm.value.billNo!,
        date: englishDate,
        payTo: this.ExpenseForm.value.payTo!,
        status: true,
        topic: this.ExpenseForm.value.topic!,
        nepaliDate: nepaliDate,
      })
      .subscribe({
        complete: () => {
          this.getExpenseDetails();
        },
        next: () => {
          this.ExpenseForm.reset();
          this.destroyCreateExpense();
        },
      });
  }

  deleteExpenseDetails(SN: number) {
    this.expenseService.deleteExpenseDetails(SN).subscribe({
      complete: () => {
        this.getExpenseDetails();
      },
    });
  }

  editExpense(sn: number) {
    this.enableEditExpense = true;
    this.expenseIdForEdit = sn;
    this.ngxSmartModuleService.getModal('editExpense').open();
  }

  updatedSuccessfull($event) {
    this.fetchLimitedExpensesDetail();
    this.destroyExpenseEditComponent($event);
  }

  getAllExpenseDetails() {
    this.getExpenseDetails();
  }

  destroyExpenseEditComponent($event: boolean) {
    this.expenseIdForEdit = 0;
    this.enableEditExpense = false;
    this.ngxSmartModuleService.getModal('editExpense').close();
  }

  openCreateExpenseForm() {
    this.ngxSmartModalService.getModal('createExpense').open();
    setTimeout(() => {
      const elements: HTMLCollectionOf<Element> =
        document.getElementsByClassName('nsm-dialog');

      if (elements) {
        const element = elements[0] as HTMLElement;
        element.style.maxWidth = 'fit-content';
      }
    }, 200);
  }

  destroyCreateExpense() {
    this.ExpenseForm.reset();
    this.ngxSmartModalService.getModal('createExpense').close();
  }

  displayCreateExpenseTopicComp() {
    this.enableCreateExpenseTopic = true;
    this.ngxSmartModalService.getModal('newExpenseTopicPopup').open();
  }

  destroyCreateExpenseTopic($event: any) {
    this.enableCreateExpenseTopic = false;
    this.ngxSmartModalService.getModal('newExpenseTopicPopup').close();
  }

  expenseTopicAdded($event: any) {
    this.tostrService.success('topic added successfully ');
    this.destroyCreateExpenseTopic($event);
    this.getExpenseTopics();
  }

  setCustomerInfo(compId: number) {
    let comp: Company = this.selectMenusForCompanies.find(
      (comp) => Number(comp.companyId) === Number(compId)
    )!;
    this.sellerId = comp.companyId;
    this.sellerName = comp.name;
    this.sellerPan = Number(comp.panNo);
    if (this.sellerPan > 0) {
      this.doesSellerhavePan = true;
    } else {
      this.doesSellerhavePan = false;
    }
    this.ExpenseForm.get('payTo')?.setValue(this.sellerId);
    const el = document.querySelector('#payTo') as HTMLInputElement;
    el.value = String(this.sellerPan);
    // const closeCustomerPopUpEl = document.getElementById(
    // 'closeCustPop'
    // ) as HTMLAnchorElement;
    // closeCustomerPopUpEl.click();

    this.destroySelectSellerComponent(true);
  }

  fetchCustomerInfoOnlyForNameDisplay($event: number) {
    this.companyService
      .getCustomerInfoByPanOrPhone(
        this.sellerSearchMethod,
        this.sellerPhoneOrPan
      )
      .subscribe({
        next: (data) => {
          this.selectMenusForCompanies = data.data;
          this.selectMenusForCompaniesSize = data.data.length;
          this.setCustomerInfo($event);
        },
      });
  }

  destroySelectSellerComponent($event: boolean) {
    setTimeout(() => {
      this.selectSellerEnable = false;
      this.ngxSmartModalService.getModal("selectSellerPopup").close();
    });
  }

  handlePayTO(panOrphone: string) {
    this.sellerPhoneOrPan = Number(panOrphone);
    this.fetchCustomerInfo();
  }
}
