import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceiptRoutingModule } from './receipt-routing.module';
import { EditReceiptComponent } from './edit-receipt/edit-receipt.component';
import { ReceiptComponent } from './receipt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ConfirmAlertComponent } from 'src/app/components/sharable-portion/confirm-alert/confirm-alert.component';
import { SharablePortionModule } from 'src/app/components/sharable-portion/sharable-portion.module';

@NgModule({
  declarations: [EditReceiptComponent, ReceiptComponent],
  imports: [
    CommonModule,
    ReceiptRoutingModule,
    SharablePortionModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSmartModalModule.forRoot(),
  ],
})
export class ReceiptModule {}
