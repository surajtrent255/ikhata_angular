import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseBill } from 'src/app/models/PurchaseBill';
import { PurchaseBillService } from 'src/app/service/purchase-bill.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-purchase-tally',
  templateUrl: './purchase-tally.component.html',
  styleUrls: ['./purchase-tally.component.css']
})
export class PurchaseTallyComponent {
  creditor: PurchaseBill[] = [];

  searchBy: string = 'seller_name';
  searchWildCard: string = '';
  currentPageNumber: number = 1;
  earlierPageNumber: number = 1;

  pageToTalItems: number = 5;
  nextPage: boolean = false;
  sortBy: string = 'id';

  indexOfSpinner: number = -1;
  constructor(
    private purchaseBillService: PurchaseBillService,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private commmonService: CommonService
  ) {}
  ngOnInit() {
    let sellerPan = this.route.snapshot.params['sellerPan'];
    this.fetchLimitedCreditorsList();
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
    this.fetchLimitedCreditorsList();
  }

  fetchLimitedCreditorsList() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageToTalItems + 1;
    offset = Math.max(1, offset);
    
    this.purchaseBillService
      .getAllCreditors(
        offset,
        this.pageToTalItems,
        this.loginService.getCompnayId(),
        this.loginService.getBranchId(),
        this.searchBy,
        this.searchWildCard,
        true
      )
      .subscribe((res) => {
        if (res.data.length === 0 || res.data === undefined) {
          this.creditor = [];
          this.toastrService.error('Purchaser not found ');
          // this.currentPageNumber -= 1;
          if (this.nextPage === true) {
            this.currentPageNumber = this.earlierPageNumber;
            this.fetchLimitedCreditorsList();
            this.nextPage = false;
          }
        } else {
          this.creditor = res.data;
          this.nextPage = false;
        }
      });
  }

  routeToDetail(sellerPan: any) {
    this.router.navigateByUrl(
      `/home/utility/purchasetally/bill/${sellerPan}`
    );
  }

  sendEmail(purc: PurchaseBill ,index: number){
    this.indexOfSpinner = index;
    const data = {
      name: purc.sellerName ,
      pan: purc.sellerPan,
      totalAmount: purc.totalAmount,
      email: "abc@gmail.com",
      totalTaxAmount: purc.taxAmount,
    }
    this.commmonService.sendEmail(data, '?type=purchaseTally').subscribe((res)=>{
      this.toastrService.success(" email has been sent to seller with pan " + purc.sellerName)
      this.indexOfSpinner = -1;
    }, (error)=>{
      this.toastrService.error("cant send !!");
      this.indexOfSpinner = -1;
    })
  }
}
