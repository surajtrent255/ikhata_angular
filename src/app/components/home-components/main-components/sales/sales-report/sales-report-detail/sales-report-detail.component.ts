import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreditNote } from 'src/app/models/Credit-Note/creditNote';
import { CreditNoteDetails } from 'src/app/models/Credit-Note/creditNoteDetails';
import { SalesBillDetail } from 'src/app/models/SalesBillDetail';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { VatRateTypes } from 'src/app/models/VatRateTypes';
import { ProductService } from 'src/app/service/product.service';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { CreditNoteService } from 'src/app/service/shared/Credit-Note/credit-note.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-sales-report-detail',
  templateUrl: './sales-report-detail.component.html',
  styleUrls: ['./sales-report-detail.component.css'],
})
export class SalesReportDetailComponent {
  year!: string;
  date!: Date;
  salesBillInvoice!: SalesBillInvoice;
  user!: string;
  fileName!: string;
  vatRateTypes!: VatRateTypes[];

  company: any;
  constructor(
    private commonService: CommonService,
    private creditNoteService: CreditNoteService,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private salesBillService: SalesBillServiceService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.date = new Date();
    this.company = this.loginService.getCompany();
    let billId = this.activatedRoute.snapshot.params['id'];
    this.fetchSalesBillInfo(billId);
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
  fetchSalesBillInfo(billId: number) {
    this.salesBillService
      .fetchSalesBillDetailForInvoice(billId)
      .subscribe((res) => {
        this.salesBillInvoice = res.data;
      });
  }

  exportToExcel() {
    this.commonService.convertToExcel('httptrace-table', this.fileName);
  }

  exportToPdf() {
    this.commonService.convertToPdf('httptrace-table', this.fileName);
  }
}
