import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { Product } from 'src/app/models/Product';
import { Unit } from 'src/app/models/Unit';
import { VatRateTypes } from 'src/app/models/VatRateTypes';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { ProductService } from 'src/app/service/product.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { SelectCategoryService } from '../../categoryprod/select-category.service';
import { Company } from 'src/app/models/company';
import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';
import { CommonService } from 'src/app/service/shared/common/common.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent {
  @Input() createProductEnable: boolean = false;
  @Output() productInfoEvent = new EventEmitter<Product>();
  @Output() destroyCreateProd = new EventEmitter<boolean>(false);
  @Output() emitToReset = new EventEmitter<boolean>(false);
  product: Product = new Product();

  availableCategories: CategoryProduct[] = [];
  selectedCategory: CategoryProduct = new CategoryProduct();
  typerate: VatRateTypes[] = [];
  Unit: Unit[] = [];

  constructor(
    private productService: ProductService,
    private categoryProductService: CategoryProductService,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private companyService: CompanyServiceService,
    private selectCategoryService: SelectCategoryService,
    private ngxSmartModuleService: NgxSmartModalService,
    public CommonService: CommonService
  ) {}

  compId!: number;
  branchId!: number;
  catSelected: boolean = false;

  customerSearchMethod: number = 1;
  custPhoneOrPan!: number;
  selectMenusForCompanies!: Company[];
  selectMenusForCompaniesSize!: number;
  selectedSellerCompanyId!: number;
  unit: string = 'other';

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.fetchAllCategories();
    this.getAllVatRateTypes();
    this.getALLUnit();
  }

  fetchAllCategories() {
    this.categoryProductService
      .getAllCategories(this.compId, this.branchId)
      .subscribe((data) => {
        this.availableCategories = data.data;
      });
  }

  ngAfterViewInit() {
    this.CommonService.enableDragging('createProduct', 'productPopup');

    this.selectCategoryService.selectedCategoryForCatCreationSubject.subscribe(
      (cat) => {
        this.selectedCategory = cat;
        this.product.categoryId = cat.id;
      }
    );
  }

  ngOnChanges() {
    this.initCss();
  }

  initCss() {
    if (this.createProductEnable) {
      setTimeout(() => {
        this.ngxSmartModuleService.getModal('createProduct').open();
        this.emitToReset.emit(true);
      });
    }
  }
  // customerSearch(id: number) {
  //   this.customerSearchMethod = id;
  // }

  // fetchCustomerInfo() {
  //   if (this.custPhoneOrPan === null || this.custPhoneOrPan === undefined) {
  //     this.toastrService.error(
  //       `pan or phone`,
  //       'invalid number'
  //     );
  //     return;
  //     // return;
  //   }

  //   this.companyService.getCustomerInfoByPanOrPhone(this.customerSearchMethod, this.custPhoneOrPan).subscribe(({
  //     next: (data) => {
  //       this.selectMenusForCompanies = data.data;
  //       this.selectMenusForCompaniesSize = data.data.length;
  //     },
  //     complete: () => {
  //       const custBtn = document.getElementById("selectCustomer") as HTMLButtonElement;
  //       custBtn.click();
  //     }
  //   }));
  // }

  // setSellerId(id: number) {
  //   this.selectedSellerCompanyId = id;
  //   this.product.sellerId = id;
  //   const closeCustomerPopUpEl = document.getElementById("closeCustPop") as HTMLAnchorElement;
  //   closeCustomerPopUpEl.click();
  // }
  getAllVatRateTypes() {
    this.productService.getAllVatRateTypes().subscribe((res) => {
      this.typerate = res.data;
    });
  }
  getALLUnit() {
    this.productService.getAllUnit().subscribe((res) => {
      this.Unit = res.data;
    });
  }

  createProduct(form: any) {
    if (this.product.categoryId === undefined || this.product.categoryId <= 0) {
      this.toastrService.warning('select category');
      return;
    }
    this.product.companyId = this.compId;
    this.product.branchId = this.branchId;
    this.product.userId = this.loginService.currentUser.user.id;
    this.product.sellerId = this.selectedSellerCompanyId;
    this.productService.addNewProduct(this.product, 0).subscribe({
      next: (data) => {
        this.toastrService.success(
          'product has been added with id ' + data.data.id
        );
        this.productInfoEvent.emit(data.data);
        this.ngxSmartModuleService.getModal('createProduct').close();
      },
      error: (error) => {
        console.log('Error occured ');
      },
      complete: () => {
        this.catSelected = false;
      },
    });

    form.reset({ discount: 0, qtyPerUnit: 1, unit: 'other', tax: 3 });
  }

  customerAdded($event) {
    if ($event === true) {
      this.toastrService.success('Customer Has been added ');
    }
  }

  destroyComp() {
    this.catSelected = false;
    this.destroyCreateProd.emit(true);
    this.ngxSmartModuleService.getModal('createProduct').close();
  }

  displayMainForm() {
    this.catSelected = true;
    this.destroyCreateProd.emit(true);
  }

  handleMouseDown(event: MouseEvent) {
    // Check the event target element or its parent elements
    if (event.target instanceof HTMLElement) {
      const element = event.target as HTMLElement;
      if (!this.isWithinFormElement(element)) {
        this.CommonService.dragMouseDown(event);
        event.stopPropagation(); // Prevent the event from propagating
      }
    }
  }

  isWithinFormElement(element: HTMLElement): boolean {
    // Check if the element is within your form
    // You might need to adapt this logic depending on your specific HTML structure
    return element.closest('form') !== null;
  }
}
