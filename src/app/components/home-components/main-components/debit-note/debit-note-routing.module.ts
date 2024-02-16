import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebitNoteComponent } from './debit-note.component';
import { DebitNoteInvoiceComponent } from './debit-note-invoice/debit-note-invoice.component';
import { DebitNoteListComponent } from './debit-note-list/debit-note-list.component';
import { DebitNoteInvoicePrintComponent } from './debit-note-invoice-print/debit-note-invoice-print.component';
import { DebitNoteReportComponent } from './debit-note-report/debit-note-report.component';

const routes: Routes = [
  {
    path: '',
    component: DebitNoteComponent,
  },
  {
    path: 'debitnoteInvoice',
    component: DebitNoteInvoiceComponent,
  },
  {
    path: 'debitNoteList',
    component: DebitNoteListComponent,
  },
  {
    path: 'print-debit-note',
    component: DebitNoteInvoicePrintComponent,
  },
  {
    path: 'debit-note-report',
    component: DebitNoteReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebitNoteRoutingModule {}
