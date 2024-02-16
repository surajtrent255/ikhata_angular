import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryProduct } from 'src/app/models/CategoryProduct';
import { SelectCategoryService } from '../select-category.service';
import { CategoryProductService } from 'src/app/service/category-product.service';

@Component({
  selector: 'app-select-category',
  templateUrl: './select-category.component.html',
  styleUrls: ['./select-category.component.css'],
})
export class SelectCategoryComponent {
  @Input() nodes: CategoryProduct[] = [];
  @Input() showDisableButton: Boolean = true;
  constructor(
    private selectCategoryService: SelectCategoryService,
    private categoryProductService: CategoryProductService
  ) {}

  toggleNode(node: CategoryProduct) {
    node.showChildren = !node.showChildren;
  }

  selectCategory(node: CategoryProduct) {
    if (node.deleted === true) return;
    this.selectCategoryService.changeSelectedCategoryForCatCreation(node);
    // this.selectedCategory.emit(node.id);
  }

  disableCategory(id: number) {
    this.categoryProductService.deleteCategory(id).subscribe((data) => {
      this.selectCategoryService.disableCategory(id);
    });
  }
}
