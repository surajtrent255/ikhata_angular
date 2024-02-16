import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseAdditionalInfo } from '../../../../../models/PurchaseAdditionalInfo';
import { PruchaseAdditionalInfoService } from '../../../../../service/pruchase-additional-info.service';

@Component({
  selector: 'app-purchase-additional-info-details',
  templateUrl: './purchase-additional-info-details.component.html',
  styleUrls: ['./purchase-additional-info-details.component.css'],
})
export class PurchaseAdditionalInfoDetailsComponent {
  PurchaseAdditionalInfo: PurchaseAdditionalInfo[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private PruchaseAdditionalInfoService: PruchaseAdditionalInfoService,
    private router: Router
  ) {}

  ngOnInit() {
    let billNo = this.activatedRoute.snapshot.params['billNo'];
    this.PruchaseAdditionalInfoService.getPurchaseAdditionalInfoByBillNo(
      billNo
    ).subscribe((data) => {
      this.PurchaseAdditionalInfo = data.data;
      console.log(data.data);
    });
  }
  goBack() {
    this.router.navigateByUrl('/home/purchasebills');
  }
}
