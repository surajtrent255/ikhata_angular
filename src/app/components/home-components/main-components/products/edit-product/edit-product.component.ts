import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { Product } from 'src/app/models/Product';
import { Company } from 'src/app/models/company';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { ProductService } from 'src/app/service/product.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { SelectCategoryService } from '../../categoryprod/select-category.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent {
  @Input() productId !: number;
  product: Product = new Product;
  @Output() updatedSuccessful = new EventEmitter<boolean>(false);
  @Output() destroyEditProduct = new EventEmitter<boolean>(false);

  compId!: number;
  branchId !: number;
  availableCategories: CategoryProduct[] = [];
  selectedSellerCompanyId !: number;

  customerSearchMethod: number = 1;
  custPhoneOrPan !: number;
  selectMenusForCompanies !: Company[];
  selectMenusForCompaniesSize !: number;
  selectedCategory : CategoryProduct = new CategoryProduct;
  constructor(
    private productService: ProductService,
    private categoryProductService: CategoryProductService,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private companyService: CompanyServiceService,
    private selectCategoryService: SelectCategoryService,
    private router: Router
  ) { }

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.getAllCategories();

  }


  ngOnChanges() {
    this.getProduct(this.productId);

  }


  ngOnDestroy() {
  }
  ngAfterViewInit() {
    this.selectCategoryService.selectedCategoryForCatCreationSubject.subscribe(
      (cat) => {
        this.selectedCategory = cat;
        this.product.categoryId = cat.id;
      }
    );
  }

  getAllCategories() {
    this.categoryProductService.getAllCategories(this.compId, this.branchId).subscribe({
      next: (data) => {
        this.availableCategories = data.data;
        this.selectedCategory = this.availableCategories.find(c=> c.id === this.product.categoryId)!;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getProduct(id: number) {
    this.productService.getProductById(id, false).subscribe({
      next: (data) => {
        this.product = data.data;
       this.categoryProductService.getSingleCategory(this.product.categoryId).subscribe((data)=>{
        this.selectedCategory = data.data;
        });
      },
    });
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
  //       const custBtn = document.getElementById("testselectcomp") as HTMLButtonElement;
  //       custBtn.click();
  //     }
  //   }));
  // }
  editProduct(form: any) {
    if (this.product.categoryId === undefined || this.product.categoryId <= 0) {
      this.toastrService.warning('select category');
      return;
    }
    this.product.companyId = this.compId;
    this.product.branchId = this.branchId;
    this.productService.editProduct(this.product).subscribe({
      next: (data) => {
        this.getProduct(this.product.id);
        this.toastrService.success("product has been successfully updated")
        this.updatedSuccessful.emit(true);
      },
      complete: () => {
          this.closeBtn();
      },
    });

    
    //   this.newProduct = $event;
    //   this.newProduct.companyId = 1;
    //   this.newProduct.userId = this.loginService.currentUser.user.id;
    //   this.newProduct.sellerId = 1;
    //   this.productService.addNewProduct(this.newProduct).subscribe({
    //     next: (data) => {
    //       console.log(data.data);
    //     },
    //     error: (error) => {
    //       console.log("Error occured ");
    //     },
    //     complete: () => {
    //       this.fetchAllProducts();
    //     }
    //   })
    //   console.log("product.component.ts")
  }


  closeBtn(){
    const closeBtn = document.getElementById(
      'closeEditButton'
    ) as HTMLButtonElement;
    closeBtn.click();
  }

  customerAdded($event) {
    if ($event === true) {
      this.toastrService.success("Customer Has been added ");
    }
  }

  destroyComp(){
    this.destroyEditProduct.emit(true);
  }
  // setSellerId(id: number) {
  //   this.selectedSellerCompanyId = id;
  //   this.product.sellerId = id;
  //   const closeCustomerPopUpEl = document.getElementById("closeEditCustPop") as HTMLAnchorElement;
  //   closeCustomerPopUpEl.click();
  // }

  // getAllVatRateTypes(){

  //   this.productService.getAllVatRateTypes().subscribe(res => {
  //     console.log(res.data)
  //     this.typerate = res.data;
  //   });
  // }
  // getALLUnit(){
  //   this.productService.getAllUnit().subscribe(res=>{
  //     this.Unit =res.data;
  //   })
  // }
}
