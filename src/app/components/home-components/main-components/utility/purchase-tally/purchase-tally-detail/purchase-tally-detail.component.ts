import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseBill } from 'src/app/models/PurchaseBill';
import { PurchaseBillInvoice } from 'src/app/models/PurchaseBillInvoice';
import { PurchaseBillService } from 'src/app/service/purchase-bill.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-purchase-tally-detail',
  templateUrl: './purchase-tally-detail.component.html',
  styleUrls: ['./purchase-tally-detail.component.css']
})
export class PurchaseTallyDetailComponent {
  creditor!: PurchaseBill[];

  sellerPan: any;
  searchInput: string = '';
  currentPageNumber: number = 1;
  earlierPageNumber: number = 1;

  pageToTalItems: number = 5;
  nextPage: boolean = false;
  sortBy: string = 'id';

  purchaseBillInvoice: PurchaseBillInvoice = new PurchaseBillInvoice();

  constructor(
    private route: ActivatedRoute,
    private PurchaseBillService: PurchaseBillService,
    private LoginService: LoginService
  ) {}

  ngOnInit() {
    this.sellerPan = this.route.snapshot.params['sellerPan'];
    if (this.sellerPan) {
      this.fetchLimitedbillsOfCreditor();
    }
  }

  changePage(type: string) {
    this.earlierPageNumber = this.currentPageNumber;
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
    } else if (type === 'next') {
      this.nextPage = true;
      if (this.creditor.length < this.pageToTalItems) return; //this logic is only valid if api data length is less than page size. for equal below is the code.
      this.currentPageNumber += 1;
    }
    this.fetchLimitedbillsOfCreditor();
  }

  fetchLimitedbillsOfCreditor() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageToTalItems + 1;
    offset = Math.max(1, offset);

    this.PurchaseBillService.getDataForCreditorDetail(
      offset,
      this.pageToTalItems,
      this.LoginService.getCompnayId(),
      this.LoginService.getBranchId(),
      this.sellerPan,
      this.searchInput
    ).subscribe((res) => {
      if (res) {
        this.creditor = res.data;
      }
    });
  }

  openBillDetail(billNo: any) {
    setTimeout(() => {
      if (billNo) {
        this.PurchaseBillService.fetchPurchaseBillDetailForInvoice(
          billNo,
          this.LoginService.getCompnayId(),
          this.LoginService.getBranchId()
        ).subscribe((data) => {
          this.purchaseBillInvoice = data.data;
        });
      }
      const modal = document.getElementById(
        'BillDetailPopup'
      ) as HTMLButtonElement;
      if (modal) {
        modal.click();
      }
    });
  }
}
