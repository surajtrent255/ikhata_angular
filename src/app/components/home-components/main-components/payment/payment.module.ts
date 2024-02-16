import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PaymentComponent } from './payment.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { SharablePortionModule } from 'src/app/components/sharable-portion/sharable-portion.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
  declarations: [EditPaymentComponent, PaymentComponent],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    NgxSmartModalModule,
    SharablePortionModule,
    AutocompleteLibModule,
  ],
})
export class PaymentModule {}
