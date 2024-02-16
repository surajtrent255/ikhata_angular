import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoanRepay } from 'src/app/models/Loan-Repay/loanRepay';
import { LoanRepayService } from 'src/app/service/loan-repay/loan-service.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-edit-loan-repay',
  templateUrl: './edit-loan-repay.component.html',
  styleUrls: ['./edit-loan-repay.component.css'],
})
export class EditLoanRepayComponent {
  @Input() loanRepayId!: number;
  @Output() triggerPage = new EventEmitter<boolean>(false);

  @Input() toggleEditLoanrepay!: boolean;
  @Output() emitToReset = new EventEmitter<boolean>(false);

  @ViewChild('editLoanRepayPopup') editLoanRepayPopup!: ElementRef;

  selectedOption: string = '';

  repayFormData: LoanRepay = new LoanRepay();

  constructor(
    private loginService: LoginService,
    private loanRepayService: LoanRepayService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.toggleEditLoanrepay) {
      setTimeout(() => {
        if (this.editLoanRepayPopup)
          this.editLoanRepayPopup.nativeElement.click();
        this.emitToReset.emit(true);

        this.repayFormData.id = this.loanRepayId;
        this.getSingleLoanRepaySData(this.loanRepayId);
      });
    }
  }

  getSingleLoanRepaySData(loanRepayId: number) {
    this.loanRepayService
      .getSingleLoanRepay(
        this.loginService.getCompnayId(),
        this.loginService.getBranchId(),
        loanRepayId
      )
      .subscribe((res) => {
        this.repayFormData = res.data;
      });
  }

  findLoanId(id: number) {
    this.loanRepayService
      .getLoanNameForLoanRepay(
        id,
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe((res) => {
        if (res) this.repayFormData.loanName = res.data.get("name")!;
        else return;
      });
  }

  updateLoanRepay() {
    this.loanRepayService.updateLoanRepay(this.repayFormData).subscribe({
      next: (res) => {
        if (res) this.toastrService.success('successfully added ');
      },
      error: (err) => {
        this.toastrService.error('Something Went Wrong');
      },
    });
  }
}
