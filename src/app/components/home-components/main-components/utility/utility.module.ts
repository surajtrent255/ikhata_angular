import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilityRoutingModule } from './utility-routing.module';
import { UtilityTaxFileComponent } from './utility-tax-file/utility-tax-file.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import {  MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { ListSalesBillsComponent } from './utility-tax-file/list-sales-bills/list-sales-bills.component';
import { ListPurchaseBillsComponent } from './utility-tax-file/list-purchase-bills/list-purchase-bills.component';
import { SalesTallyComponent } from './sales-tally/sales-tally.component';
import { SalesTallyBillDetailComponent } from './sales-tally/sales-tally-bill-detail/sales-tally-bill-detail.component';
import { SalesTallyBillListComponent } from './sales-tally/sales-tally-bill-list/sales-tally-bill-list.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PurchaseTallyComponent } from './purchase-tally/purchase-tally.component';
import { PurchaseTallyDetailComponent } from './purchase-tally/purchase-tally-detail/purchase-tally-detail.component';

@NgModule({
  declarations: [
    UtilityTaxFileComponent,
    ListSalesBillsComponent,
    ListPurchaseBillsComponent,
    SalesTallyComponent,
    SalesTallyBillDetailComponent,
    SalesTallyBillListComponent,
    PurchaseTallyComponent,
    PurchaseTallyDetailComponent
  ],
  imports: [
    CommonModule,
    UtilityRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    NgxSmartModalModule.forRoot(),
    MatProgressSpinnerModule

  ]
})
export class UtilityModule { }


export class MyErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
