import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditNoteComponent } from './credit-note.component';
import { CreditNoteInvoiceComponent } from './credit-note-invoice/credit-note-invoice.component';
import { CreditNoteListComponent } from './credit-note-list/credit-note-list.component';
import { CreditNoteInvoicePrintComponent } from './credit-note-invoice-print/credit-note-invoice-print.component';
import { CreditNoteReportComponent } from './credit-note-report/credit-note-report.component';

const routes: Routes = [
  {
    path: '',
    component: CreditNoteComponent,
  },
  {
    path: 'creditnoteInvoice',
    component: CreditNoteInvoiceComponent,
  },
  {
    path: 'creditNoteList',
    component: CreditNoteListComponent,
  },
  {
    path: 'print-credit-note',
    component: CreditNoteInvoicePrintComponent,
  },
  {
    path: 'credit-note-report',
    component: CreditNoteReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditNoteRoutingModule {}
