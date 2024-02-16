import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DebitNote } from 'src/app/models/Debit-Note/debitNote';
import { DebitNoteDetails } from 'src/app/models/Debit-Note/debitNoteDetails';
import { DebitNoteService } from 'src/app/service/shared/Debit-Note/debit-note.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-debit-note-report',
  templateUrl: './debit-note-report.component.html',
  styleUrls: ['./debit-note-report.component.css'],
})
export class DebitNoteReportComponent {
  debitNote!: DebitNote[];
  debitNoteDetails!: DebitNoteDetails[];

  IsAuditor!: boolean;
  currentPageNumber: number = 1;
  pageTotalItems: number = 5;

  searchInput: string = '';
  searchValue: string = '';

  grandTotal!: number;

  constructor(
    private debitNoteService: DebitNoteService,
    private loginService: LoginService,
    private commonService: CommonService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getDebitNote();
  }

  getDebitNote() {
    this.debitNoteService
      .getDebitNotes(
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe((res) => {
        this.debitNote = res.data;
        this.grandTotal = this.debitNote.reduce(
          (accumulator, entry) => accumulator + entry.totalAmount,
          0
        );
      });
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedDebitNotes();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedDebitNotes();
    }
  }

  fetchLimitedDebitNotes() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.debitNoteService
      .searchDebitNoteBySearchInput(
        offset,
        this.pageTotalItems,
        this.loginService.getCompnayId(),
        this.searchInput,
        this.searchValue
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.toastrService.error('notes not found ');
          // this.currentPageNumber -= 1;
          this.debitNote = [];
          this.grandTotal = 0;
        } else {
          this.debitNote = res.data;
          this.grandTotal = this.debitNote.reduce(
            (accumulator, entry) => accumulator + entry.totalAmount,
            0
          );
        }
      });
  }

  details(billNumber: number) {
    this.debitNoteService.getDebitNoteDetails(billNumber).subscribe((res) => {
      this.debitNoteDetails = res.data;
    });
  }

  printData(debitNoteData: DebitNote) {
    this.commonService.setData({
      debitNoteData,
    });
    this.router.navigateByUrl('/home/debitnote/print-debit-note');
  }

  handleData(data: any) {
    if (data) {
      if (
        data.value === null ||
        data.value.length === 0 ||
        data.value === '0'
      ) {
        this.searchInput = '';
        this.searchValue = '';
      } else {
        this.searchInput = data.searchBy;
        this.searchValue = data.value;
      }

      this.fetchLimitedDebitNotes();
    }
  }
}
