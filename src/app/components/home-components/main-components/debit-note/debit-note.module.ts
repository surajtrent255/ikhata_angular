import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebitNoteRoutingModule } from './debit-note-routing.module';
import { DebitNoteInvoiceComponent } from './debit-note-invoice/debit-note-invoice.component';
import { DebitNoteInvoicePrintComponent } from './debit-note-invoice-print/debit-note-invoice-print.component';
import { DebitNoteListComponent } from './debit-note-list/debit-note-list.component';
import { DebitNoteReportComponent } from './debit-note-report/debit-note-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharablePortionModule } from 'src/app/components/sharable-portion/sharable-portion.module';

@NgModule({
  declarations: [
    DebitNoteInvoiceComponent,
    DebitNoteInvoicePrintComponent,
    DebitNoteListComponent,
    DebitNoteReportComponent,
  ],
  imports: [
    CommonModule,
    DebitNoteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharablePortionModule,
  ],
})
export class DebitNoteModule {}
