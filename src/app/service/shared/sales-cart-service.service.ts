import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SalesBillDetail } from 'src/app/models/SalesBillDetail';

@Injectable({
  providedIn: 'root'
})
export class SalesCartService {
  private prodsInSalesCart = new BehaviorSubject<SalesBillDetail[]>([]);
  currentProdsInSalesCart = this.prodsInSalesCart.asObservable();
  constructor() { }

  updateSalesCartInfo(cartInfo: SalesBillDetail[]) {
    console.log(' before adding ')
    console.log(cartInfo);
    console.log("------------")
    this.prodsInSalesCart.next(cartInfo);
    this.prodsInSalesCart.subscribe(data => console.log(data))
  }
}
