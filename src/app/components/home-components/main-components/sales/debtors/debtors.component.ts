import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SalesBill } from 'src/app/models/SalesBill';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-debtors',
  templateUrl: './debtors.component.html',
  styleUrls: ['./debtors.component.css']
})
export class DebtorsComponent {

  debtors: SalesBill[] = [];
  companyId !: number;
  branchId !: number;

  searchBy : string='customer_name';
  searchWildCard : string = '';
  currentPageNumber : number = 1;
  earlierPageNumber: number = 1;

  pageToTalItems: number = 5;
  nextPage: boolean = false;
  sortBy: string = "id";

  constructor(private salesBillService: SalesBillServiceService,
     private loginService: LoginService,
     private toastrService: ToastrService){}
  ngOnInit(){
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    // this.getSalesBillService();
    this.fetchLimitedDebtorsList(true);
  }

  ngOnChanges(){

  }

  getSalesBillService(){
    this.salesBillService.getAllDebtors(this.companyId, this.branchId).subscribe((res)=>{
      this.debtors = res.data;
    })
  }

  changePage(type: string) {
    this.earlierPageNumber = this.currentPageNumber;
    if (type === 'prev') {
      if (this.currentPageNumber === 1) return;
      this.currentPageNumber -= 1;
    } else if (type === 'next') {
      this.nextPage = true;
      if (this.debtors.length < this.pageToTalItems) return; //this logic is only valid if api data length is less than page size. for equal below is the code.
      this.currentPageNumber += 1;
    }
    this.fetchLimitedDebtorsList(true);
  }


  fetchLimitedDebtorsList(onInit?:boolean){
    // this.salesBillService.
    let pageId = this.currentPageNumber - 1;
    let offset = pageId*this.pageToTalItems + 1;
    offset = Math.max(1, offset);

    this.salesBillService.getLimitedDebtors(offset,
      this.pageToTalItems, this.searchBy, this.searchWildCard, this.sortBy, this.companyId, this.branchId).subscribe(res=>{
        if (res.data.length === 0 || res.data === undefined) {
          this.debtors = [];
          this.toastrService.error('debtors not found ');
          // this.currentPageNumber -= 1;
          if (this.nextPage === true) {
            this.currentPageNumber = this.earlierPageNumber;
            this.fetchLimitedDebtorsList();
            this.nextPage = false;
          }
        } else {
          this.debtors = res.data;
          this.nextPage = false;
        }
      })
  }


}
