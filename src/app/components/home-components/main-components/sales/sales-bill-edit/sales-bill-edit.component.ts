import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';

@Component({
  selector: 'app-sales-bill-edit',
  templateUrl: './sales-bill-edit.component.html',
  styleUrls: ['./sales-bill-edit.component.css']
})
export class SalesBillEditComponent {
  @Output() activeSalesBillEditEvent = new EventEmitter<boolean>();

  deactivateSalesBillEdit() {
    this.activeSalesBillEditEvent.emit(false);
  }
  constructor(private salesBillService: SalesBillServiceService, private activatedRoute: ActivatedRoute) {
  }

  salesBillInvoice !: SalesBillInvoice;

  ngOnInit() {
    let billId = this.activatedRoute.snapshot.params['billId']
    this.salesBillService.fetchSalesBillDetailForInvoice(billId).subscribe(data => {
      this.salesBillInvoice = data.data;
    })
  }
  ngOnDestroy() {
    console.log("destorying sales-bill-edit component")
  }
}
