import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditNoteRoutingModule } from './credit-note-routing.module';
import { CreditNoteInvoiceComponent } from './credit-note-invoice/credit-note-invoice.component';
import { CreditNoteInvoicePrintComponent } from './credit-note-invoice-print/credit-note-invoice-print.component';
import { CreditNoteListComponent } from './credit-note-list/credit-note-list.component';
import { CreditNoteReportComponent } from './credit-note-report/credit-note-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharablePortionModule } from 'src/app/components/sharable-portion/sharable-portion.module';

@NgModule({
  declarations: [
    CreditNoteInvoiceComponent,
    CreditNoteInvoicePrintComponent,
    CreditNoteListComponent,
    CreditNoteReportComponent,
  ],
  imports: [
    CommonModule,
    CreditNoteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharablePortionModule,
  ],
})
export class CreditNoteModule {}
