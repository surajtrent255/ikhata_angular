import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreditNote } from 'src/app/models/Credit-Note/creditNote';
import { CreditNoteDetails } from 'src/app/models/Credit-Note/creditNoteDetails';
import { CreditNoteService } from 'src/app/service/shared/Credit-Note/credit-note.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-credit-note-report',
  templateUrl: './credit-note-report.component.html',
  styleUrls: ['./credit-note-report.component.css'],
})
export class CreditNoteReportComponent {
  creditNote: CreditNote[] = [];
  creditNoteDtails!: CreditNoteDetails[];
  searchInput: string = '';
  searchValue: string = '';

  IsAuditor!: boolean;
  currentPageNumber: number = 1;
  pageTotalItems: number = 5;

  grandTotal!: number;

  constructor(
    private loginService: LoginService,
    private creditNoteService: CreditNoteService,
    private commonService: CommonService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getCreditNote();

    this.getLimitedCreditNote();
  }

  printData(printData: CreditNote) {
    this.commonService.setData({
      printData,
    });
    this.router.navigateByUrl('/home/creditnote/print-credit-note');
  }

  getCreditNote() {
    this.creditNoteService
      .getCreditNote(
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe((res) => {
        this.creditNote = res.data;
        this.grandTotal = this.creditNote.reduce(
          (accumulator, entry) => accumulator + entry.totalAmount,
          0
        );
      });
  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.getLimitedCreditNote();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.getLimitedCreditNote();
    }
  }

  getLimitedCreditNote() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;

    this.creditNoteService
      .searchCreditNoteBySearchInput(
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
          this.creditNote = [];
          this.grandTotal = 0;
        } else {
          this.creditNote = res.data;
          this.grandTotal = this.creditNote.reduce(
            (accumulator, entry) => accumulator + entry.totalAmount,
            0
          );
        }
      });
  }

  details(billNumber: string) {
    this.creditNoteService.getCreditNoteDetails(billNumber).subscribe((res) => {
      this.creditNoteDtails = res.data;
    });
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

      this.getLimitedCreditNote();
    }
  }
}
