import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Payment } from 'src/app/models/Payment/payment';
import { PaymentMode } from 'src/app/models/Payment/paymentMode';
import { PaymentService } from 'src/app/service/shared/Payment/payment.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.css'],
})
export class EditPaymentComponent {
  @Input() PaymentId!: number;
  @Output() updatedSuccessful = new EventEmitter<boolean>(false);

  @ViewChild('closeButton') closeButton!: ElementRef;

  paymentMode!: PaymentMode[];
  postDateCheckEnable!: boolean;
  cheque!: boolean;
  Payment: Payment = new Payment();
  datePickerEnable: boolean = false;

  constructor(
    private paymentService: PaymentService,
    private commonService: CommonService,
    private LoginService: LoginService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.paymentService.getPaymentModeDetails().subscribe((res) => {
      this.paymentMode = res.data;
    });
  }

  ngOnChanges() {
    this.getPaymentDetailsById(this.PaymentId);
  }

  getPaymentDetailsById(sn: number) {
    this.paymentService.getPaymentDetailsById(sn).subscribe((res) => {
      this.Payment = res.data;
      this.Payment.postCheckDate = this.commonService.formatDate(
        Number(this.Payment.postCheckDate)
      );
      if (this.Payment.paymentModeId == 2) {
        this.cheque = true;
      }
      if (this.Payment.postDateCheck) {
        this.datePickerEnable = true;
      }
    });
  }

  postCheckDateChange(e: any) {
    if (e.target.value === 'true') {
      this.datePickerEnable = true;
    } else {
      this.datePickerEnable = false;
    }
  }
  paymentModeChange(data: string) {
    if (data === '2') {
      this.cheque = true;
    } else {
      this.cheque = false;
    }
  }
  editPaymentDetails() {
    this.paymentService.updatePaymentDetails(this.Payment).subscribe({
      next: (res) => {
        this.updatedSuccessful.emit(true);
        this.paymentService.getPaymentDetails(this.LoginService.getCompnayId());
        this.closeButton.nativeElement.click();
      },
    });
  }

  cancel() {
    this.updatedSuccessful.emit(true);
  }
}
