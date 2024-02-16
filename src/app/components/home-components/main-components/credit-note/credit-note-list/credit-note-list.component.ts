import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreditNote } from 'src/app/models/Credit-Note/creditNote';
import { CreditNoteDetails } from 'src/app/models/Credit-Note/creditNoteDetails';
import { CreditNoteService } from 'src/app/service/shared/Credit-Note/credit-note.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-credit-note-list',
  templateUrl: './credit-note-list.component.html',
  styleUrls: ['./credit-note-list.component.css'],
})
export class CreditNoteListComponent {
  creditNote!: CreditNote[];
  creditNoteDtails!: CreditNoteDetails[];

  currentPageNumber: number = 1;
  pageTotalItems: number = 5;
  isAccountant: boolean = false;
  isMaster: boolean = false;

  constructor(
    private loginService: LoginService,
    private creditNoteService: CreditNoteService,
    private commonService: CommonService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getCreditNote();

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

  getCreditNote() {
    this.creditNoteService
      .getCreditNote(
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe((res) => {
        this.creditNote = res.data;
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
      .getLimitedCreditNote(
        offset,
        this.pageTotalItems,
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.toastrService.error('notes not found ');
          this.currentPageNumber -= 1;
        } else {
          this.creditNote = res.data;
        }
      });
  }

  details(billNumber: string) {
    const popUp = document.getElementById(
      'creditNoteDetailsPopup'
    ) as HTMLButtonElement;
    popUp.click();
    this.creditNoteService.getCreditNoteDetails(billNumber).subscribe((res) => {
      this.creditNoteDtails = res.data;
    });
  }
}
