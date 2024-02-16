import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  NgZone,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, filter, takeUntil } from 'rxjs';
import { CustomerMetaData } from 'src/app/models/CustomerMetaData';
import { Product } from 'src/app/models/Product';
import { SalesBill } from 'src/app/models/SalesBill';
import { SalesBillDetail } from 'src/app/models/SalesBillDetail';
import { SalesBillDetailWithProdInfo } from 'src/app/models/SalesBillDetailWithProdInfo';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { SalesBillMaster } from 'src/app/models/SalesBillMaster';
import { UserFeature } from 'src/app/models/UserFeatures';
import { VatRateTypes } from 'src/app/models/VatRateTypes';
import { Company } from 'src/app/models/company';
import { RJResponse } from 'src/app/models/rjresponse';
import { ProductService } from 'src/app/service/product.service';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { SalesCartService } from 'src/app/service/shared/sales-cart-service.service';
import { VatRateTypesService } from 'src/app/service/shared/vat-rate-types.service';

@Component({
  selector: 'app-create-sales',
  templateUrl: './create-sales.component.html',
  styleUrls: ['./create-sales.component.css'],
})
export class CreateSalesComponent {
  @ViewChild('saleTheProductBtn', { static: true })
  saleTheProductBtn!: ElementRef;

  @ViewChild('productName', { static: true }) productName!: ElementRef;

  @ViewChild('createCustomerBtn', { static: true })
  createCustomerBtn!: ElementRef;

  @ViewChild('prodQtyInput', { static: false }) prodQtyInput!: ElementRef;
  @ViewChild('custPanOrPhoneInput', { static: false })
  custPanOrPhoneInput!: ElementRef;
  @ViewChild('productBarCodeInput', { static: false })
  productBarCodeInput!: ElementRef;

  @ViewChild('selectedCustomerBtn', { static: false })
  myButtonRef!: ElementRef;
  @ViewChild('main') mainElement!: ElementRef;


  @Output() salesBillDetailListEvent = new EventEmitter<SalesBillDetail[]>();
  @Output() activeSalesBillEntryEvent = new EventEmitter<boolean>();

  @Output() customerIdEntryEvent = new EventEmitter<number>();
  salesBillDetail: SalesBillDetail = new SalesBillDetail();
  salesBillDetailInfos: SalesBillDetail[] = [];

  salesBillDetailsForCart: SalesBillDetail[] = [];

  productBarCodeId: undefined | number;
  productsUserWantTosale: Product[] = [];

  productQtyUserWantTOSale: number = 1;
  productQty: number = 1;
  customerCompany!: Company;
  customerId: number = 0;
  customerName: string = '';
  customerPan: number = 0;
  productQtyForEntryStatus = false;

  saleType: number = 1; // 1->cash sale, 2-> credit sale

  selectMenusForCompanies!: Company[];
  customerMetaData: CustomerMetaData = new CustomerMetaData();
  vatRateTypes: VatRateTypes[] = [];
  discountReadOnly: boolean = true;

  discountApproachSelect: number = 2;
  selectMenusForCompaniesSize!: number;

  taxApproach: number = 1;

  currentBranch!: string;
  date!: string;
  // isconfirmAlert: boolean = false;
  // alertboxshowable: boolean = true;
  companyId!: number;
  branchId!: number;
  counterId!: number;

  alreadyDraft: number = 0;
  taxApproachSelectEl: number = 2;
  customerSearchMethod: number = 1;
  custPhoneOrPan!: number;
  postgreDate!: string;
  toggleSelectCustomer: boolean = false;
  unknownCustomer: boolean = false;
  doesCustomerhavePan: boolean = true;
  export: boolean = false;
  selectMenusForProduct: Product[] = [];
  toggleSelectProduct: boolean = false;
  prodWildCard!: string;
  allowEditSellingPrice: boolean = false;
  allowEditDiscountPerUnit: boolean = false;
  hasAbbr: boolean = false;
  isAbbrFeature: boolean = false;
  beforeAfterTax: number = 1;
  // for bill Summary
  bsSubTotal: number = 0;
  bsNetAmount: number = 0;
  bsDiscountAmount: number = 0;
  bsExtraDiscount: number = 0;
  bsExtraDiscountLumpsump: number = 0;
  bsVatTaxableAmount: number = 0;
  bsTotal: number = 0;
  bsTotalAfterExtraDiscount = 0;
  featureObjs: UserFeature[] = [];
  searchByBarCode: boolean = false;
  discountType: number = 1; //1=> percent 2=>rupees
  receipt: boolean = false;
  productContainIndex = -1;
  createProductEnable = false;
  createCustomerEnable = false;
  AdDateForDisplayOnly!: string;
  selectCustomer: boolean = false;
  name!:string;
  currentUrl!: string;
  destroy$: Subject<void> = new Subject<void>(); // Used for unsubscribing from observables


  constructor(
    private salesCartService: SalesCartService,
    private productService: ProductService,
    private salesBillService: SalesBillServiceService,
    private router: Router,
    private loginService: LoginService,
    private companyService: CompanyServiceService,
    private vatRateTypeService: VatRateTypesService,
    private activatedRoute: ActivatedRoute,
    private tostrService: ToastrService,
    private renderer: Renderer2,
    private ngxModalService: NgxSmartModalService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {
    const currentDateObj = new Date();
    const datePipe = new DatePipe('en-US');
    this.date = datePipe.transform(currentDateObj, 'yyyy-MM-dd')!;
  }

  ngOnInit() {

    // this.router.events
    //   .pipe(
    //     filter((event) => event instanceof NavigationEnd),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe(() => {
    //     this.currentUrl = this.router.url;

    //     // Check if the current URL matches the desired pattern
    //     if (this.currentUrl.startsWith('/home/sales/invoice/create?id=')) {
    //       // Perform your logic here

    //       console.log('Performing logic for /home/sales/invoice/create');
    //       // this.unknownCustomer = true;
    //       // console.log(this.unknownCustomer);
    //       // this.cdr.detectChanges(); // Manually trigger change detection
    //       this.zone.run(() => {
    //         this.unknownCustomer = true;
    //       });
    //     }
    //     // Add more conditions as needed
    //   });


    this.custPanOrPhoneInput?.nativeElement.focus();
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.counterId = this.loginService.getCounterId();
    this.featureObjs = this.loginService.getFeatureObjs();
    this.featureObjs.forEach((fo) => {
      if (fo.featureId === 1) {
        this.allowEditSellingPrice = true;
      }
      if (fo.featureId === 2) {
        this.searchByBarCode = true;
      }
      if (fo.featureId === 5) {
        this.allowEditDiscountPerUnit = true;
      }
      if (fo.featureId === 6) {
        this.isAbbrFeature = true;
      }
      if (fo.featureId === 7) {
        this.receipt = true;
      }
    });
    this.currentBranch = 'Branch ' + this.branchId;
    let billId: number = this.activatedRoute.snapshot.queryParams['id'];
    if (billId > 0) {
      this.alreadyDraft = billId;
      this.fetchSalesBillDraftInvoice(billId);
    }
    this.getCompanyList();
    this.getVatRateTypes();




   }

  @HostListener('document:keydown.control.enter', ['$event'])
  onCtrlEnterPressed(event: KeyboardEvent) {
    event.preventDefault();
    this.saleTheProductBtn.nativeElement.click();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const dateEl = document.getElementById(
        'nepali-datepicker'
      ) as HTMLInputElement;
      dateEl.value = String(adToBs(new Date().toJSON().slice(0, 10)));

      const dateAdEl = document.getElementById('AdDate') as HTMLInputElement;
      dateAdEl.value = new Date().toJSON().slice(0, 10);
      this.AdDateForDisplayOnly = dateAdEl.value;
    }, 100);

    this.scrollToTop();







  }





  getUnknownCustomer() {
    this.unknownCustomer = !this.unknownCustomer;
    if (this.unknownCustomer === true) {
      //suraj
      this.customerId = 0;
      this.customerName = '';
      this.customerPan = 0;
      this.custPhoneOrPan = 0;
    }
  }

  displayAddCustomerPopup() {
    this.createCustomerEnable = true;
    this.ngxModalService.getModal('createNewCustomerPopup').open();
  }
  displayAddProductPopup() {
    this.createProductEnable = true;
  }
  customerAdded($event) {
    this.createCustomerEnable = false;
    if ($event === true) {
      this.tostrService.success('Customer Has been added ');
      this.fetchCustomerInfo();
    }
  }

  onButtonKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.myButtonRef.nativeElement.click();
      this.createCustomerBtn.nativeElement.click(); // if customer available this run but create no impact
    }
  }
  setAllVatToZero() {
    this.export = !this.export;
    // if (this.export) {
    // this.productsUserWantTosale.forEach((prod) => {
    // const vatSelEl = document.getElementById(`vatRateTypes${prod.id}`) as HTMLSelectElement;
    // vatSelEl.value = String(2); //2 for zero vat
    // })
    // }
  }

  createNewProduct($event: boolean) {
    if ($event == true) {
      this.tostrService.success('Ok');
    }
  }

  changeReceiptStatus() {
    this.receipt = !this.receipt;
  }

  updateAllowEditSP() {
    this.allowEditSellingPrice = !this.allowEditSellingPrice;

    const inputs = document.querySelectorAll('.productSellingPrice');
    inputs.forEach((input) => {
      if (this.allowEditSellingPrice) {
        input.removeAttribute('readonly');
      } else {
        input.setAttribute('readonly', 'true');
      }
    });
  }

  updateAllowEditDiscountPerUnit() {
    this.allowEditDiscountPerUnit = !this.allowEditDiscountPerUnit;
    const allowEditDiscountPerUnitInputEl = document.getElementById(
      'allowEditDiscountPerUnit'
    ) as HTMLInputElement;
    const discountELs = document.getElementsByClassName(
      'discountType'
    ) as HTMLCollection;

    if (this.allowEditDiscountPerUnit) {
      allowEditDiscountPerUnitInputEl.removeAttribute('disabled');
      for (var i = 0; i < discountELs.length; i++) {
        discountELs[i].removeAttribute('disabled');
      }
    }
    if (!this.allowEditDiscountPerUnit) {
      allowEditDiscountPerUnitInputEl.setAttribute('disabled', 'true');
      this.discountApproachSelect = 2;
      this.discountReadOnly = true;
    }
  }

  fetchSalesBillDraftInvoice(billId: number) {
    this.salesBillService.fetchSalesBillDetailForInvoice(billId).subscribe({
      next: (data: RJResponse<SalesBillInvoice>) => {
        // alert(data.data.salesBillDTO.draft);
        let salesBillInvoice: SalesBillInvoice = data.data;
        // this.date = data.data.salesBillDTO.billDate.toISOString().substring(0, 10);
        this.date = new Date(salesBillInvoice.salesBillDTO.billDate)
          .toISOString()
          .substring(0, 10);
        this.postgreDate = salesBillInvoice.salesBillDTO.billDate;
        this.customerId = salesBillInvoice.salesBillDTO.customerId;
        this.taxApproachSelectEl = salesBillInvoice.salesBillDTO.taxApproach;
        this.customerSearchMethod =
          salesBillInvoice.salesBillDTO.customerSearchMethod;

        this.getDiscountMethod(salesBillInvoice.salesBillDTO.taxApproach);

        this.customerId = salesBillInvoice.salesBillDTO.customerId;
        this.customerName = salesBillInvoice.salesBillDTO.customerName;
        const toEl = document.getElementById('to') as HTMLSpanElement;
        toEl.innerText = this.customerName;
        this.customerPan = salesBillInvoice.salesBillDTO.customerPan;
        if(this.customerPan===0){

          this.unknownCustomer=true;

        }

        let productsIds: number[] = [];
        salesBillInvoice.salesBillDetailsWithProd.forEach((prod) => {
          productsIds.push(prod.productId);
        });

        this.productService.getProductsByProductIds(productsIds).subscribe({
          next: (data) => {
            this.productsUserWantTosale = data.data;
            setTimeout(() => {
              this.manipulateDomItemsForDraft(
                salesBillInvoice.salesBillDetailsWithProd
              );
              this.updateBillSummary();
            });
          },
        });
      },
    });
  }

  manipulateDomItemsForDraft(
    salesBillDetailsWithProd: SalesBillDetailWithProdInfo[]
  ) {
    this.productsUserWantTosale.forEach((prod, index) => {
      const qtyEl = document.getElementById(
        `qtyProd${index}`
      ) as HTMLInputElement;
      const discountEl = document.getElementById(
        `discountPerc${index}`
      ) as HTMLInputElement;
      const totalAmountEl = document.getElementById(
        `totalAmount${index}`
      ) as HTMLElement;
      const vatSelEl = document.getElementById(
        `vatRateTypes${index}`
      ) as HTMLSelectElement;

      let salesProd: SalesBillDetailWithProdInfo =
        salesBillDetailsWithProd.find((sp, i) => i === index)!;
      // this.selectedValueForTaxRateTypes = salesProd.taxRate;

      vatSelEl.value = String(salesProd.taxRate);
      qtyEl.value = String(salesProd.qty);
      discountEl.value = String(salesProd.discountPerUnit);
      totalAmountEl.innerText = String(salesProd.rowTotal);
      setTimeout(() => {
        this.updateTotalAmount(index);
      });
    });
  }

  fetchCustomerInfo() {
    if (this.custPhoneOrPan === null || this.custPhoneOrPan === undefined) {
      this.tostrService.error(`pan or phone`, 'invalid number');
      return;
    }

    setTimeout(() => {
      // this.toggleSelectCustomer = true;
      this.selectCustomer = true;
      this.ngxModalService.getModal('selectCustomerPopup').open();
    }, 400);

    setTimeout(() => {
      this.companyService
        .getCustomerInfoByPanOrPhone(
          this.customerSearchMethod,
          this.custPhoneOrPan
        )
        .subscribe({
          next: (data) => {
            this.selectMenusForCompanies = data.data;
            this.selectMenusForCompaniesSize = data.data.length;
            let customerMetaData = new CustomerMetaData();
            customerMetaData.customers = data.data;
            customerMetaData.customerPanOrPhone = this.custPhoneOrPan;
            this.customerMetaData = customerMetaData;
          },
          complete: () => {},
        });
    }, 600);
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return (
      item.label.toLowerCase().indexOf(term) > -1 ||
      item.value.toLowerCase().indexOf(term) > -1
    );
  }

  getVatRateTypes() {
    this.vatRateTypeService.getAllVatRateTypes().subscribe({
      next: (res) => {
        this.vatRateTypes = res.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  fetchCustomerInfoOnlyForNameDisplay($event: number) {
    this.companyService
      .getCustomerInfoByPanOrPhone(
        this.customerSearchMethod,
        this.custPhoneOrPan
      )
      .subscribe({
        next: (data) => {
          this.selectMenusForCompanies = data.data;
          this.selectMenusForCompaniesSize = data.data.length;
          this.setCustomerInfo($event);
        },
      });
  }

  setCustomerInfo(compId: number) {
    // let comp: Company = this.selectMenusForCompanies.find(
    //   (comp) => Number(comp.companyId) === Number(compId)
    // )!;
    let comp!: Company;
    this.companyService.getSingleCompany(compId).subscribe((res) => {
      comp = res.data;

      this.customerId = comp.companyId;
      this.customerName = comp.name;
      this.customerPan = Number(comp.panNo);
      if (this.customerPan > 0) {
        this.doesCustomerhavePan = true;
      } else {
        this.doesCustomerhavePan = false;
      }
      // const closeCustomerPopUpEl = document.getElementById(
      // 'closeCustPop'
      // ) as HTMLAnchorElement;
      // closeCustomerPopUpEl.click();
      this.destroySelectCustomerComponent(true);
    });
  }

  closeSelectCustomerPopUp() {
    const closeCustomerPopUpEl = document.getElementById(
      'closeCustPop'
    ) as HTMLAnchorElement;
    closeCustomerPopUpEl.click();
  }

  destroySelectCustomerComponent($event: boolean) {
    setTimeout(() => {
      // this.toggleSelectCustomer = false;
      this.selectCustomer = false;
      this.ngxModalService.getModal('selectCustomerPopup').close();
    });
  }

  destroySelectProductComponent($event: boolean) {
    this.toggleSelectProduct = false;
  }

  getNameWildCard() {
    setTimeout(() => {
      this.toggleSelectProduct = true;
    }, 400);
    // const selectProductBtn = document.getElementById(
    //   'selectProduct'
    // ) as HTMLButtonElement;
    // selectProductBtn.click();
    this.productService
      .getProductByWildCardName(
        this.prodWildCard,
        this.companyId,
        this.branchId
      )
      .subscribe({
        next: (data) => {
          this.selectMenusForProduct = data.data;
        },
      });
  }

  setProductSelectedByName(prod: Product) {
    let doesContain = false;
    this.prodWildCard = prod.name;
    this.productsUserWantTosale.forEach((p, indx) => {
      if (p.id === prod.id) {
        doesContain = true;
        this.prodQtyInput.nativeElement.focus();
        this.productContainIndex = indx;
      }
    });
    if (doesContain === false) {
      this.productsUserWantTosale.push(prod);
    }
    // this.productsUserWantTosale.push(prod);
    this.productBarCodeId = prod.id;
    this.productName.nativeElement.value = prod.name;
    this.toggleSelectProduct = false;
    this.letsUpdatePriceForTaxIncExc();
    this.prodQtyInput.nativeElement.focus();
    setTimeout(() => {
      this.prodQtyInput.nativeElement.select();
    }, 1000);
  }

  getApproach($event: any) {
    console.log($event.target.value);
    this.taxApproach = Number($event.target.value);
    console.log(this.taxApproach);
    this.productsUserWantTosale.forEach((prod, index) => {
      // here we need to perform calcuation for updating selling price
      const qtyEl = document.getElementById(`qtyProd${index}`);
      // for setting up selling price:
      let eachVatRateNum: number = 0;
      this.vatRateTypes.forEach((vrt) => {
        if (vrt.id === prod.tax) {
          eachVatRateNum = vrt.vatRateNum;
        }
      });
      const sellingPriceEl = document.getElementById(
        `prodSellingPrice${index}`
      ) as HTMLInputElement;
      if (this.taxApproach === 1) {
        if (prod.taxApproach === 1) {
          sellingPriceEl.value = String(Math.floor(prod.sellingPrice))
            .concat('.')
            .concat((prod.sellingPrice % 1).toFixed(2).substring(2));
        } else if (prod.taxApproach === 2 || 0) {
          let actSp =
            prod.sellingPrice + (eachVatRateNum / 100) * prod.sellingPrice;
          sellingPriceEl.value = String(Math.floor(actSp))
            .concat('.')
            .concat((actSp % 1).toFixed(2).substring(2));
        }
      } else if (this.taxApproach === 2) {
        if (prod.taxApproach === 1 || 0) {
          let actSp =
            prod.sellingPrice -
            (eachVatRateNum / (100 + eachVatRateNum)) * prod.sellingPrice;
          sellingPriceEl.value = String(Math.floor(actSp))
            .concat('.')
            .concat((actSp % 1).toFixed(2).substring(2));
        } else if (prod.taxApproach === 2) {
          sellingPriceEl.value = String(Math.floor(prod.sellingPrice))
            .concat('.')
            .concat((prod.sellingPrice % 1).toFixed(2).substring(2));
          // Math.floor(prod.sellingPrice) +
          // '.' +
          // prod.sellingPrice.toFixed(2).substring(2);
        }
      }
      // code for updating selling price finish.

      this.updateTotalAmount(index);
    });
    // this.updateBillSummary();
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

  getDiscountMethod(id: number) {
    if (id === 1) {
      this.discountApproachSelect = 1;
      this.discountReadOnly = false;
    } else if (id == 2) {
      this.discountApproachSelect = 2;
      this.discountReadOnly = true;
      this.productsUserWantTosale.forEach((prod, index) => {
        const discountInputElement = document.getElementById(
          `discountPerc${index}`
        ) as HTMLInputElement;
        discountInputElement.value = String(prod.discount);
        this.productsUserWantTosale.forEach((prod, index) => {
          this.updateTotalAmount(index);
        });
        this.updateBillSummary();

        // this.updateTotalAmount(prod);
      });
    }
  }

  getDiscountType(id: number) {
    this.discountType = id;
  }

  setSaleType(id: number) {
    this.saleType = id;
    if (this.saleType === 2) {
      this.receipt = false;
    }
  }

  goToProductQtyField() {
    if (this.productBarCodeId!.toString().length > 0) {
      this.prodQtyInput.nativeElement.focus();
    }
  }

  productAdded($event: Product) {
    this.tostrService.success('Product Has been added ');
    setTimeout(() => {
      this.createProductEnable = false;
      this.toggleSelectProduct = false;
      this.ngxModalService.getModal('selectProduct').close();
    }, 500);
    this.prodWildCard = $event.name;
    this.productsUserWantTosale.push($event);
    setTimeout(() => {
      this.prodQtyInput.nativeElement.focus();
      this.prodQtyInput.nativeElement.select();
    }, 1000);
  }

  disableCreateProduct($event: boolean) {
    this.createProductEnable = false;
    this.toggleSelectCustomer = false;
  }
  addTheProductForSale() {
    if (this.productBarCodeId === undefined) {
      this.productBarCodeInput.nativeElement.focus();
      return;
    }
    /** code for checking whether the product already exists in cart. Now not needed */
    // for (let i = 0; i < this.productsUserWantTosale.length; i++) {
    // let eachProd: Product = this.productsUserWantTosale[i];
    // if (eachProd.id === Number(this.productBarCodeId)) {
    // // eachProd.id is number type and this.productBarCodeId is Number | undefined type. so we need to typecast explicitly
    // this.tostrService.error("product already added ");
    // return; //return doesnot work in foreach method

    // }
    // }
    this.productService
      .getProductById(this.productBarCodeId, this.searchByBarCode)
      .subscribe({
        next: (data) => {
          if (data.data === null) {
            this.tostrService.error('product not available');
            setTimeout(() => {
              this.productBarCodeInput.nativeElement.value = '';
              this.productName.nativeElement.focus();
              this.productName.nativeElement.select();
            });
          }

          // this.productBarCodeInput.nativeElement.focus();
          if (data.data !== null) {
            let doesContain = false;
            this.prodWildCard = data.data.name;
            this.productsUserWantTosale.forEach((p, indx) => {
              if (p.id === data.data.id) {
                doesContain = true;
                this.prodQtyInput.nativeElement.focus();
                this.productContainIndex = indx;
              }
            });
            if (doesContain === false) {
              this.productsUserWantTosale.push(data.data);
            }

            this.letsUpdatePriceForTaxIncExc();
            this.prodQtyInput.nativeElement.focus();
            setTimeout(() => {
              this.prodQtyInput.nativeElement.select();
            });
          }
        },
      });
  }

  letsUpdatePriceForTaxIncExc() {
    this.productBarCodeId = undefined;
    setTimeout(() => {
      this.productsUserWantTosale.forEach((prod, index) => {
        // for setting up selling price:
        let eachVatRateNum: number = 0;
        this.vatRateTypes.forEach((vrt) => {
          if (vrt.id === prod.tax) {
            eachVatRateNum = vrt.vatRateNum;
          }
        });
        const sellingPriceEl = document.getElementById(
          `prodSellingPrice${index}`
        ) as HTMLInputElement;

        if (this.taxApproach === 1) {
          if (prod.taxApproach === 1) {
            sellingPriceEl.value =
              Math.floor(prod.sellingPrice) +
              '.' +
              (prod.sellingPrice % 1).toFixed(2).substring(2);
          } else if (prod.taxApproach === 2) {
            let actSp =
              prod.sellingPrice + (eachVatRateNum / 100) * prod.sellingPrice;
            sellingPriceEl.value = sellingPriceEl.value =
              Math.floor(actSp) + '.' + (actSp % 1).toFixed(2).substring(2);
          }
        } else if (this.taxApproach === 2) {
          if (prod.taxApproach === 1) {
            let actSp =
              prod.sellingPrice -
              (eachVatRateNum / (100 + eachVatRateNum)) * prod.sellingPrice;
            sellingPriceEl.value =
              Math.floor(actSp) + '.' + (actSp % 1).toFixed(2).substring(2);
          } else if (prod.taxApproach === 2) {
            sellingPriceEl.value =
              Math.floor(prod.sellingPrice) +
              '.' +
              (prod.sellingPrice % 1).toFixed(2).substring(2);
          }
        }
        //ended for setting up selling price
        this.productQtyForEntryStatus = true;
        // this.updateTotalAmount(data.data);
        this.updateTotalAmount(index);
        this.productQtyForEntryStatus = false;
        this.productQty = 1;
      });
      this.updateBillSummary();
      // for focusing
      // this.prodQtyInput.nativeElement.focus();
      // for focusing ends
    });
  }

  // advance logic for total amount updation
  // updateTotalAmount(index: number) {
  //   // atulcodebegin
  //   let prod: Product = this.productsUserWantTosale.find((prod, indx) => {
  //     return index === indx;
  //   })!;
  //   // // for fetching selling price
  //   // let prodSellingPriceEL = document.getElementById(
  //   //   `prodSellingPrice${index}`
  //   // ) as HTMLInputElement;
  //   // let sellingPrice = Number(prodSellingPriceEL.value);

  //   // for tracking quantity
  //   const qtyProdElement = document.getElementById(
  //     `qtyProd${index}`
  //   ) as HTMLInputElement;

  //   // if (this.productQtyForEntryStatus === true) {
  //   //   alert(this.productQty)
  //   //   qtyProdElement.value = String(this.productQty); //
  //   // }
  //   let prodQty: number = Number(qtyProdElement.value);

  //   // for tracking discount
  //   const discountPercElement = document.getElementById(
  //     `discountPerc${index}`
  //   ) as HTMLInputElement;
  //   let discountPerc: number = Number(discountPercElement.value);
  //   const varRateTypeEl = document.getElementById(
  //     `vatRateTypes${index}`
  //   ) as HTMLSelectElement;
  //   let eachVatRateId: Number = Number(varRateTypeEl.value);
  //   let eachVatRateNum: number = 0;
  //   this.vatRateTypes.forEach((vrt) => {
  //     if (vrt.id === eachVatRateId) {
  //       eachVatRateNum = vrt.vatRateNum;
  //     }
  //   });

  //   let totalAmountElement = document.getElementById(
  //     `totalAmount${index}`
  //   ) as HTMLElement;
  //   const sellingPriceEl = document.getElementById(
  //     `prodSellingPrice${index}`
  //   ) as HTMLInputElement;
  //   if (this.taxApproach === 1) {
  //     if (prod.taxApproach === 1) {
  //       // sellingPriceEl.value = String(prod.sellingPrice);
  //       const sellingPriceEl2 = document.getElementById(
  //         `prodSellingPrice${index}`
  //       ) as HTMLInputElement;
  //       totalAmountElement.innerText = String( //
  //         (Number(sellingPriceEl2.value) * prodQty -
  //           (eachVatRateNum / 100) * Number(sellingPriceEl2.value) * prodQty -
  //           (discountPerc / 100) * Number(sellingPriceEl2.value) * prodQty +
  //           (eachVatRateNum / 100) * Number(sellingPriceEl2.value) * prodQty
  //         ))
  //     } else if (prod.taxApproach === 2) {
  //       sellingPriceEl.value = String(
  //         prod.sellingPrice + (eachVatRateNum / 100) * prod.sellingPrice
  //       );
  //       const sellingPriceEl2 = document.getElementById(
  //         `prodSellingPrice${index}`
  //       ) as HTMLInputElement;
  //       totalAmountElement.innerText = String(
  //         Number(sellingPriceEl2.value) * prodQty -
  //         (eachVatRateNum / 100) * Number(sellingPriceEl2.value) * prodQty -
  //         (discountPerc / 100) * Number(sellingPriceEl2.value) * prodQty +
  //         (eachVatRateNum / 100) * Number(sellingPriceEl2.value) * prodQty
  //       );
  //     } else if (prod.taxApproach === 0) {
  //       sellingPriceEl.value = String(
  //         prod.sellingPrice + (eachVatRateNum / 100) * prod.sellingPrice
  //       );
  //       const sellingPriceEl2 = document.getElementById(
  //         `prodSellingPrice${index}`
  //       ) as HTMLInputElement;
  //       totalAmountElement.innerText = String(
  //         Number(sellingPriceEl2.value) * prodQty -
  //         (eachVatRateNum / 100) * Number(sellingPriceEl2.value) * prodQty -
  //         (discountPerc / 100) * Number(sellingPriceEl2.value) * prodQty +
  //         (eachVatRateNum / 100) * Number(sellingPriceEl2.value) * prodQty
  //       );
  //     }
  //   } else if (this.taxApproach === 2) {
  //     if (prod.taxApproach === 1) {//
  //       let actSp =
  //         prod.sellingPrice -
  //         (eachVatRateNum / (100 + eachVatRateNum)) * prod.sellingPrice;
  //       sellingPriceEl.value = String(actSp);
  //       const sellingPriceEl2 = document.getElementById(
  //         `prodSellingPrice${index}`
  //       ) as HTMLInputElement;
  //       totalAmountElement.innerText = String(
  //         Number(sellingPriceEl2.value) * prodQty -
  //         (discountPerc / 100) * Number(sellingPriceEl2.value) * prodQty
  //       );
  //     } else if (prod.taxApproach === 2) {
  //       // sellingPriceEl.value = String(prod.sellingPrice);
  //       const sellingPriceEl2 = document.getElementById(
  //         `prodSellingPrice${index}`
  //       ) as HTMLInputElement;
  //       totalAmountElement.innerText = String(
  //         Number(sellingPriceEl2.value) * prodQty -
  //         (discountPerc / 100) * Number(sellingPriceEl2.value) * prodQty
  //       );
  //     } else if (prod.taxApproach === 0) {
  //       // sellingPriceEl.value = String(prod.sellingPrice);
  //       const sellingPriceEl2 = document.getElementById(
  //         `prodSellingPrice${index}`
  //       ) as HTMLInputElement;
  //       totalAmountElement.innerText = String(
  //         Number(sellingPriceEl2.value) * prodQty -
  //         (discountPerc / 100) * Number(sellingPriceEl2.value) * prodQty
  //       );
  //     }
  //   }
  //   // atul code end
  // }

  updateTotalAmount(index: number) {
    let prod = this.productsUserWantTosale.find((prod, indx) => {
      return indx === index;
    });

    const qtyOfProdEl = document.getElementById(
      `qtyProd${index}`
    ) as HTMLInputElement;
    const spOfProdEl = document.getElementById(
      `prodSellingPrice${index}`
    ) as HTMLInputElement;
    const discPercOrNumEl = document.getElementById(
      `discountPerc${index}`
    ) as HTMLInputElement;
    const varRateTypeEl = document.getElementById(
      `vatRateTypes${index}`
    ) as HTMLSelectElement;
    const totalAmountEl = document.getElementById(
      `totalAmount${index}`
    ) as HTMLElement;

    let qtyOfProd: number = Number(qtyOfProdEl.value);
    let spOfProd: number = Number(spOfProdEl.value);
    let discPercOrNum: number = Number(discPercOrNumEl.value);
    let eachVatRateId: Number = Number(varRateTypeEl.value);
    let eachVatRateNum: number = 0;
    this.vatRateTypes.forEach((vrt) => {
      if (vrt.id === eachVatRateId) {
        eachVatRateNum = vrt.vatRateNum;
      }
    });

    let amountBeforeTax = 0;
    let discount = 0;
    let amountAfterDisc = 0;
    let amountAfterDiscAndTax = 0;
    if (this.taxApproach === 1) {
      amountBeforeTax =
        spOfProd - (eachVatRateNum / (100 + eachVatRateNum)) * spOfProd;
      if (this.discountType === 1) {
        discount = (discPercOrNum / 100) * amountBeforeTax;
      } else if (this.discountType === 2) {
        discount = discPercOrNum;
      }
      amountAfterDisc = amountBeforeTax - discount;
      amountAfterDiscAndTax =
        amountAfterDisc + (eachVatRateNum / 100) * amountAfterDisc;
    } else if (this.taxApproach === 2) {
      amountBeforeTax = spOfProd;
      if (this.discountType === 1) {
        discount = (discPercOrNum / 100) * amountBeforeTax;
      } else if (this.discountType === 2) {
        discount = discPercOrNum;
      }
      amountAfterDisc = amountBeforeTax - discount;
      amountAfterDiscAndTax = amountAfterDisc;
    }
    let totalEachRow = amountAfterDiscAndTax * qtyOfProd;

    totalAmountEl.innerText =
      Math.floor(totalEachRow) +
      '.' +
      (totalEachRow % 1).toFixed(2).substring(2);
  }

  changeProductQuantity() {
    if (this.productContainIndex > -1) {
      const addedProductQtyEl = document.getElementById(
        `qtyProd${this.productContainIndex}`
      ) as HTMLInputElement;
      let val1: number = Number(addedProductQtyEl.value);
      let val2: number = Number(this.productQty);
      let result: number = val1 + val2;
      // alert(result)
      addedProductQtyEl.value = String(result);
    } else {
      const addedProductQtyEl = document.getElementById(
        `qtyProd${this.productsUserWantTosale.length - 1}`
      ) as HTMLInputElement;
      addedProductQtyEl.value = String(this.productQty);
    }

    this.goToProductId();
    this.updateTotalAmount(this.productsUserWantTosale.length - 1); // lenght -1 give array cureent last element index
    this.productName.nativeElement.value = '';

    this.productContainIndex = -1; //fore reseting for other products true quantity entering
  }

  setBeforeAfterTax(id: number) {
    if (id === 1) {
      this.beforeAfterTax = 1;
    } else if (id === 2) {
      this.beforeAfterTax = 2;
    }
  }

  updateBillSummary() {
    this.bsTotal = 0;
    this.bsSubTotal = 0;
    this.bsVatTaxableAmount = 0;
    this.bsNetAmount = 0;
    this.bsDiscountAmount = 0;

    this.productsUserWantTosale.forEach((prod, index) => {
      const pTotalElement = document.getElementById(
        `totalAmount${index}`
      ) as HTMLElement;
      let pTotal: number = Number(pTotalElement.innerText);

      let prodSellingPriceEL = document.getElementById(
        `prodSellingPrice${index}`
      ) as HTMLInputElement;
      let sellingPrice = Number(prodSellingPriceEL.value);

      const varRateTypeEl = document.getElementById(
        `vatRateTypes${index}`
      ) as HTMLSelectElement;
      let eachVatRateId: Number = Number(varRateTypeEl.value);

      // for fetching vat rate number value from id
      let eachVatRateNum: number = 0;
      this.vatRateTypes.forEach((vrt) => {
        if (vrt.id === eachVatRateId) {
          eachVatRateNum = vrt.vatRateNum;
        }
      });

      const qtyProdElement = document.getElementById(
        `qtyProd${index}`
      ) as HTMLInputElement;
      // if (this.productQtyForEntryStatus === true) {
      // qtyProdElement.value = String(this.productQty);//
      // }
      let prodQty: number = Number(qtyProdElement.value);

      const discountPercOrRupeeElement = document.getElementById(
        `discountPerc${index}`
      ) as HTMLInputElement;
      let discountPercOrRupee: number = Number(
        discountPercOrRupeeElement.value
      );

      sellingPrice = sellingPrice * prodQty;
      let beforeTax = 0;
      let discount = 0;
      let taxableAmount = 0;
      let cantBeTaxableAmount = 0;
      let taxAmount = 0;
      let finalAmount = 0;

      if (this.taxApproach === 2) {
        beforeTax = sellingPrice;
      }

      if (this.taxApproach === 1) {
        beforeTax =
          sellingPrice -
          (eachVatRateNum / (100 + eachVatRateNum)) * sellingPrice;
      }
      //  because only before tax is different other are same.
      if (this.discountType === 1) {
        discount = (discountPercOrRupee / 100) * beforeTax; //before tax ma nai laguanae ho
      } else if (this.discountType === 2) {
        discount = discountPercOrRupee;
      }

      if (eachVatRateNum !== 0) {
        taxableAmount = beforeTax - discount;
      } else {
        cantBeTaxableAmount = beforeTax - discount;
      }

      taxAmount = (eachVatRateNum / 100) * taxableAmount;
      finalAmount = taxableAmount + taxAmount + cantBeTaxableAmount;

      // this.bsSubTotal += pTotal;
      this.bsDiscountAmount += discount;
      this.bsVatTaxableAmount += taxableAmount;
      this.bsNetAmount += taxableAmount + cantBeTaxableAmount; //sure xaina
      this.bsSubTotal += taxableAmount + cantBeTaxableAmount;
      this.bsTotal += taxableAmount + taxAmount + cantBeTaxableAmount;
      if (this.taxApproach === 1) {
        this.bsSubTotal = this.bsTotal;
      }

      // for after tax
    });
    this.discountAgain();
  }

  updateBillSummaryAfterTax() {}

  discountAgain() {
    let discount = 0;
    if (this.beforeAfterTax === 1) {
      if (this.discountType === 1) {
        //
        discount = (this.bsExtraDiscount / 100) * this.bsSubTotal;
      } else {
        discount = this.bsExtraDiscount;
      }
    } else if (this.beforeAfterTax === 2) {
      if (this.discountType === 1) {
        discount = (this.bsExtraDiscount / 100) * this.bsTotal;
      } else {
        discount = this.bsExtraDiscount;
      }
    }
    this.bsExtraDiscountLumpsump = discount;
    this.bsTotalAfterExtraDiscount = this.bsTotal - discount;
    // let finalTotal: number =
  }

  goToProductId() {
    this.productBarCodeInput.nativeElement.focus();
    this.productBarCodeInput.nativeElement.select();
  }

  removeItemFromCart(i: number) {
    this.productsUserWantTosale = this.productsUserWantTosale.filter(
      (prod, index) => index !== i
    );
  }

  saleTheProducts(draft: boolean) {
    if (this.unknownCustomer === false) {
      if (this.customerId === 0 || this.customerId === undefined) {
        this.tostrService.warning('please select the customer');
        return;
      }
    }

    if (this.date === undefined) {
      this.tostrService.warning('please select date ');
      return;
    }
    if (this.productsUserWantTosale.length <= 0) {
      this.tostrService.warning('please enter at least one product');
      return;
    }

    // for abbrevationBill
    if (this.isAbbrFeature) {
      if (this.unknownCustomer || !this.doesCustomerhavePan) {
        if (this.bsTotal < 10000) {
          this.hasAbbr = true;
        } else {
          this.hasAbbr = false;
        }
      }
    }

    //
    this.productsUserWantTosale.forEach((prod, index) => {
      let saleBillDetail: SalesBillDetail = new SalesBillDetail();
      saleBillDetail.productId = prod.id;
      let qtyElement = document.getElementById(
        'qtyProd' + index
      ) as HTMLInputElement;
      saleBillDetail.qty = Number(qtyElement.value);

      const discountPercElement = document.getElementById(
        `discountPerc${index}`
      ) as HTMLInputElement;
      let discountPerc: number = Number(discountPercElement.value);

      saleBillDetail.discountPerUnit = discountPerc;

      const totalAmountEl = document.getElementById(
        `totalAmount${index}`
      ) as HTMLElement;
      saleBillDetail.rowTotal = Number(totalAmountEl.innerText);
      saleBillDetail.companyId = this.loginService.getCompnayId(); //backend mai set gar

      // for accessing tax rate type
      const vatRateTypesElement = document.getElementById(
        `vatRateTypes${index}`
      ) as HTMLInputElement;
      saleBillDetail.taxRate = Number(vatRateTypesElement.value);

      saleBillDetail.branchId = this.branchId; //backendma set gar
      saleBillDetail.date = this.date; //backend ma set gar

      // setting sellingprice dynamically form dom because user can edit it. so we have to make it dynamic.
      // const sellingPriceEl = document.getElementById(
      //   `prodSellingPrice${index}`
      // ) as HTMLInputElement;
      // saleBillDetail.rate = Number(sellingPriceEl.value);
      let eachVatRateNum: number = 0;
      this.vatRateTypes.forEach((vrt) => {
        if (vrt.id === prod.tax) {
          eachVatRateNum = vrt.vatRateNum;
        }
      });

      if (this.hasAbbr === false) {
        if (prod.taxApproach === 1) {
          saleBillDetail.rate =
            prod.sellingPrice -
            (eachVatRateNum / (100 + eachVatRateNum)) * prod.sellingPrice;
        } else {
          saleBillDetail.rate = prod.sellingPrice;
        }
      }

      // forHasAbbr True
      if (this.hasAbbr === true) {
        if (prod.taxApproach === 2) {
          saleBillDetail.rate =
            prod.sellingPrice +
            (eachVatRateNum / (100 + eachVatRateNum)) * prod.sellingPrice;
        } else {
          saleBillDetail.rate = prod.sellingPrice;
        }
      }

      this.salesBillDetailInfos.push(saleBillDetail);
    });
    this.continueSelling(draft);
  }

  continueSelling(draft: boolean) {
    let salesBillDetailInfos = this.salesBillDetailInfos;

    let salesBill: SalesBill = new SalesBill();
    let salesBillMaster: SalesBillMaster = new SalesBillMaster();

    // this.calculateSubMetrics(salesBill);
    salesBill.amount = this.bsSubTotal;
    salesBill.taxableAmount = this.bsVatTaxableAmount;
    salesBill.taxAmount = (13 / 100) * this.bsVatTaxableAmount;
    salesBill.totalAmount = this.bsTotal;
    salesBill.discount = this.bsDiscountAmount + this.bsExtraDiscountLumpsump;
    // finished
    // for setting hasAbbr
    salesBill.hasAbbr = this.hasAbbr;
    salesBill.customerId = this.customerId;
    salesBill.customerName = this.customerName;
    salesBill.customerPan = this.customerPan;
    salesBill.syncWithIrd = true;
    salesBill.billPrinted = false;
    salesBill.enteredBy = this.loginService.currentUser.user.email;

    if (this.saleType === 1) {
      salesBill.receipt = this.receipt;
    } else {
      salesBill.receipt = false;
    }
    salesBill.receipt = this.receipt;
    // setting date
    var mainInput = document.getElementById(
      'nepali-datepicker'
    ) as HTMLInputElement;
    var nepaliDate = mainInput.value;

    var Input = document.getElementById('AdDate') as HTMLInputElement;
    var englishDate = Input.value;

    salesBill.billDate = englishDate;
    salesBill.billDateNepali = nepaliDate;
    salesBill.userId = this.loginService.currentUser.user.id;
    salesBill.companyId = this.loginService.getCompnayId();
    salesBill.branchId = this.branchId; //mjremain
    salesBill.counterId = this.counterId;
    salesBill.realTime = true;
    salesBill.billActive = true;
    salesBill.draft = draft;
    salesBill.taxApproach = this.taxApproach;
    salesBill.discountApproach = this.discountApproachSelect;
    salesBill.customerSearchMethod = this.customerSearchMethod;
    salesBill.saleType = this.saleType;

    salesBill.paymentMethod = 'Cheque';
    // salesBill.draft = true mjremain
    salesBillMaster.salesBillDTO = salesBill;
    salesBillMaster.salesBillDetails = salesBillDetailInfos;
    salesBillMaster.alreadyDraft = this.alreadyDraft;
    this.salesBillService.createNewSalesBill(salesBillMaster).subscribe({
      next: (data) => {
        console.log(data);
        if (draft === false) {
          // this.router.navigateByUrl(`dashboard/salesbill`);

          window.open(
            `/salesBillPrint/${data.data}`,
            '_blank',
            'height=900, width=900, left=250, top=100'
          );
          this.router.navigateByUrl('home/sales/invoice');
          // this.router.navigateByUrl(`/home/sales/invoice`);
       }else {
          alert('Draft has been saved ');
           this.router.navigateByUrl('/home/sales/invoice');
        }
      },
    });
  }

  calculateSubMetrics(salesBill: SalesBill) {
    let discount: number = 0;
    let taxableAmount: number = 0;
    let taxAmount: number = 0;
    let totalAmount: number = 0;
    let amount: number = 0;
    this.productsUserWantTosale.forEach((prod) => {
      let taxElement = document.getElementById(
        `vatRateTypes${prod.id}`
      ) as HTMLSelectElement;
      let taxId: number = Number(taxElement.value);

      const discountEl = document.getElementById(
        `discountPerc${prod.id}`
      ) as HTMLInputElement;
      let discountPerc = Number(discountEl.value);

      const qtyEl = document.getElementById(
        `qtyProd${prod.id}`
      ) as HTMLInputElement;
      let qty = Number(qtyEl.value);

      let prodSellingPriceEL = document.getElementById(
        `prodSellingPrice${prod.id}`
      ) as HTMLInputElement;
      let finalSellingPrice = Number(prodSellingPriceEL.value);

      if (this.taxApproach === 1) {
        let sp = prod.sellingPrice;
        if (taxId === 3) {
          sp = finalSellingPrice - (13 / 113) * finalSellingPrice;
          let discPerProd = (discountPerc / 100) * (sp * qty);
          let netAmountPerProd = sp * qty - discPerProd;
          let taxableAmountPerProd = sp * qty - discPerProd;
          let taxAmountPerProd = 0.13 * taxableAmountPerProd;
          let totalAmountPerProd = taxableAmountPerProd + taxAmountPerProd;
          discount += discPerProd;
          taxableAmount += taxableAmountPerProd;
          taxAmount += taxAmountPerProd;
          totalAmount += totalAmountPerProd;
          amount += netAmountPerProd;
        } else {
          sp = finalSellingPrice;
          let discPerProd = (discountPerc / 100) * (sp * qty);
          let totalAmountPerProd = sp - discPerProd;
          let netAmountPerProd = totalAmountPerProd;

          amount += netAmountPerProd;
          discount += discPerProd;
          totalAmount += totalAmountPerProd;
        }
      } else if (this.taxApproach === 2) {
        let sp = finalSellingPrice;
        let discountPerProd = (discountPerc / 100) * sp * qty;
        if (taxId === 3) {
          let taxableAmountPerProd = sp * qty - discountPerProd;
          let netAmountPerProd = sp * qty - discountPerProd;

          let taxAmountPerProd = 0.13 * taxableAmountPerProd;
          let totalAmountPerProd = taxableAmountPerProd + taxAmountPerProd;

          amount += netAmountPerProd;
          discount += discountPerProd;
          taxableAmount += taxableAmountPerProd;
          taxAmount += taxAmountPerProd;
          totalAmount += totalAmountPerProd;
        } else {
          discount += discountPerProd;
          let totalAmountPerProd = sp * qty - discountPerProd;
          totalAmount += totalAmountPerProd;
          let netAmountPerProd = totalAmountPerProd;

          amount += netAmountPerProd;
        }
      }

      // for calculatirng overall discount
    });
    salesBill.amount = amount;
    salesBill.taxableAmount = taxableAmount;
    salesBill.taxAmount = taxAmount;
    salesBill.totalAmount = totalAmount;
    salesBill.discount = discount;
  }

  customerAddedSuccessfully($event: number) {
    this.tostrService.success('Customer successfully added with id ' + $event);
  }

  scrollToTop() {
    if (this.mainElement) {
      this.mainElement.nativeElement.scrollTop = 0;
      //console.log("it work");
    }

  }


  destroyCreateCustomerComp($event: boolean) {
    this.createCustomerEnable = false;
    this.ngxModalService.getModal('createNewCustomerPopup').close();
  }


}

