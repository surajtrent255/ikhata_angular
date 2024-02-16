import { Component, Renderer2, ViewChild } from '@angular/core';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { SelectCategoryService } from './select-category.service';

@Component({
  selector: 'app-categoryprod',
  templateUrl: './categoryprod.component.html',
  styleUrls: ['./categoryprod.component.css'],
})
export class CategoryprodComponent {
  @ViewChild('createNewCategoryTemplate')
  categoryProd: CategoryProduct = new CategoryProduct();
  categoriesData: CategoryProduct[] = [];

  compId!: number;
  branchId!: number;

  isAccountant: boolean = false;
  isMaster: boolean = false;

  toggleCreateCategory: boolean = false;
  catSelected: boolean = false;

  constructor(
    private categoryProductService: CategoryProductService,
    private loginService: LoginService,
    private renderer: Renderer2,
    private selectCatService: SelectCategoryService
  ) {}

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.fetchAllCategories();
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
    // const createCatBtn = document.querySelector(
    //   'createNewCategory'
    // ) as HTMLAnchorElement;
    // this.renderer.listen(createCatBtn, 'click', () => {
    //   this.toggleCreateCategory = true;
    // });

    this.selectCatService.disabledCategorySubject.subscribe((id) => {
      if (id !== 0) this.fetchAllCategories();
    });
  }

  fetchAllCategories() {
    this.categoryProductService
      .getAllCategories(this.compId, this.branchId)
      .subscribe((data) => {
        this.categoriesData = data.data;
      });
  }

  addNewCategory() {
    const catCreateDiv = document.getElementById(
      'createCatDiv'
    ) as HTMLDivElement;
    catCreateDiv.removeAttribute('hidden');
  }

  createNewCategory($event: boolean) {
    if (($event = true)) {
      this.fetchAllCategories();
      this.toggleCreateCategory = false;
    }
  }

  enableCreateCategory() {
    this.toggleCreateCategory = true;
  }

  disableCreateCategoryComp($event: boolean) {
    if ($event === true) {
      this.toggleCreateCategory = false;
    }
  }
}
