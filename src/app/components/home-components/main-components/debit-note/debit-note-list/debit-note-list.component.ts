import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { DebitNoteService } from 'src/app/service/shared/Debit-Note/debit-note.service';
import { DebitNoteDetails } from 'src/app/models/Debit-Note/debitNoteDetails';
import { DebitNote } from 'src/app/models/Debit-Note/debitNote';

@Component({
  selector: 'app-debit-note-list',
  templateUrl: './debit-note-list.component.html',
  styleUrls: ['./debit-note-list.component.css'],
})
export class DebitNoteListComponent {
  debitNote!: DebitNote[];
  debitNoteDetails!: DebitNoteDetails[];

  isAccountant: boolean = false;
  isMaster: boolean = false;
  currentPageNumber: number = 1;
  pageTotalItems: number = 5;

  nepaliDate!: string;

  constructor(
    private debitNoteService: DebitNoteService,
    private loginService: LoginService,
    private commonService: CommonService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getDebitNote();

    let roles = this.loginService.getCompanyRoles();
    if (roles?.includes('ACCOUNTANT')) {
      this.isAccountant = true;
    } else if (roles.includes('ADMIN')) {
      this.isMaster = true;
    } else {
      this.isAccountant = false;
      this.isMaster = false;
    }
  }

  getDebitNote() {
    this.debitNoteService
      .getDebitNotes(
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe((res) => {
        this.debitNote = res.data;
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
      .getLimitedDebitNotes(
        offset,
        this.pageTotalItems,
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.toastrService.error('bills not found ');
          this.currentPageNumber -= 1;
        } else {
          this.debitNote = res.data;
        }
      });
  }

  details(billNumber: number) {
    const popUp = document.getElementById(
      'debitNoteDetailsPopup'
    ) as HTMLButtonElement;
    popUp.click();
    this.debitNoteService.getDebitNoteDetails(billNumber).subscribe((res) => {
      this.debitNoteDetails = res.data;
    });
  }
}
