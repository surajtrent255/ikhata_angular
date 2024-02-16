import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { Product } from 'src/app/models/Product';
import { VatRateTypes } from 'src/app/models/VatRateTypes';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { ProductService } from 'src/app/service/product.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-retrive-products',
  templateUrl: './retrive-products.component.html',
  styleUrls: ['./retrive-products.component.css'],
})
export class RetriveProductsComponent {
  // title = "pagination";
  // POSTS: any;
  // page: number = 1;
  // count: number = 0;
  // tableSize: number = 10;
  // tableSizes: any = [1, 10, 15, 20];

  availableProducts: Product[] = [];
  availableCategories: CategoryProduct[] = [];
  typerate: VatRateTypes[] = [];
  enableCreateProduct: boolean = false;
  confirmAlertDisplay: boolean = false;
  createProductShow: boolean = false;

  // pagination: PaginationCustom = new PaginationCustom;

  showableCreateProdDiv: boolean = false;
  showableEditProdDiv: boolean = false;
  constructor(
    private productService: ProductService,
    private loginService: LoginService,
    private router: Router,
    private toastrService: ToastrService,
    private renderer: Renderer2,
    private categoryProductService: CategoryProductService,
    private ngxSmartModalService: NgxSmartModalService,
    public CommonService: CommonService
  ) {}

  newProduct!: Product;
  isAccountant: boolean = false;
  isMaster: boolean = false;
  deleteProductId!: number;
  productInfoForUpdateId!: number;
  compId!: number;
  branchId!: number;
  categoriesData: CategoryProduct[] = [];

  currentPageNumber: number = 1;
  pageTotalItems: number = 5;
  nextPage: boolean = false;
  searchBy: string = 'name';
  searchWildCard: string = '';

  sortBy: string = 'id';

  earlierPageNumber: number = 1;

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    // this.fetchAllProducts(this.compId, this.branchId);
    this.fetchLimitedProducts(true);
    this.fetchAllCategories();
    let roles = this.loginService.getCompanyRoles();
    this.getAllVatRateTypes();

    if (roles?.includes('ACCOUNTANT')) {
      this.isAccountant = true;
    } else if (roles.includes('ADMIN')) {
      this.isMaster = true;
    } else {
      this.isAccountant = false;
      this.isMaster = false;
    }

    // angular pagination
    // this.tableSize = 1;
    // this.page = 1;
    // this.postList();
  }
  ngAfterViewInit() {
    this.CommonService.enableDragging('confirmAlertPopup', 'confirmAlertpopup');
  }

  // postList(): void {
  //   this.productService.getAllPosts().subscribe((response) => {
  //     this.POSTS = response;
  //   })
  // }

  // onTableDataChanges(event: any) {
  //   this.page = event;
  //   this.postList();
  // }

  // onTableSizeChange(event: any): void {
  //   this.tableSize = event.target.value;
  //   this.page = 1;
  //   this.postList();
  // }
  // angular pagination finish

  changePage(type: string) {
    this.earlierPageNumber = this.currentPageNumber;
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
    } else if (type === 'next') {
      if (this.availableProducts.length < this.pageTotalItems) return; //this logic is only valid if api data length is less than page size. for equal below is the code.
      this.currentPageNumber += 1;
    }
    this.fetchLimitedProducts();
  }

  fetchAllCategories() {
    this.categoryProductService
      .getAllCategories(this.compId, this.branchId)
      .subscribe((data) => {
        this.categoriesData = data.data;
        console.log(this.categoriesData);
      });
  }

  fetchLimitedProducts(onInit?: boolean) {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    offset = Math.max(1, offset);

    this.productService
      .getLimitedProducts(
        offset,
        this.pageTotalItems,
        this.searchBy,
        this.searchWildCard,
        this.sortBy,
        this.compId,
        this.branchId
      )
      .subscribe((res) => {
        if (res.data.length === 0 || res.data === undefined) {
          this.availableProducts = [];
          this.toastrService.error('products not found ');
          // this.currentPageNumber -= 1;
          // above two line of code is for that condition, when no available products remain in nextclick;
          if (this.nextPage === false) {
            this.currentPageNumber = this.earlierPageNumber;
            if (onInit === false) this.fetchLimitedProducts();
            this.nextPage = false;
          }
        } else {
          this.availableProducts = res.data;
          this.nextPage = false;
        }
      });
  }

  fetchAllProducts(compId: number, branchId: number) {
    this.productService.getAllProducts(compId, branchId).subscribe((data) => {
      this.availableProducts = data.data;
    });
  }

  showAddProductComp() {
    this.showableCreateProdDiv = true;
  }

  getProduct(id: number) {
    this.productInfoForUpdateId = id;
  }

  editProduct(id: number) {
    this.productInfoForUpdateId = id;

    this.showableEditProdDiv = true;
    const editProductPopUp = document.getElementById(
      'editProduct'
    ) as HTMLButtonElement;
    editProductPopUp.click();

    // this.getProduct(id);
    // this.router.navigateByUrl('dashboard/products/edit/' + id);
  }

  destroyEditProductComp() {
    this.showableEditProdDiv = false;
  }

  fetchAllProductsAfterEdit() {
    this.fetchAllProducts(this.compId, this.branchId);
    this.destroyEditProductComp();
  }

  getAllVatRateTypes() {
    this.productService.getAllVatRateTypes().subscribe((res) => {
      console.log(res.data);
      this.typerate = res.data;
    });
  }

  createNewProduct($event: Product) {
    if ($event.id > 0) {
      this.fetchLimitedProducts();
    }
  }

  deleteProduct(id: number) {
    this.confirmAlertDisplay = true;
    this.deleteProductId = id;
    this.ngxSmartModalService.getModal('confirmAlertPopup').open();
  }

  continuingDeleting(id: number) {
    this.productService.deleteProductById(id).subscribe({
      next: (res) => {
        console.log(res);
        this.toastrService.success('product has been deleted');
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.fetchLimitedProducts();
      },
    });
  }

  destroyConfirmAlertSectionEmitter($event: boolean) {
    this.confirmAlertDisplay = false;
    this.ngxSmartModalService.getModal('confirmAlertPopup').close();
    if ($event === true) {
      this.continuingDeleting(this.deleteProductId);
    }
  }

  destroyCreateProductComponent() {
    // this.createProductShow = false;
    this.enableCreateProduct = false;
  }

  onCreate() {
    this.enableCreateProduct = true;
    // this.createProductShow = true;
    // const createNewProductBtn = document.getElementById("createProductPopUp") as HTMLElement;
    // createNewProductBtn.click();
  }
}
