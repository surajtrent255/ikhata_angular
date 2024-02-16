import { Component } from '@angular/core';
import { DebitNote } from 'src/app/models/Debit-Note/debitNote';
import { DebitNoteDetails } from 'src/app/models/Debit-Note/debitNoteDetails';
import { DebitNoteService } from 'src/app/service/shared/Debit-Note/debit-note.service';
import { CommonService } from 'src/app/service/shared/common/common.service';

@Component({
  selector: 'app-debit-note-invoice-print',
  templateUrl: './debit-note-invoice-print.component.html',
  styleUrls: ['./debit-note-invoice-print.component.css'],
})
export class DebitNoteInvoicePrintComponent {
  year!: string;
  date!: string;
  fileName!: string;
  debitNote!: DebitNote;
  debitNoteDetails!: DebitNoteDetails[];
  constructor(
    private debitNoteService: DebitNoteService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.commonService.data$.subscribe((res) => {
      this.debitNote = res.debitNoteData;
      let data = this.debitNote.nepaliDate;
      this.year = data.substring(0, 4);
      this.debitNoteService
        .getDebitNoteDetails(this.debitNote.billNumber)
        .subscribe((res) => {
          this.debitNoteDetails = res.data;
          this.fileName = String(
            this.debitNoteDetails[0].billNumber +
              this.debitNoteDetails[0].serialNumber
          );
        });
    });
  }

  exportToExcel() {
    this.commonService.convertToExcel('httptrace-table', this.fileName);
  }

  exportToPdf() {
    this.commonService.convertToPdf('httptrace-table', this.fileName);
  }
}
