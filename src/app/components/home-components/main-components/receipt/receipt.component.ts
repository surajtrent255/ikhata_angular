import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { CustomerMetaData } from 'src/app/models/CustomerMetaData';
import { PaymentMode } from 'src/app/models/Payment/paymentMode';
import { Receipts } from 'src/app/models/Receipt';
import { Company } from 'src/app/models/company';
import { PaymentService } from 'src/app/service/shared/Payment/payment.service';
import { ReceiptService } from 'src/app/service/shared/Receipt/receipt.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
})
export class ReceiptComponent {
  receipts: Receipts[] = [];
  companyId!: number;
  branchId!: number;
  postDateCheckEnable!: boolean;
  paymentMode!: PaymentMode[];
  isAccountant: boolean = false;
  isMaster: boolean = false;
  cheque!: boolean;

  selectSenderActive: boolean = false;
  sellerSearchMethod: number = 1;
  searchCompanyDetails!: Company[];

  sellerId: number | undefined = 0;
  sellerName!: string;
  sellerPan!: number;
  sellerAddress!: string;
  partyId!: number;
  selectMenusForCompanies!: Company[];
  selectMenusForCompaniesSize!: number;
  customerMetaData!: CustomerMetaData;

  currentPageNumber: number = 1;
  pageTotalItems: number = 5;
  enableCreateReceiptBtn: boolean = true;
  deleteReceiptId !: number ;
  confirmAlertDisplay: boolean = false; 

  ReciptForm = new FormGroup({
    partyId: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
    Tds: new FormControl('', [Validators.required]),
    postDateCheck: new FormControl('', [Validators.required]),
    paymentModeId: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    // NepaliDate: new FormControl(''),
  });

  @ViewChild("createReceipt", {static: false}) createReceiptBtn!:ElementRef
  constructor(
    private receiptService: ReceiptService,
    private loginService: LoginService,
    private paymentService: PaymentService,
    private toastrService: ToastrService,
    private companyService: CompanyServiceService,
    private route: ActivatedRoute,
    private renderer2: Renderer2,
    public commonService: CommonService,
    private ngxSmartModalService: NgxSmartModalService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params)=>{
      if(Object.keys(params).length !== 0){
        const partyId = params['debtorPan'];
        setTimeout(()=>{
          // const createReceiptEl = document.getElementById("createReceiptBtn") as HTMLAnchorElement;
          // createReceiptEl.click();
          this.createReceiptBtn.nativeElement.click();
          // this.renderer2.selectRootElement(this.createReceiptBtn.nativeElement).click();
          this.ReciptForm.patchValue({
            partyId: partyId
          })

        })
      } 
    })
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.getReceipts();
    this.paymentService.getPaymentModeDetails().subscribe((res) => {
      console.log(res.data);
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
  }


  ngAfterViewInit() {
    this.commonService.enableDragging('confirmAlertPopup', 'confirmAlertpopup');
  }
  getReceipts() {
    this.receiptService.getReceipts(this.companyId).subscribe((res) => {
      this.receipts = res.data;
    });
  }

  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = this.addZeroPadding(date.getMonth() + 1);
    const day = this.addZeroPadding(date.getDate());
    return `${year}-${month}-${day}`;
  }

  addZeroPadding(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedReceipts();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedReceipts();
    }
  }

  fetchLimitedReceipts() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.receiptService
      .getLimitedReceipts(
        offset,
        this.pageTotalItems,
        this.companyId,
        this.branchId
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.toastrService.error('receipts not found ');
          this.currentPageNumber -= 1;
        } else {
          this.receipts = res.data;
        }
      });
  }

  paymentModeChange(data: string) {
    console.log(data);
    if (data === '2') {
      this.ReciptForm.get('postDateCheck')?.enable();
    } else {
      this.ReciptForm.get('postDateCheck')?.disable();
    }
  }

  onSubmit() {
    this.enableCreateReceiptBtn = false;
    var mainInput = document.getElementById(
      'nepali-datepicker'
    ) as HTMLInputElement;
    var nepaliDate = mainInput.value;

    var Input = document.getElementById('AdDate') as HTMLInputElement;
    var englishDate = Input.value;
    this.receiptService
      .addReceipts({
        sn: 0,
        companyId: this.companyId,
        branchId: this.branchId,
        amount: Number(this.ReciptForm.value.amount!),
        date: new Date(englishDate),
        modeId: Number(this.ReciptForm.value.paymentModeId),
        partyId: Number(this.ReciptForm.value.partyId),
        postDateCheck: Boolean(this.ReciptForm.value.postDateCheck),
        status: true,
        tdsDeductedAmount: Number(this.ReciptForm.value.Tds),
        nepaliDate: nepaliDate,
      })
      .subscribe({
        complete: () => {
          this.getReceipts();
          const popClose = document.getElementById(
            'closeButton'
          ) as HTMLInputElement;
          popClose.click();
        },
        next: (res) => {
          this.ReciptForm.reset();
          this.enableCreateReceiptBtn = true;
        },
      });
  }

  deleteReceipt(sn: number) {
    this.confirmAlertDisplay = true;
    this.deleteReceiptId = sn;
    this.ngxSmartModalService.getModal('confirmAlertPopup').open();
  }

  continuingDeleting(sn: number) {
    this.receiptService.deleteReceipt(sn).subscribe({
      complete: () => {
        this.getReceipts();
      },
    });
  }

  fetchPurchaserInfo() {
    this.partyId = Number(this.ReciptForm.value.partyId);
    if (this.partyId === null || this.partyId === undefined) {
      this.toastrService.error(`pan or phone`, 'invalid number');
      return;
      // return;
    }
    setTimeout(() => {
      this.selectSenderActive = true;
    }, 400);
    const selectSellerBtn = document.getElementById(
      'selectSeller'
    ) as HTMLButtonElement;
    selectSellerBtn.click();

    this.companyService
      .getCustomerInfoByPanOrPhone(this.sellerSearchMethod, this.partyId)
      .subscribe({
        next: (data) => {
          this.selectMenusForCompanies = data.data;
          this.selectMenusForCompaniesSize = data.data.length;

          let customerMetaData = new CustomerMetaData();
          customerMetaData.customers = data.data;
          customerMetaData.customerPanOrPhone = this.sellerPan;
          this.customerMetaData = customerMetaData;
        },
        complete: () => {
          const custBtn = document.getElementById(
            'selectPurchaser'
          ) as HTMLButtonElement;
          custBtn.click();
        },
      });
  }

  destroySelectSenderComponent($event: boolean) {
    this.selectSenderActive = false;
  }

  fetchSellerInfoOnlyForNameDisplay($event: number) {
    this.companyService
      .getCustomerInfoByPanOrPhone(this.sellerSearchMethod, this.partyId)
      .subscribe({
        next: (data) => {
          this.selectMenusForCompanies = data.data;
          this.selectMenusForCompaniesSize = data.data.length;
          this.setSellerInfo($event);
        },
      });
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

  onCreate() {
    const createPopUp = document.getElementById(
      'ReceiptPopup'
    ) as HTMLButtonElement;
    createPopUp.click();
  }

  cancel() {
    const popClose = document.getElementById('closeButton') as HTMLInputElement;
    popClose.click();
  }

  destroyConfirmAlertSectionEmitter($event: boolean) {
    this.confirmAlertDisplay = false;
    this.ngxSmartModalService.getModal('confirmAlertPopup').close();
    if ($event === true) {
      this.continuingDeleting(this.deleteReceiptId);
    }
  }
  
}
