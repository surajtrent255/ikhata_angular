import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { SalesBill } from 'src/app/models/SalesBill';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-sales-tally-bill-detail',
  templateUrl: './sales-tally-bill-detail.component.html',
  styleUrls: ['./sales-tally-bill-detail.component.css']
})
export class SalesTallyBillDetailComponent {

  companyId !: number;
  branchId !: number;
  salesTallyBills !: SalesBill[];
  debtorPan !: number ;
  showItemsListOfBill: boolean = false;
  itemListOfBill !: SalesBillInvoice;

  earlierPageNumber: number = 1;
  currentPageNumber: number = 1;
  nextPage: boolean = false;
  pageToTalItems: number = 5;
  offset=1;
  searchInput : string = "";
  searchBy: string="";
  constructor(private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private billService: SalesBillServiceService,
    private ngxSmartModalService: NgxSmartModalService,
    private salesBillService: SalesBillServiceService
  ) { }

  ngOnInit() {
    this.debtorPan = this.activatedRoute.snapshot.params['customer_pan'];
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.fetchSalesTallyBillDetailByBillId();
  }



  openListOfItems(billId: number) {
    this.showItemsListOfBill = true;
    this.salesBillService.fetchSalesBillDetailForInvoice(billId).subscribe(data => {
      this.itemListOfBill = data.data;
      this.ngxSmartModalService.getModal("itemsListOfBill").open();

    })
  }

  destroyItemsOfBill($event: boolean){
    this.showItemsListOfBill  = false; 
    this.ngxSmartModalService.getModal("itemsListOfBill").close();
  }


  changePage(type: string) {
    this.earlierPageNumber = this.currentPageNumber;
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
    } else if (type === 'next') {
      this.nextPage = true;
      if (this.salesTallyBills.length < this.pageToTalItems) return; //this logic is only valid if api data length is less than page size. for equal below is the code.
      this.currentPageNumber += 1;
    }
    this.fetchLimitedbillsOfSalesTally();
  }

  fetchLimitedbillsOfSalesTally() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageToTalItems + 1;
    this.offset = Math.max(1, offset);
    this.fetchSalesTallyBillDetailByBillId()
  }

  fetchSalesTallyBillDetailByBillId(){
    this.billService.fetchDebtorsBillDetailByBillId(this.offset, this.searchInput, this.searchBy, this.debtorPan, this.companyId, this.branchId).subscribe((res) => {
      this.salesTallyBills = res.data;
    });
  }
}
