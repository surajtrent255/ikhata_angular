import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SalesBill } from 'src/app/models/SalesBill';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-list-sales-bills',
  templateUrl: './list-sales-bills.component.html',
  styleUrls: ['./list-sales-bills.component.css']
})
export class ListSalesBillsComponent {

  currentPageNumber: number = 1;
  pageTotalItems: number = 5;
  searchBy: string = '';
  searchWildCard: string = '';
  companyId!: number;
  branchId!: number;
  sortBy: string = 'id';

  salesBills: SalesBill[] = [];
  fiscalYear!:string;
  quarter !:number;

  constructor(
    private salesBillService: SalesBillServiceService,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private route:ActivatedRoute
  ){
   
  }

  ngOnInit(){

    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length !== 0) {
        this.fiscalYear = params['fiscalYear'];
        this.quarter = params['quarter']    
      }
      this.companyId = this.loginService.getCompnayId();
      this.branchId = this.loginService.getBranchId();
      this.fetchLimitedSalesBill();
    })

  }

  changePage(type: string) {
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
      this.fetchLimitedSalesBill();
    } else if (type === 'next') {
      this.currentPageNumber += 1;
      this.fetchLimitedSalesBill();
    }
  }

  fetchLimitedSalesBill() {
    let pageId = this.currentPageNumber - 1;
    let offset = pageId * this.pageTotalItems + 1;
    offset = Math.max(1, offset);
    this.salesBillService
      .getLimitedSalesBillForIrd(
        this.fiscalYear,
        this.quarter,
        offset,
        this.pageTotalItems,
        this.searchBy,
        this.searchWildCard,
        this.sortBy,
        this.companyId,
        this.branchId
      )
      .subscribe((res) => {
        if (res.data.length === 0) {
          this.salesBills = [];
          this.toastrService.error('bills not found ');
          // this.currentPageNumber -= 1;
        } else {
          this.salesBills = res.data;
        }
      });
  }
}
