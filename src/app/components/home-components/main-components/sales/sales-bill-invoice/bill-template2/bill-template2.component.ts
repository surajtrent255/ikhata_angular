import { Component, Input } from '@angular/core';
import { SalesBillInvoice } from 'src/app/models/SalesBillInvoice';
import { User } from 'src/app/models/user';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-bill-template2',
  templateUrl: './bill-template2.component.html',
  styleUrls: ['./bill-template2.component.css']
})
export class BillTemplate2Component {
  @Input() salesInvoice !: SalesBillInvoice;
  @Input() company !: any;
  @Input() nepaliDate !: string;
  @Input() currentDate !: string;
  @Input() netAmount !: number;
  @Input() companyAdditionalInfo!: string;
  @Input() user!: User;
  @Input() totalAmountInWordsBeforeDecimal!: string;
  @Input() totalAmountInWordsAfterDecimal!: string;
  @Input() printButtonVisiability !: boolean;

  constructor(
    private salesBillService: SalesBillServiceService,
    private loginService: LoginService,
  ) { }


  printTheBill(billId: number) {
    this.printButtonVisiability = false;

    let userId = this.loginService.currentUser.user.id;

    this.salesBillService.printTheBill(billId, userId).subscribe({
      next: (data) => {
        console.log('bill is printed Successfully');
      },
      error: (error) => {
        console.log('error while printing bill');
      },
      complete: () => {
        // this.fetchSalesBillInvoice(billId);
        const printContents =
          document.getElementById('printable-content')!.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        this.printButtonVisiability = true;
        document.body.innerHTML = originalContents;
        // this.tostrService.success("bill is printed successfully")
        setTimeout(() => {
          window.close();
        }, 1500);
      },
    });
  }

}
