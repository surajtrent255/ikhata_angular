import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';

@Component({
  selector: 'app-sales-tally-bill-list',
  templateUrl: './sales-tally-bill-list.component.html',
  styleUrls: ['./sales-tally-bill-list.component.css']
})
export class SalesTallyBillListComponent {

  @Input() itemListOfBill !: SalesBillInvoice;
  @Output() destroyItemListEventEmitter = new EventEmitter<boolean>(false);

  ngOnChanges(){


  }

  destoryComp(){
    this.destroyItemListEventEmitter.emit(true);
  }
}
