import {
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { RJResponse } from 'src/app/models/rjresponse';
import { CategoryProductService } from 'src/app/service/category-product.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { SelectCategoryService } from '../../select-category.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CommonService } from 'src/app/service/shared/common/common.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css'],
})
export class CreateCategoryComponent {
  @Input() toggleCreateCategory!: boolean;
  @Output() categorySuccessInfoEvent = new EventEmitter<boolean>();
  @Output() disbaleShowCreateCategory = new EventEmitter<boolean>(false);
  @Output() emitToReset = new EventEmitter<boolean>(false);
  categoryProd: CategoryProduct = new CategoryProduct();
  categoriesData: CategoryProduct[] = [];

  selectedCategory: CategoryProduct = new CategoryProduct();
  catSelected: boolean = false;
  companyId!: number;
  branchId!: number;
  title = 'TreeProj';

  constructor(
    private categoryProductService: CategoryProductService,
    private loginService: LoginService,
    private selectCategoryService: SelectCategoryService,
    private tostrService: ToastrService,
    private renderer: Renderer2,
    private ngxSmartModuleService: NgxSmartModalService,
    public CommonService: CommonService
  ) {}

  ngOnInit() {
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.fetchAllCategories();
  }

  ngOnChanges() {
    if (this.toggleCreateCategory) {
      this.ngxSmartModuleService.getModal('createCategory').open();
      this.emitToReset.emit(true);
    }
  }
  ngAfterViewInit() {
    this.CommonService.enableDragging('createCategory', 'createCategoryPopup');
    this.selectCategoryService.selectedCategoryForCatCreationSubject.subscribe(
      (cat) => (this.selectedCategory = cat)
    );
  }

  fetchAllCategories() {
    this.categoryProductService
      .getAllCategories(this.companyId, this.branchId)
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

  displayMainForm() {
    this.catSelected = true;
  }

  createCategoryProd(createCategoryProdForm: any) {
    this.categoryProd.companyId = this.companyId;
    this.categoryProd.branchId = this.branchId;
    this.categoryProd.parentId = this.selectedCategory.id;
    this.selectedCategory = new CategoryProduct();
    this.categoryProd.userId = this.loginService.currentUser.user.id;
    this.selectCategoryService.resetSelectedCategoryForCatCreation();

    this.categoryProductService.addNewCategory(this.categoryProd).subscribe({
      next: (data: RJResponse<number>) => {
        createCategoryProdForm.reset();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        createCategoryProdForm.reset();
        this.fetchAllCategories();
        this.categorySuccessInfoEvent.emit(true);
        this.tostrService.success('successfull addded ');
        this.destroyComp(createCategoryProdForm);

        this.catSelected = false;
      },
    });
  }

  selectTheCategory($event: number) {
    // this.catSelected = true;
    // this.selectedCategory = $event;
    this.categoryProd.parentId = $event;
  }

  destroyComp(createCategoryProdForm: any) {
    createCategoryProdForm.reset();
    this.catSelected = false;
    this.ngxSmartModuleService.getModal('createCategory').close();
    this.disbaleShowCreateCategory.emit(true);
    this.selectCategoryService.resetSelectedCategoryForCatCreation();
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
