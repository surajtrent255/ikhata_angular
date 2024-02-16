import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseBillDetailWithProdInfo } from 'src/app/models/PurchaseBillDetailWithProdInfo';
import { PurchaseBillInvoice } from 'src/app/models/PurchaseBillInvoice';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { PurchaseBillService } from 'src/app/service/purchase-bill.service';
import { DebitNoteService } from 'src/app/service/shared/Debit-Note/debit-note.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-debit-note',
  templateUrl: './debit-note.component.html',
  styleUrls: ['./debit-note.component.css'],
})
export class DebitNoteComponent {
  salesBillDetails!: SalesBillInvoice;
  productDetails!: PurchaseBillDetailWithProdInfo[];
  SelectedProductDetails: PurchaseBillDetailWithProdInfo[] = [];
  PurchaseBillDetails = new PurchaseBillInvoice();
  serialNumber!: number;
  date!: string;
  billNo!: number;
  fiscalYear!: string;

  trigger!: boolean;

  constructor(
    private purchaseService: PurchaseBillService,
    private loginService: LoginService,
    private commonService: CommonService,
    private tosterService: ToastrService,
    private DebitService: DebitNoteService,
    private router: Router
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

  fetchPurchaseBillDetailForInvoice(BillId) {
    this.purchaseService
      .fetchPurchaseBillDetailForInvoice(
        BillId,
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe((res) => {
        this.PurchaseBillDetails = res.data;
        this.productDetails =
          this.PurchaseBillDetails.purchaseBillDetailsWithProd;
      });
  }

  selectedProduct(e: any, data: any, fiscalYear: string) {
    if (e.target.checked === true) {
      this.SelectedProductDetails.push(data);
    } else {
      this.SelectedProductDetails.pop();
    }
    this.fiscalYear = fiscalYear;
  }

  onEnter(e: any) {
    let billNo = e.target.value;
    this.fetchPurchaseBillDetailForInvoice(billNo);
  }

  onSubmit() {
    console.log(this.SelectedProductDetails);
    if (this.SelectedProductDetails.length === 0) {
      this.tosterService.error('Please Select Atleast Product');
    } else {
      let data = this.SelectedProductDetails;
      let billNo = this.billNo;
      let SN = this.serialNumber;
      const fiscalYear = this.fiscalYear;
      this.commonService.setData({
        data,
        billNo,
        SN,
        fiscalYear,
      });
      this.router.navigateByUrl('/home/debitnote/debitnoteInvoice');
    }
  }
}
