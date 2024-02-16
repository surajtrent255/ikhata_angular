import { Component, ElementRef, ViewChild } from '@angular/core';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import { PurchaseBillService } from 'src/app/service/purchase-bill.service';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { CompanyServiceService } from 'src/app/service/shared/company-service.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { StockService } from 'src/app/service/stock/stock.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  @ViewChild('BannerPopUp', { static: true }) BannerPopUp!: ElementRef;

  monthName!: string;
  monthValue!: number;
  DateToday!: string;
  fiscalYear!: number;
  NepaliTodayDate!: string;

  /* Sales  */
  salesTitle: string = 'Today';
  salesBillAmount!: number;

  /* Purchase */
  PurchaseTitle: string = 'Today';
  PurchaseBillAmount!: number;

  /* Sales VAT */
  SalesVatTitle: string = 'Today';
  SalesVatAmount!: number;

  /* Purchase VAT */
  PurchaseVatTitle: string = 'Today';
  PurchaseVatAmount!: number;

  /* Purchase VAT */
  CustomerTitle: string = 'Today';
  CustomerCount!: number;

  /* Stock */
  StockData!: { name: string }[];
  StockTitle: string = 'Top Five';

  constructor(
    private salesBillService: SalesBillServiceService,
    private loginService: LoginService,
    private commonService: CommonService,
    private purchaseBillService: PurchaseBillService,
    private companyService: CompanyServiceService,
    private stockService: StockService
  ) {}

  ngOnInit() {
    const todayDate = new Date().toJSON().slice(0, 10);
    this.DateToday = todayDate;
    const todayNepaliDate = adToBs(todayDate);
    this.NepaliTodayDate = todayNepaliDate.toString();

    this.fiscalYear = Number(todayNepaliDate.toString().slice(0, 4));

    const month = this.commonService.getMonthNameBasedOnNepaliDate(
      String(todayNepaliDate)
    );
    this.monthName = month.name;
    this.monthValue = month.value;
    this.getTodayTotalSalesBillAmount();
    this.getTodayTotalPurchaseBillAmount();
    /*
    Purchase VAT Data
    */
    this.getTodayTotalPurchaseBillTaxAmount();
    /*
    Sales VAT Data
    */
    this.getTodayTotalSalesBillTaxAmount();

    /*
  Customer Data
  */
    this.customerAddedToday();

    /*
  Stock Data
  */
    this.getTopFiveStock();

    // Dashboard Banner Popup
    if (
      Number(todayNepaliDate.toString().split('-')[2]) >= 20 &&
      Number(todayNepaliDate.toString().split('-')[2]) <= 25 &&
      this.commonService.setTheNotification
    ) {
      this.BannerPopUp.nativeElement.click();
      this.commonService.setTheNotification = false;
    }
  }

  /*
  Stock Data
  */
  getTopFiveStock() {
    this.stockService.getTopFiveStock().subscribe((res) => {
      this.StockData = res.data;
    });
  }
  getLastFiveStock() {
    this.stockService.getLastFiveStock().subscribe((res) => {
      this.StockData = res.data;
    });
  }

  getTodayTotalSalesBillAmount() {
    this.salesBillService
      .getTodayTotalSalesBillAmount(
        this.DateToday,
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe({
        next: (res) => {
          if (res.data !== null) {
            this.salesBillAmount = res.data;
          } else {
            this.salesBillAmount = 0;
          }
        },
      });
  }

  getThisMonthTotalSalesBillAmount() {
    this.salesBillService
      .getThisMonthTotalSalesBillAmount(
        String(this.monthValue),
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe({
        next: (res) => {
          if (res.data !== null) {
            this.salesBillAmount = res.data;
          } else {
            this.salesBillAmount = 0;
          }
        },
      });
  }

  getThisFiscalYearTotalSalesBillAmount() {
    this.salesBillService
      .getThisFiscalYearTotalSalesBillAmount(
        String(this.fiscalYear),
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe({
        next: (res) => {
          if (res) this.salesBillAmount = res.data;
          else this.salesBillAmount = 0;
        },
      });
  }

  /* Purchase*/

  getThisMonthTotalPurchaseBillAmount() {
    this.purchaseBillService
      .getThisMonthTotalPurchaseBillAmount(
        String(this.monthValue),
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe({
        next: (res) => {
          if (res.data !== null) {
            this.PurchaseBillAmount = res.data;
          } else {
            this.PurchaseBillAmount = 0;
          }
        },
      });
  }

  getThisFiscalYearTotalPurchaseBillAmount() {
    -this.purchaseBillService
      .getThisFiscalYearTotalPurchaseBillAmount(
        String(this.fiscalYear),
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe({
        next: (res) => {
          if (res) this.PurchaseBillAmount = res.data;
          else this.PurchaseBillAmount = 0;
        },
      });
  }

  getTodayTotalPurchaseBillAmount() {
    this.purchaseBillService
      .getTodayTotalPurchaseBillAmount(
        this.DateToday,
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe({
        next: (res) => {
          if (res.data !== null) {
            this.PurchaseBillAmount = res.data;
          } else {
            this.PurchaseBillAmount = 0;
          }
        },
      });
  }
  /* 
    Sales VAT Data
    */
  getTodayTotalSalesBillTaxAmount() {
    this.salesBillService
      .getTodayTotalSalesBillTaxAmount(
        this.DateToday,
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe({
        next: (res) => {
          if (res.data !== null) {
            this.SalesVatAmount = res.data;
          } else {
            this.SalesVatAmount = 0;
          }
        },
      });
  }

  getThisMonthTotalSalesBillTaxAmount() {
    this.salesBillService
      .getThisMonthTotalSalesBillTaxAmount(
        String(this.monthValue),
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe({
        next: (res) => {
          if (res.data !== null) {
            this.SalesVatAmount = res.data;
          } else {
            this.SalesVatAmount = 0;
          }
        },
      });
  }

  getThisFiscalYearTotalSalesBillTaxAmount() {
    this.salesBillService
      .getThisFiscalYearTotalSalesBillAmount(
        String(this.fiscalYear),
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe({
        next: (res) => {
          if (res) this.SalesVatAmount = res.data;
          else this.SalesVatAmount = 0;
        },
      });
  }

  /* Purchase Vat */
  getThisMonthTotalPurchaseBillTaxAmount() {
    this.purchaseBillService
      .getThisMonthTotalPurchaseBillTaxAmount(
        String(this.monthValue),
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe({
        next: (res) => {
          if (res.data !== null) {
            this.PurchaseVatAmount = res.data;
          } else {
            this.PurchaseVatAmount = 0;
          }
        },
      });
  }

  getThisFiscalYearTotalPurchaseBillTaxAmount() {
    this.purchaseBillService
      .getThisFiscalYearTotalPurchaseBillTaxAmount(
        String(this.fiscalYear),
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe({
        next: (res) => {
          if (res) this.PurchaseVatAmount = res.data;
          else this.PurchaseVatAmount = 0;
        },
      });
  }

  getTodayTotalPurchaseBillTaxAmount() {
    this.purchaseBillService
      .getTodayTotalPurchaseBillTaxAmount(
        this.DateToday,
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe({
        next: (res) => {
          if (res.data !== null) {
            this.PurchaseVatAmount = res.data;
          } else {
            this.PurchaseVatAmount = 0;
          }
        },
      });
  }

  /*
  Customer Data
  */
  customerAddedThisMonth() {
    this.companyService
      .customerAddedThisMonth(
        String(this.monthValue),
        this.loginService.getCompnayId()
      )
      .subscribe({
        next: (res) => {
          if (res.data !== null) {
            this.CustomerCount = res.data;
          } else {
            this.CustomerCount = 0;
          }
        },
      });
  }

  cutomerAddedThisYear() {
    this.companyService
      .customerAddedThisYear(
        String(this.fiscalYear),
        this.loginService.getCompnayId()
      )
      .subscribe({
        next: (res) => {
          if (res) this.CustomerCount = res.data;
          else this.CustomerCount = 0;
        },
      });
  }

  customerAddedToday() {
    this.companyService
      .customerAddedToday(this.DateToday, this.loginService.getCompnayId())
      .subscribe({
        next: (res) => {
          if (res.data !== null) {
            this.CustomerCount = res.data;
          } else {
            this.CustomerCount = 0;
          }
        },
      });
  }

  onSalesSelect(e: any) {
    if (e === 'today') {
      this.salesTitle = 'Today';
      this.getTodayTotalSalesBillAmount();
    }
    if (e === 'month') {
      this.salesTitle = this.monthName;
      this.getThisMonthTotalSalesBillAmount();
    }
    if (e === 'fiscalYear') {
      this.salesTitle = `${this.fiscalYear - 1}/${this.fiscalYear}`;
      this.getThisFiscalYearTotalSalesBillAmount();
    }
  }

  onPurchaseSelect(e: string) {
    if (e === 'today') {
      this.PurchaseTitle = 'Today';
      this.getTodayTotalPurchaseBillAmount();
    }
    if (e === 'month') {
      this.PurchaseTitle = this.monthName;
      this.getThisMonthTotalPurchaseBillAmount();
    }
    if (e === 'fiscalYear') {
      this.PurchaseTitle = `${this.fiscalYear - 1}/${this.fiscalYear}`;
      this.getThisFiscalYearTotalPurchaseBillAmount();
    }
  }

  onSalesVatSelect(e: string) {
    if (e === 'today') {
      this.SalesVatTitle = 'Today';
      this.getTodayTotalSalesBillTaxAmount();
    }
    if (e === 'month') {
      this.SalesVatTitle = this.monthName;
      this.getThisMonthTotalSalesBillTaxAmount();
    }
    if (e === 'fiscalYear') {
      this.SalesVatTitle = `${this.fiscalYear - 1}/${this.fiscalYear}`;
      this.getThisFiscalYearTotalSalesBillTaxAmount();
    }
  }

  onPurchaseVatSelect(e: any) {
    if (e === 'today') {
      this.PurchaseVatTitle = 'Today';
      this.getTodayTotalPurchaseBillTaxAmount();
    }
    if (e === 'month') {
      this.PurchaseVatTitle = this.monthName;
      this.getThisMonthTotalPurchaseBillTaxAmount();
    }
    if (e === 'fiscalYear') {
      this.PurchaseVatTitle = `${this.fiscalYear - 1}/${this.fiscalYear}`;
      this.getThisFiscalYearTotalPurchaseBillTaxAmount();
    }
  }

  onCustomerSelect(e: string) {
    if (e === 'today') {
      this.CustomerTitle = 'Today';
      this.customerAddedToday();
    }
    if (e === 'month') {
      this.CustomerTitle = this.monthName;
      this.customerAddedThisMonth();
    }
    if (e === 'fiscalYear') {
      this.CustomerTitle = `${this.fiscalYear - 1}/${this.fiscalYear}`;
      this.cutomerAddedThisYear();
    }
  }

  onStockSelect(e: string) {
    if (e === 'top') {
      this.StockTitle = 'Top Five';
      this.getTopFiveStock();
    }
    if (e === 'last') {
      this.StockTitle = 'Least Five';
      this.getLastFiveStock();
    }
  }
}
