import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { SalesBill } from 'src/app/models/SalesBill';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';

@Component({
  selector: 'app-debtors-bill-list',
  templateUrl: './debtors-bill-list.component.html',
  styleUrls: ['./debtors-bill-list.component.css']
})
export class DebtorsBillListComponent implements OnChanges {

  @Input() itemListOfBill !: SalesBillInvoice;
  @Output() destroyItemListEventEmitter = new EventEmitter<boolean>(false);

  ngOnChanges(){


  }

  destoryComp(){
    this.destroyItemListEventEmitter.emit(true);
  }
}
