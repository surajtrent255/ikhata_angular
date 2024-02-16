import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreditNote } from 'src/app/models/Credit-Note/creditNote';
import { CreditNoteDetails } from 'src/app/models/Credit-Note/creditNoteDetails';
import { SalesBillDetailWithProdInfo } from 'src/app/models/SalesBillDetailWithProdInfo';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { CreditNoteService } from 'src/app/service/shared/Credit-Note/credit-note.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.css'],
})
export class CreditNoteComponent {
  salesBillDetails = new SalesBillInvoice();
  SelectedProductDetails: SalesBillDetailWithProdInfo[] = [];
  productDetails: SalesBillDetailWithProdInfo[] = [];
  serialNumber!: number;
  date!: string;
  billNo!: number;

  fiscalYear!: string;
  isAccountant: boolean = false;
  isMaster: boolean = false;

  //
  totalTaxAmount!: number;
  totalAmount!: number;

  constructor(
    private salesService: SalesBillServiceService,
    private commonService: CommonService,
    private creditNoteService: CreditNoteService,
    private toasterService: ToastrService,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    const length = 8;
    let serialNumber = '';
    for (let i = 0; i < length; i++) {
      serialNumber += Math.floor(Math.random() * 10);
    }
    this.serialNumber = Number(serialNumber);
    let date = new Date();
    this.date = this.commonService.formatDate(Number(date));
  }

  selectedProduct(
    e: any,
    data: SalesBillDetailWithProdInfo,
    fisicalYear: string
  ) {
    if (e.target.checked === true) {
      this.SelectedProductDetails.push(data);
    } else {
      this.SelectedProductDetails.pop();
    }
    this.fiscalYear = fisicalYear;
  }

  fetchSalesBillDetailForInvoice(billNo: string) {
    this.salesService
      .fetchSalesBillDetailForInvoiceByBillNo(billNo)
      .subscribe((res) => {
        this.salesBillDetails = res.data;
        this.productDetails = this.salesBillDetails.salesBillDetailsWithProd;
      });
  }

  onSubmit() {
    if (this.SelectedProductDetails.length === 0) {
      this.toasterService.error('Please Select Atleast Product');
    } else {
      let data = this.SelectedProductDetails;
      let billNo = this.billNo;
      let SN = this.serialNumber;
      let fiscalYear = this.fiscalYear;
      this.commonService.setData({
        data,
        billNo,
        SN,
        fiscalYear,
      });
      this.router.navigateByUrl('/home/creditnote/creditnoteInvoice');
    }
  }
  onEnter(e: any) {
    let billNo = e.target.value;
    this.fetchSalesBillDetailForInvoice(billNo);
  }
}
