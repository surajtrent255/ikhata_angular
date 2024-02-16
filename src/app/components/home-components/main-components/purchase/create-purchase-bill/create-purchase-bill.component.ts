import { DatePipe } from '@angular/common';
import { identifierName } from '@angular/compiler';
import {
  Component,
  ElementRef,
  EventEmitter,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { CustomerMetaData } from 'src/app/models/CustomerMetaData';
import { Product } from 'src/app/models/Product';
import { PurchaseAdditionalInfo } from 'src/app/models/PurchaseAdditionalInfo';
import { PurchaseBill } from 'src/app/models/PurchaseBill';
import { PurchaseBillDetail } from 'src/app/models/PurchaseBillDetail';
import { PurchaseBillMaster } from 'src/app/models/PurchaseBillMaster';
import { SalesBillDetail } from 'src/app/models/SalesBillDetail';
import { UserFeature } from 'src/app/models/UserFeatures';
import { VatRateTypes } from 'src/app/models/VatRateTypes';
import { Company } from 'src/app/models/company';
import { ProductService } from 'src/app/service/product.service';
import { PruchaseAdditionalInfoService } from 'src/app/service/pruchase-additional-info.service';
import { PurchaseBillService } from 'src/app/service/purchase-bill.service';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { SalesCartService } from 'src/app/service/shared/sales-cart-service.service';

@Component({
  selector: 'app-create-purchase-bill',
  templateUrl: './create-purchase-bill.component.html',
  styleUrls: ['./create-purchase-bill.component.css'],
})
export class CreatePurchaseBillComponent {
  @ViewChild('createtransportationForm') createtransportationForm!: NgForm;
  @ViewChild('loading', { static: false }) loadingInput!: ElementRef;
  @ViewChild('transportationTax', { static: false })
  transportationTaxInput!: ElementRef;
  @ViewChild('insuranceTax', { static: false }) insuranceTaxInput!: ElementRef;
  @ViewChild('loadingTax', { static: false }) loadingTaxInput!: ElementRef;
  @ViewChild('otherTax', { static: false }) otherTaxInput!: ElementRef;
  @ViewChild('submit_btn', { static: false }) buttonInput!: ElementRef;
  @ViewChild('prodIdInput', { static: false }) prodIdInput!: ElementRef;
  @ViewChild('#insuranceField', { static: false }) insuranceInput!: ElementRef;
  @ViewChild('other', { static: false }) otherInput!: ElementRef;
  @ViewChild('prodQtyInput', { static: false }) prodQtyInput!: ElementRef;
  @ViewChild('sellerPanOrPhoneInput') sellerPanOrPhoneInput!: ElementRef;
  selectSenderActive: boolean = false;

  billNo: number = 0;
  sellerId: number | undefined = 0;
  sellerName!: string;
  sellerPan!: number;
  sellerAddress!: string;
  sellerPanOrPhone!: number;
  selectMenusForCompanies!: Company[];
  selectMenusForCompaniesSize!: number;
  saleType: number = 1;
  currentBranch!: string;
  date!: string;
  productBarCodeId: undefined | number;
  sellerSearchMethod: number = 1;
  selectMenusForProduct: Product[] = [];
  createCustomerEnable: boolean = false;
  createProductEnable: boolean = false;
  companyId!: number;
  branchId!: number;
  productsUserWantToPurchase: Product[] = [];
  purchaseBillDetailInfos: PurchaseBillDetail[] = [];
  formpurchaseBill: PurchaseBill[] = [];
  typerate: VatRateTypes[] = [];
  featureObjs: UserFeature[] = [];
  searchByBarCode: boolean = false;
  selectProductActive: boolean = false;
  transportation: number = 0.0;
  insurance: number = 0.0;
  loading: number = 0.0;
  other: number = 0.0;
  taxTypeId!: number;
  transportationTaxType: number = 3;
  insuranceTaxType: number = 3;
  loadingTaxType: number = 3;
  otherTaxType: number = 3;

  customerMetaData!: CustomerMetaData;
  selectSellerEnable: boolean = false;
  createCustomerToggle: boolean = false;
  toggleSelectProduct: boolean = false;

  prodWildCard!: string;
  productQty: number = 1;
  constructor(
    private salesCartService: SalesCartService,
    private productService: ProductService,
    private purchaseBillService: PurchaseBillService,
    private router: Router,
    private loginService: LoginService,
    private tostrService: ToastrService,
    private companyService: CompanyServiceService,
    private formBuilder: FormBuilder,
    private purchaseAdditionalInfoService: PruchaseAdditionalInfoService,
    private renderer: Renderer2,
    private ngxModalService: NgxSmartModalService
  ) {
    const currentDateObj = new Date().toJSON().slice(0, 10);
    this.date = String(adToBs(currentDateObj));
  }

  ngOnInit() {
    this.sellerPanOrPhoneInput?.nativeElement.focus();
    this.createCustomerToggle = false;
    this.toggleSelectProduct = false;

    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.featureObjs = this.loginService.getFeatureObjs();

    this.getAllVatRateTypes();
    this.featureObjs.forEach((fo) => {
      if (fo.featureId === 2) {
        this.searchByBarCode = true;
      }
    });
    this.currentBranch = 'Branch ' + this.branchId;
    // this.dynamicForm = this.formBuilder.group({
    //   fields: this.formBuilder.array([this.createFieldGroup()]),
    // });
    this.dynamicForm = this.formBuilder.group({
      fields: this.formBuilder.array([]),
    });
    this.getPurchaseAdditionalAttribute();
  }

  initiateCreateNewExpensePopUp() {
    const popup = document.getElementById(
      'createNewExpensePopup'
    ) as HTMLButtonElement;
    if (popup) popup.click();
  }

  // Nabin to get the attribute
  purchaseAttribute!: PurchaseAdditionalInfo[];
  getPurchaseAdditionalAttribute() {
    this.purchaseAdditionalInfoService
      .getPurchaseAdditionalAttributes(this.loginService.getCompnayId())
      .subscribe((data) => {
        this.purchaseAttribute = data.data;
      });
  }
  ngAfterViewInit() {
    const sellerPanOrPhoneEL = document.getElementById(
      'sellerPanOrPhone'
    ) as HTMLButtonElement;
    sellerPanOrPhoneEL.focus();
  }

  addTheProductForPurchase() {
    if (this.productBarCodeId === undefined) {
      // this.prodIdInput.nativeElement.focus();
      return;
    }
    this.productService
      .getProductById(this.productBarCodeId, this.searchByBarCode)
      .subscribe({
        next: (data) => {
          if (data.data !== null) {
            console.log(data.data);
            this.productsUserWantToPurchase.push(data.data);
            this.productBarCodeId = undefined;
            this.prodWildCard = data.data.name;
            this.prodQtyInput.nativeElement.focus();
            this.prodQtyInput.nativeElement.select();
          } else if (data.data === null) {
            this.tostrService.error('product not available');
          }
        },
      });
  }
  getAllVatRateTypes() {
    this.productService.getAllVatRateTypes().subscribe((res) => {
      console.log(res.data);
      this.typerate = res.data;
    });
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
  changeProductQuantity() {
    this.productQty;
    const addedProductQtyEl = document.getElementById(
      `qtyProd${this.productsUserWantToPurchase.length - 1}`
    ) as HTMLInputElement;

    addedProductQtyEl.value = String(this.productQty);
    this.updateTotalAmount();
    this.prodIdInput.nativeElement.focus();
    this.prodWildCard = '';
    this.prodIdInput.nativeElement.select();
  }
  sellerSearch(id: number) {
    this.sellerSearchMethod = id;
  }

  updateTotalAmount() {
    this.productsUserWantToPurchase.forEach((prod, index) => {
      const prodQtyEl = document.getElementById(
        `qtyProd${index}`
      ) as HTMLInputElement;
      let qtyProd: number = Number(prodQtyEl.value);
      const prodtotalAmountElement = document.getElementById(
        'totalAmount' + index
      ) as HTMLElement;

      const unitPriceEl = document.getElementById(
        'unitPrice' + index
      ) as HTMLInputElement;
      let sp: number = Number(unitPriceEl.value);
      let prodTotalAmount = Number(qtyProd) * sp;
      prodtotalAmountElement.innerText = '' + prodTotalAmount;
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

  getNameWildCard() {
    setTimeout(() => {
      this.toggleSelectProduct = true;
    }, 400);

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
    this.prodWildCard = prod.name;
    this.productBarCodeId = prod.id;
    this.toggleSelectProduct = false;

    setTimeout(() => {
      this.prodIdInput.nativeElement.focus();
    }, 500);
  }

  fetchPurchaserInfo() {
    if (this.sellerPanOrPhone === null || this.sellerPanOrPhone === undefined) {
      this.tostrService.error(`pan or phone`, 'invalid number');
      return;
      // return;
    }
    this.selectSellerEnable = true;

    setTimeout(() => {
      this.ngxModalService.getModal('selectSellerPopup').open();
    }, 400);

    setTimeout(() => {
      this.companyService
        .getCustomerInfoByPanOrPhone(
          this.sellerSearchMethod,
          this.sellerPanOrPhone
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

  removeItemFromCart(id: number) {
    this.productsUserWantToPurchase = this.productsUserWantToPurchase.filter(
      (prod, index) => index !== id
    );
  }

  setSaleType(id: number) {
    this.saleType = id;
  }
  goTopurchesebuttom() {
    const insurancefiledEl = document.getElementById(
      'submit_btn'
    ) as HTMLInputElement;
    insurancefiledEl.focus();
  }
  goToOtherTaxField() {
    const insurancefiledEl = document.getElementById(
      'otherTaxType'
    ) as HTMLInputElement;
    insurancefiledEl.focus();
  }
  goToOtherField() {
    const insurancefiledEl = document.getElementById(
      'other'
    ) as HTMLInputElement;
    insurancefiledEl.focus();
  }
  goToLoadingTaxField() {
    const insurancefiledEl = document.getElementById(
      'loadingTax'
    ) as HTMLInputElement;
    insurancefiledEl.focus();
  }
  goToLoadingField() {
    const insurancefiledEl = document.getElementById(
      'loading'
    ) as HTMLInputElement;
    insurancefiledEl.focus();
  }
  goToInsuranceTaxField() {
    const insurancefiledEl = document.getElementById(
      'insuranceTax'
    ) as HTMLInputElement;
    insurancefiledEl.focus();
  }
  goToInsuranceField() {
    const insurancefiledEl = document.getElementById(
      'insurance'
    ) as HTMLInputElement;
    insurancefiledEl.focus();
  }
  goToTransportationTaxField() {
    const insurancefiledEl = document.getElementById(
      'transportationTax'
    ) as HTMLInputElement;
    insurancefiledEl.focus();
  }

  destroySelectSenderComponent($event: boolean) {
    setTimeout(() => {
      this.selectSellerEnable = false;
      this.ngxModalService.getModal('selectSellerPopup').close();
    });
  }

  destroySelectProductComponent($event: boolean) {
    this.toggleSelectProduct = false;
  }

  fetchSellerInfoOnlyForNameDisplay($event: number) {
    this.companyService
      .getCustomerInfoByPanOrPhone(
        this.sellerSearchMethod,
        this.sellerPanOrPhone
      )
      .subscribe({
        next: (data) => {
          this.selectMenusForCompanies = data.data;
          this.selectMenusForCompaniesSize = data.data.length;
          this.setSellerInfo($event);
        },
      });
  }

  purchaseTheProducts(draftSt: boolean) {
    console.log('above');
    // if (this.createtransportationForm.invalid) {
    //   this.tostrService.error('please fill all the charges fields');
    //   return;
    // }
    if (this.billNo === 0 || this.billNo === undefined) {
      this.tostrService.error('please fill Bill Number');
      return;
    }

    if (this.sellerId === 0 || this.sellerId === undefined) {
      this.tostrService.error('please fill  the Seller Name or Seller Id');
      return;
    }
    if (this.productsUserWantToPurchase.length <= 0) {
      this.tostrService.error('Please Select Atleast One Product To Purchase');
      return;
    }

    console.log('below');
    this.productsUserWantToPurchase.forEach((prod, index) => {
      let purchaseBillDetail: PurchaseBillDetail = new PurchaseBillDetail();
      purchaseBillDetail.productId = prod.id;
      purchaseBillDetail.taxTypeId = prod.tax;
      let qtyElement = document.getElementById(
        'qtyProd' + index
      ) as HTMLInputElement;
      purchaseBillDetail.qty = Number(qtyElement.value);
      purchaseBillDetail.discountPerUnit = prod.discount;
      purchaseBillDetail.rate = prod.sellingPrice;
      this.purchaseBillDetailInfos.push(purchaseBillDetail);
    });
    this.continueSelling();
  }

  rateChange(sellingPrice: number) {
    if (sellingPrice) {
      this.updateTotalAmount();
    }
  }

  continueSelling() {
    var mainInput = document.getElementById(
      'nepali-datepicker'
    ) as HTMLInputElement;
    var nepaliDate = mainInput.value;

    var Input = document.getElementById('AdDate') as HTMLInputElement;
    var englishDate = Input.value;

    let amount = 0;
    let discount = 0;
    if (this.purchaseBillDetailInfos.length > 0) {
      for (let i = 0; i < this.purchaseBillDetailInfos.length; i++) {
        let prod = this.purchaseBillDetailInfos[i];
        amount += prod.qty * prod.rate;
        discount += prod.qty * prod.discountPerUnit;
      }
    }

    let todaysDate = new Date().toJSON().slice(0, 10);
    let billDateNepali = adToBs(todaysDate);
    let taxableAmount = amount - discount;
    let taxAmount = (13 / 100) * taxableAmount;
    let totalAmount = taxableAmount + taxAmount;

    let purchaseBill: PurchaseBill = new PurchaseBill();
    let purchaseBillMaster: PurchaseBillMaster = new PurchaseBillMaster();
    purchaseBill.saleType = this.saleType;
    purchaseBill.amount = amount;
    purchaseBill.discount = discount;
    purchaseBill.taxableAmount = taxableAmount;
    purchaseBill.taxAmount = taxAmount;
    purchaseBill.totalAmount = totalAmount;
    purchaseBill.companyId = this.companyId;
    purchaseBill.sellerId = this.sellerId!;
    purchaseBill.sellerName = this.sellerName;
    purchaseBill.sellerPan = this.sellerPan;
    purchaseBill.sellerAddress = this.sellerAddress;
    purchaseBill.syncWithIrd = false;
    purchaseBill.enteredBy = this.loginService.currentUser.user.email;
    purchaseBill.paymentMethod = 'CashInHand';
    purchaseBill.purchaseBillNo = this.billNo;
    purchaseBill.userId = this.loginService.currentUser.user.id;
    purchaseBill.companyId = this.companyId;
    purchaseBill.branchId = this.branchId;
    purchaseBill.realTime = true;
    purchaseBill.billActive = true;
    purchaseBill.billDateNepali = String(billDateNepali);

    purchaseBill.transportation = this.transportation;
    purchaseBill.transportationTaxType = this.transportationTaxType;

    purchaseBill.insurance = this.insurance;
    purchaseBill.insuranceTaxType = this.insuranceTaxType;
    purchaseBill.loading = this.loading;
    purchaseBill.loadingTaxType = this.loadingTaxType;
    purchaseBill.other = this.other;
    purchaseBill.otherTaxType = this.otherTaxType;
    if (nepaliDate) {
      purchaseBill.transactionalDate = englishDate || '';
      purchaseBill.transactionalDateNepali = nepaliDate || '';
    }

    purchaseBillMaster.purchaseBillDTO = purchaseBill;
    purchaseBillMaster.purchaseBillDetails = this.purchaseBillDetailInfos;

    console.log(purchaseBillMaster);
    this.purchaseBillService
      .createNewPurchaseBill(purchaseBillMaster)
      .subscribe({
        next: (data) => {
          // this.createtransportationForm.reset();
          console.log(data.data);
          const formData = this.dynamicForm.value;
          formData.fields.map((formValue, index) => {
            var mainInput = document.getElementById(
              'nepali-datepicker-input' + index
            ) as HTMLInputElement;
            var nepaliDate = mainInput.value;

            var supplierName = document.getElementById(
              'supplierName' + index
            ) as HTMLInputElement;

            var supplierNameValue = supplierName.value;

            if (supplierNameValue.length !== 0) {
              formValue.supplierName = supplierNameValue;
            }

            this.purchaseAdditionalInfoService
              .addPurchaseAdditionalInfo({
                amount: formValue.amount,
                attributeId: 0,
                attributeName: '',
                billNo: String(this.billNo),
                branchId: this.loginService.getBranchId(),
                companyId: this.loginService.getCompnayId(),
                expenseId: formValue.expenses,
                invoiceDate: nepaliDate || '',
                invoiceNo: formValue.invoiceNo,
                supplierName: formValue.supplierName,
                supplierPan: formValue.supplierPan,
                vatBill: formValue.vatBill,
                purchaseBillId: data.data,
              })
              .subscribe({
                next: (res) => {
                  if (res) {
                    this.tostrService.success(
                      'Additional attribute Successfully added'
                    );
                  }
                },
              });
          });

          this.router.navigateByUrl(`home/purchasebills`);
        },
        error: (error) => {
          this.tostrService.error('Bill No Already exist');
        },
      });
  }

  displayAddCustomerPopup() {
    this.createCustomerToggle = true;
    this.createCustomerEnable = true;
    this.ngxModalService.getModal('createNewCustomerPurchase').open();
  }
  displayAddProductPopup() {
    this.createProductEnable = true;
  }

  customerAddedSuccessfully($event: number) {
    this.tostrService.success('Customer successfully added with id ' + $event);
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
    this.ngxModalService.getModal('createNewCustomerPurchase').close();
    this.createCustomerToggle = false;
  }

  productAdded($event: Product) {
    this.tostrService.success('Product Has been added ');
    setTimeout(() => {
      this.createProductEnable = false;
      this.toggleSelectProduct = false;
      this.ngxModalService.getModal('selectProduct').close();
    }, 500);
    this.prodWildCard = $event.name;
    this.productsUserWantToPurchase.push($event);
    setTimeout(() => {
      this.prodQtyInput.nativeElement.focus();
      this.prodQtyInput.nativeElement.select();
    }, 1000);
  }
  disableCreateProduct($event: boolean) {
    this.createProductEnable = false;
    this.selectSellerEnable = false;
  }

  createNewProduct($event: any) {}
  // dynamic form
  dynamicForm!: FormGroup;
  supplierName!: string;

  triggerForm: boolean = false;

  get fieldControls() {
    return (this.dynamicForm?.get('fields') as FormArray)?.controls;
  }

  createFieldGroup() {
    return this.formBuilder.group({
      expenses: '',
      supplierPan: '',
      supplierName: '',
      invoiceNo: '',
      amount: '',
      vatBill: '',
    });
  }

  addField() {
    // const fieldArray = this.dynamicForm.get('fields') as FormArray;
    // fieldArray.push(this.createFieldGroup());
    const fieldArray = this.dynamicForm.get('fields') as FormArray;
    if (fieldArray.length === 0) {
      fieldArray.push(this.createFieldGroup());
    } else {
      fieldArray.push(this.createFieldGroup());
    }
  }

  removeField(index: number) {
    const fieldArray = this.dynamicForm.get('fields') as FormArray;
    fieldArray.removeAt(index);
  }

  submitForm() {
    // Handle form submission
    console.log(this.dynamicForm.value);
    const formData = this.dynamicForm.value;
    formData.fields.map((formValue, index) => {
      var supplierName = document.getElementById(
        'supplierName' + index
      ) as HTMLInputElement;

      var supplierNameValue = supplierName.value;
      if (supplierNameValue.length !== 0) {
        formValue.supplierName = supplierNameValue;
        console.log(formValue.supplierName);
      }
      console.log(formValue.supplierName);
    });
  }

  // nabin
  attributeName!: string;

  addnewAttributePopupValue(e: any) {
    this.attributeName = e.target.value;
  }

  OnSubmit() {
    this.purchaseAdditionalInfoService
      .addNewAttribute(this.attributeName, this.loginService.getCompnayId())
      .subscribe({
        next: (res) => {
          this.tostrService.success('attribute Successfully added');
          const element = document.getElementById('closeButton') as HTMLElement;
          this.renderer.selectRootElement(element).click();
          this.getPurchaseAdditionalAttribute();
        },
      });
  }

  // triggerDynamicForm(e: any) {
  //   if (e) this.addField();
  // }

  checkPan(e: any, index: number) {
    this.companyService
      .getCompanyByPanNo(Number(e.target.value))
      .subscribe((res) => {
        res.data;
        console.log(res.data.panNo);
        if (res.data) {
          const data = document.getElementById(
            `supplierName${index}`
          ) as HTMLInputElement;
          data.value = res.data.name;
          this.supplierName = res.data.name;
        } else {
          const data = document.getElementById(
            `supplierName${index}`
          ) as HTMLInputElement;
          data.value = '';
        }
      });
  }
}
