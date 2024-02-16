import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import { ToastrService } from 'ngx-toastr';
import { CustomerMetaData } from 'src/app/models/CustomerMetaData';
import { Payment } from 'src/app/models/Payment/payment';
import { PaymentMode } from 'src/app/models/Payment/paymentMode';
import { Company } from 'src/app/models/company';
import { PaymentService } from 'src/app/service/shared/Payment/payment.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { CommonService } from '../../../../service/shared/common/common.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { BankService } from 'src/app/service/shared/bank/bank.service';
import { Bank } from 'src/app/models/Bank';
import { BankList } from 'src/app/models/BankList';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  updatePayment!: Payment;
  paymentMode!: PaymentMode[];
  payment: Payment[] = [];
  loggedInCompanyId!: number;
  loggedInBranchId!: number;
  postDateCheckEnable: boolean = false;
  cheque!: boolean;

  selectSenderActive: boolean = false;
  sellerSearchMethod: number = 1;
  searchCompanyDetails!: Company[];

  sellerId: number | undefined = 0;
  sellerName!: string;
  sellerPan!: number;
  sellerAddress!: string;
  partyId!: string;
  selectMenusForCompanies!: Company[];
  selectMenusForCompaniesSize!: number;
  customerMetaData!: CustomerMetaData;
  createCustomerEnable: boolean = false;
  selectCustomerEnable: boolean = false;
  createCustomerToggle: boolean = false;
  sellerPanOrPhone!: number;

  paymentIdForEdit!: number;

  isAccountant: boolean = false;
  isMaster: boolean = false;

  currentPageNumber: number = 1;
  pageTotalItems: number = 5;
  bankList: BankList[] = [];
  keyword = 'name';
  data: Array<any> = [];
  bankName: string = '';

  isFromPurchase: boolean = false;

  PaymentForm = new FormGroup({
    partyId: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
    Tds: new FormControl('false', []),
    postDateCheck: new FormControl(''),
    paymentModeId: new FormControl('', [Validators.required]),
    postCheckDate: new FormControl(''),
    checkNo: new FormControl(''),
    // NepaliDate: new FormControl(''),
  });

  constructor(
    private paymentService: PaymentService,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private companyService: CompanyServiceService,
    public CommonService: CommonService,
    private NgxSmartModalService: NgxSmartModalService,
    private bankService: BankService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.PaymentForm.reset();
    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length !== 0) {
        const partyId = params['creditorPan'];
        if (partyId) {
          this.isFromPurchase = true;
          setTimeout(() => {
            this.onCreate();
            this.PaymentForm.patchValue({
              partyId: partyId,
            });
            this.partyId = partyId;
          });
        }
        history.replaceState({}, '', window.location.pathname);
      }
    });

    this.loggedInCompanyId = this.loginService.getCompnayId();
    this.loggedInBranchId = this.loginService.getBranchId();

    this.getPaymentdetails();

    this.paymentService.getPaymentModeDetails().subscribe((res) => {
      this.paymentMode = res.data;
    });
    let roles = this.loginService.getCompanyRoles();
    if (roles?.includes('ACCOUNTANT')) {
      this.isAccountant = true;
    } else if (roles.includes('ADMIN')) {
      this.isMaster = true;
    } else {
      this.isAccountant = false;
      this.isMaster = false;
    }
    this.fetchLimitedPayment();
    this.getBankList();
  }

  ngAfterViewInit() {
    this.NgxSmartModalService.getModal('createNewPayment').onClose.subscribe(
      (event) => {
        if (event) {
          this.isFromPurchase = false;
          this.PaymentForm.reset();
        }
      }
    );
  }

  getBankList() {
    this.bankService.getBankList().subscribe((data) => {
      this.data = data.data;
    });
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedPayment();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedPayment();
    }
  }

  fetchLimitedPayment() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.paymentService
      .getLimitedPaymentDetails(
        offset,
        this.pageTotalItems,
        this.loggedInCompanyId,
        this.loggedInBranchId
      )
      .subscribe((res) => {
        if (res.data.length === 0 || res.data === undefined) {
          this.toastrService.error('payment details not found ');
          this.currentPageNumber -= 1;
        } else {
          this.payment = res.data;
        }
      });
  }

  getPaymentdetails() {
    this.paymentService
      .getPaymentDetails(this.loggedInCompanyId)
      .subscribe((res) => {
        this.payment = res.data;
      });
  }

  displayAddCustomerPopup() {
    this.createCustomerToggle = true;
    this.createCustomerEnable = true;
  }

  fetchPurchaserInfo() {
    this.partyId = this.PaymentForm.value.partyId
      ? this.PaymentForm.value.partyId
      : '';
    if (this.partyId === null || this.partyId === undefined) {
      this.toastrService.error(`pan or phone`, 'invalid number');
      return;
      // return;
    }
    this.selectCustomerEnable = true;
    setTimeout(() => {
      this.createCustomerEnable = false;
      this.NgxSmartModalService.getModal('selectCustomerPopup').open();
    }, 400);
    setTimeout(() => {
      this.companyService
        .getCustomerInfoByPanOrPhone(
          this.sellerSearchMethod,
          Number(this.partyId)
        )
        .subscribe({
          next: (data) => {
            this.selectMenusForCompanies = data.data;
            this.selectMenusForCompaniesSize = data.data.length;

            let customerMetaData = new CustomerMetaData();
            customerMetaData.customers = data.data;
            customerMetaData.customerPanOrPhone = this.sellerPan;
            this.customerMetaData = customerMetaData;
          },
          complete: () => {},
        });
    }, 400);
  }

  setSellerInfo(compId: number) {
    let comp: Company = this.selectMenusForCompanies.find(
      (comp) => Number(comp.companyId) === Number(compId)
    )!;
    this.sellerId = comp.companyId;
    this.sellerName = comp.name;
    this.sellerPan = Number(comp.panNo);
    this.sellerAddress = comp.munVdc + comp.wardNo;
    this.destroySelectSenderComponent(true);
  }
  destroySelectSenderComponent($event: boolean) {
    this.selectSenderActive = false;
    this.selectCustomerEnable = false;
    this.NgxSmartModalService.getModal('selectCustomerPopup').close();
  }

  fetchSellerInfoOnlyForNameDisplay($event: number) {
    this.companyService
      .getCustomerInfoByPanOrPhone(
        this.sellerSearchMethod,
        Number(this.partyId)
      )
      .subscribe({
        next: (data) => {
          this.selectMenusForCompanies = data.data;
          this.selectMenusForCompaniesSize = data.data.length;
          this.setSellerInfo($event);
        },
      });
  }

  // console.log(this.cheque, this.PaymentForm.value.checkNo);

  postCheckDate(e: any) {
    if (e.target.value === 'true') {
      this.postDateCheckEnable = true;
    }
  }
  paymentModeChange(data: string) {
    if (data === '2') {
      this.cheque = true;
    } else {
      this.cheque = false;
      this.postDateCheckEnable = false;
    }
  }

  editPayment(sn: number) {
    this.paymentIdForEdit = sn;
    console.log(sn);
  }

  change(e: any) {
    console.log(e);
  }

  deletePayment(Sn: number) {
    this.paymentService.deleteFromPaymentDetails(Sn).subscribe({
      complete: () => {
        this.getPaymentdetails();
      },
    });
  }

  getDetails() {
    this.getPaymentdetails();
  }

  createPaymentDetails() {
    const date = new Date();
    const newdate = date.toJSON().slice(0, 10);

    const paymentDetails = {
      sn: 0,
      companyId: this.loggedInCompanyId,
      branchId: this.loggedInBranchId,
      partyId: this.partyId,
      amount: Number(this.PaymentForm.value.amount),
      paymentModeId: Number(this.PaymentForm.value.paymentModeId),
      tdsDeducted: Boolean(this.PaymentForm.value.Tds),
      postDateCheck: this.postDateCheckEnable,
      date: newdate,
      postCheckDate: '',
      checkNo: 0,
      paymentStatus: true,
      postDateCheckStatus: true,
      postCheckDateNepali: '',
      nepaliDate: '',
      bankName: '',
    };

    if (!this.cheque) {
      this.paymentService.addPaymentDetails(paymentDetails).subscribe({
        complete: () => {
          this.getPaymentdetails();
        },
        next: () => {
          this.PaymentForm.reset();
          this.NgxSmartModalService.getModal('createNewPayment').close();
        },
      });
    } else if (this.cheque && Number(this.PaymentForm.value.checkNo) !== 0) {
      if (this.bankName == '' || !this.bankName) {
        this.toastrService.error('Please select the associated Bank ');
      } else {
        if (this.postDateCheckEnable) {
          const mainInput = document.getElementById(
            'nepali-datepicker'
          ) as HTMLInputElement;
          const nepaliDate = mainInput.value;
          const englishDate = (
            document.getElementById('AdDate') as HTMLInputElement
          ).value;

          paymentDetails.postCheckDate = englishDate;
          paymentDetails.checkNo = Number(this.PaymentForm.value.checkNo);
          paymentDetails.postCheckDateNepali = nepaliDate;
          paymentDetails.nepaliDate = String(adToBs(newdate));
          paymentDetails.bankName = this.bankName;

          this.paymentService.addPaymentDetails(paymentDetails).subscribe({
            complete: () => {
              this.getPaymentdetails();
            },
            next: () => {
              this.PaymentForm.reset();
              this.NgxSmartModalService.getModal('createNewPayment').close();
            },
          });
        } else {
          paymentDetails.checkNo = Number(this.PaymentForm.value.checkNo);
          paymentDetails.bankName = this.bankName;

          this.paymentService.addPaymentDetails(paymentDetails).subscribe({
            complete: () => {
              this.getPaymentdetails();
            },
            next: () => {
              this.PaymentForm.reset();
              this.NgxSmartModalService.getModal('createNewPayment').close();
            },
          });
        }
      }
    } else if (this.cheque && Number(this.PaymentForm.value.checkNo) === 0) {
      this.toastrService.error('Please enter Checkno');
    }
  }

  onCreate() {
    this.NgxSmartModalService.getModal('createNewPayment').open();
  }

  cancel() {
    this.NgxSmartModalService.getModal('createNewPayment').close();
  }

  getCompanyList() {
    this.companyService.getAllCompanies().subscribe({
      next: (data) => {
        this.selectMenusForCompanies = data.data;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  customerAddedSuccessfully($event: number) {
    this.toastrService.success('Customer successfully added with id ' + $event);
    if ($event && $event != undefined) {
      this.companyService
        .getCompnayDetailsByCompanyid($event)
        .subscribe((res) => {
          if (res) {
            let comp = res.data;
            this.sellerId = comp.companyId;
            this.sellerName = comp.name;
            this.sellerPan = Number(comp.panNo);
            this.sellerAddress = comp.munVdc + comp.wardNo;
          }
        });
    }
  }

  destroyCreateCustomerComp($event: boolean) {
    this.createCustomerToggle = false;
  }

  // ng-autocomplete

  selectEvent(item) {
    this.bankName = item.name;
  }
}
