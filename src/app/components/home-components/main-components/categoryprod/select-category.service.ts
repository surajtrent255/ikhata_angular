import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CategoryProduct } from 'src/app/models/CategoryProduct';

@Injectable({
  providedIn: 'root'
})
export class SelectCategoryService {

  selectedCategoryForCatCreationSubject = new BehaviorSubject<CategoryProduct>(new CategoryProduct);
  private selectedCategoryForCatCreation = this.selectedCategoryForCatCreationSubject.asObservable();


  disabledCategorySubject = new BehaviorSubject<number>( 0);
  private disableCat= this.disabledCategorySubject.asObservable();

  constructor() { }

  changeSelectedCategoryForCatCreation(cat: CategoryProduct) {
    this.selectedCategoryForCatCreationSubject.next(cat);
  }

  resetSelectedCategoryForCatCreation() {
    this.selectedCategoryForCatCreationSubject.next(new CategoryProduct);
  }

  disableCategory(catId: number){
    this.disabledCategorySubject.next(catId);
  }

}
