import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseBillInvoice } from 'src/app/models/PurchaseBillInvoice';
import { PurchaseBillService } from 'src/app/service/purchase-bill.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-purchase-bill-detail',
  templateUrl: './purchase-bill-detail.component.html',
  styleUrls: ['./purchase-bill-detail.component.css'],
})
export class PurchaseBillDetailComponent {
  compId!: number;
  branchId!: number;
  constructor(
    private purchaseBillService: PurchaseBillService,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService
  ) {}

  purchaseBillInvoice: PurchaseBillInvoice = new PurchaseBillInvoice();

  ngOnInit() {
    let billNo = this.activatedRoute.snapshot.params['billNo'];
    this.compId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.purchaseBillService
      .fetchPurchaseBillDetailForInvoice(billNo, this.compId, this.branchId)
      .subscribe((data) => {
        this.purchaseBillInvoice = data.data;
      });
  }
  goBack(): void {
    window.history.back();
  }
  ngOnDestroy() {
    console.log('destorying sales-bill-edit component');
  }
}
