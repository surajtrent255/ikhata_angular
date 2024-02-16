import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseBill } from 'src/app/models/PurchaseBill';
import { PurchaseBillMaster } from 'src/app/models/PurchaseBillMaster';
import { PurchaseBillService } from 'src/app/service/purchase-bill.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css'],
})
export class PurchaseComponent {
  purchaseBills: PurchaseBill[] = [];
  isAccountant: boolean = false;
  isMaster: boolean = false;
  compId!: number;
  branchId!: number;
  purchaseBillMaster!: PurchaseBillMaster;

  currentPageNumber: number = 1;
  pageTotalItems: number = 3;

  searchInput: string = '';
  searchValue: string = '';

  constructor(
    private purchaseBillService: PurchaseBillService,
    private router: Router,
    private loginService: LoginService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    let roles = this.loginService.getCompanyRoles();
    if (roles?.includes('ACCOUNTANT')) {
      this.isAccountant = true;
    } else if (roles.includes('ADMIN')) {
      this.isMaster = true;
    } else {
      this.isAccountant = false;
      this.isMaster = false;
    }
    this.fetchLimitedPurchaseBill();
  }

  getAllPurchaseBills(compId: number) {
    this.purchaseBillService
      .getAllPurchaseBillByCompId(this.compId, this.branchId)
      .subscribe({
        next: (data) => {
          this.purchaseBills = data.data;
        },
        error: (error) => {
          console.log(error);
        },
      });
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
      .getLimitedPurchaseBill(
        offset,
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

  handleData(data: any) {
    console.log(data);
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

      this.fetchLimitedPurchaseBill();
    }
  }

  createNewPurchaseBill() {
    this.router.navigateByUrl('/home/purchasebills/create/bill');
  }

  goToPurchBillDetail(billNo: number) {
    this.router.navigateByUrl(`/home/purchasebills/${billNo}`);
  }
  goToPurchaseAdditionalInfoDetails(billNo: number) {
    this.router.navigateByUrl(`/home/purchasebills/additionalInfo/${billNo}`);
  }
}
