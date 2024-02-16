import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SalesBill } from 'src/app/models/SalesBill';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-sales-tally',
  templateUrl: './sales-tally.component.html',
  styleUrls: ['./sales-tally.component.css']
})
export class SalesTallyComponent {

  salesTally: SalesBill[] = [];
  companyId !: number;
  branchId !: number;

  searchBy: string = 'customer_name';
  searchWildCard: string = '';
  currentPageNumber: number = 1;
  earlierPageNumber: number = 1;

  pageToTalItems: number = 5;
  nextPage: boolean = false;
  sortBy: string = "id";

  indexOfSpinner : number = -1;
  currentFiscalYear:string = "";
  constructor(private salesBillService: SalesBillServiceService,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private commonService: CommonService) { }


  ngOnInit() {
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    // this.getSalesBillService();
    this.commonService.getCurrentFiscalYear().subscribe((res)=>{
      this.currentFiscalYear = res.data.fiscalYear;
      this.fetchLimitedSalesTallyList(true);
    })
    
  }

  ngOnChanges() {

  }

  getSalesBillService() {
    this.salesBillService.getAllDebtors(this.companyId, this.branchId).subscribe((res) => {
      this.salesTally = res.data;
    })
  }

  changePage(type: string) {
    this.earlierPageNumber = this.currentPageNumber;
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
    } else if (type === 'next') {
      this.nextPage = true;
      if (this.salesTally.length < this.pageToTalItems) return; //this logic is only valid if api data length is less than page size. for equal below is the code.
      this.currentPageNumber += 1;
    }
    this.fetchLimitedSalesTallyList(true);
  }


  sendEmail(cust:SalesBill, index:number ) {
    this.indexOfSpinner = index;
    const data = {
        name:cust.customerName,
        pan:cust.customerPan,
        totalAmount:cust.totalAmount,
        email: cust.email,
        totalTaxAmount: cust.taxAmount
    }
    this.commonService.sendEmail(data, '?type=salesTally').subscribe(res=>{
        this.toastrService.success(" email has been sent to the customer with pan " + cust.customerName);
        this.indexOfSpinner = -1;
    });
  }

  getCurrentFiscalYear(){
    this.commonService.getCurrentFiscalYear().subscribe((res)=>{
      this.currentFiscalYear = res.data.fiscalYear;
    })
  }

  fetchLimitedSalesTallyList(onInit?: boolean) {
    // this.salesBillService.
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageToTalItems + 1;
    offset = Math.max(1, offset);

    this.salesBillService.getLimitedDebtors(offset,
      this.pageToTalItems, this.searchBy, this.searchWildCard, this.sortBy, this.companyId, this.branchId, this.currentFiscalYear, true).subscribe(res => {
        if (res.data.length === 0 || res.data === undefined) {
          this.salesTally = [];
          this.toastrService.error('sales tally not found ');
          // this.currentPageNumber -= 1;
          if (this.nextPage === true) {
            this.currentPageNumber = this.earlierPageNumber;
            this.fetchLimitedSalesTallyList();
            this.nextPage = false;
          }
        } else {
          this.salesTally = res.data;
          this.nextPage = false;
        }
      })
  }


}
