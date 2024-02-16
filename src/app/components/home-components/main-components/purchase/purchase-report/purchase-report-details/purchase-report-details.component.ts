import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseBillDetail } from 'src/app/models/PurchaseBillDetail';
import { PurchaseReport } from 'src/app/models/PurchaseReport';
import { VatRateTypes } from 'src/app/models/VatRateTypes';
import { ProductService } from 'src/app/service/product.service';
import { PurchaseBillService } from 'src/app/service/purchase-bill.service';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-purchase-report-details',
  templateUrl: './purchase-report-details.component.html',
  styleUrls: ['./purchase-report-details.component.css'],
})
export class PurchaseReportDetailsComponent {
  year!: string;
  date!: Date;
  salesBillInvoice!: PurchaseBillDetail;
  user!: string;
  fileName!: string;
  vatRateTypes!: VatRateTypes[];
  purchaseReport!: PurchaseReport;
  company: any;
  branchId!: number;
  companyId!: number;
  constructor(
    private commonService: CommonService,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private purchaseBillService: PurchaseBillService
  ) {}

  ngOnInit() {
    this.date = new Date();
    this.company = this.loginService.getCompany();
    this.branchId = this.loginService.getBranchId();
    this.companyId = this.loginService.getCompnayId();
    let billId = this.activatedRoute.snapshot.params['id'];
    this.fetchPurchaseBillInfoForReport(billId);
    this.loginService.userObservable.subscribe((user) => {
      this.user = user.user.firstname + user.user.lastname;
    });
    this.getAllVatRateTypes();
  }

  getAllVatRateTypes() {
    this.productService.getAllVatRateTypes().subscribe((res) => {
      console.log(res.data);
      this.vatRateTypes = res.data;
    });
  }

  fetchPurchaseBillInfoForReport(billNo: number) {
    this.purchaseBillService
      .fetchPurchaseBillInfoForReport(billNo, this.companyId, this.branchId)
      .subscribe((res) => {
        this.purchaseReport = res.data;
      });
  }

  exportToExcel() {
    this.commonService.convertToExcel('httptrace-table', this.fileName);
  }

  exportToPdf() {
    this.commonService.convertToPdf('httptrace-table', this.fileName);
  }
}
