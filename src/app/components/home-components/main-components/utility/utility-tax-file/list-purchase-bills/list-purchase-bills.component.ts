import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseBill } from 'src/app/models/PurchaseBill';
import { PurchaseBillService } from 'src/app/service/purchase-bill.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-list-purchase-bills',
  templateUrl: './list-purchase-bills.component.html',
  styleUrls: ['./list-purchase-bills.component.css']
})
export class ListPurchaseBillsComponent {

  
  currentPageNumber: number = 1;
  pageTotalItems: number = 5;
  searchBy: string = '';
  searchWildCard: string = '';
  branchId!: number;
  sortBy: string = 'id';

  purchaseBills: PurchaseBill[] = [];
  compId!: number;
  searchInput: string = '';
  searchValue: string = '';
  fiscalYear!:string;
  quarter !:number;
  
  constructor(
    private loginService: LoginService,
    private toastrService: ToastrService,
    private purchaseBillService: PurchaseBillService,
    private route:ActivatedRoute

  ){
   
  }

  ngOnInit(){
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length !== 0) {
        this.fiscalYear = params['fiscalYear'];
        this.quarter = params['quarter']    
      }
    })
    this.fetchLimitedPurchaseBill();


  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedPurchaseBill();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedPurchaseBill();
    }
  }

  fetchLimitedPurchaseBill() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    this.purchaseBillService
      .getLimitedPurchaseBillForIRD(
        offset,
        this.fiscalYear,
        this.quarter,
        this.pageTotalItems,
        this.compId,
        this.branchId,
        this.searchInput,
        this.searchValue
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.toastrService.error('bills not found ');
          // this.currentPageNumber -= 1;
        } else {
          this.purchaseBills = res.data;
        }
      });
  }
}
