import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/models/Bank';
import { BankList } from 'src/app/models/BankList';
import { BankWidthdraw } from 'src/app/models/Bankwithdraw';
import { DepostiWithDrawTyes } from 'src/app/models/DepositWithDrawTypes';
import { BankService } from 'src/app/service/shared/bank/bank.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-bank-withdraw-edit',
  templateUrl: './bank-withdraw-edit.component.html',
  styleUrls: ['./bank-withdraw-edit.component.css'],
})
export class BankWithdrawEditComponent {
  @Input() toggleEdit!: boolean;
  @Input() withDrawId!: number;
  @Output() emitToReset = new EventEmitter<boolean>(false);

  bankList: BankList[] = [];
  keyword = 'name';
  data: Array<any> = [];
  bankId!: number;
  objwidthdraw = new BankWidthdraw();
  withDrawTypes!: DepostiWithDrawTyes[];

  companyId!: number;
  branchId!: number;
  banks: Bank[] = [];

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    public CommonService: CommonService,
    public bankService: BankService,
    private toastrService: ToastrService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    if (this.withDrawId) {
      this.getBankWithdraw(this.withDrawId);
      this.getBankList();
    }
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.fetchRelatedBanks();

  }
  

  fetchRelatedBanks() {
    this.bankService
      .getAllBanks(this.companyId, this.branchId)
      .subscribe((data) => {
        this.banks = data.data;
      });
  }

  getBankWithdraw(id: number) {
    this.bankService
      .getBankWithdrawById(
        id,
        this.loginService.getCompnayId(),
        this.loginService.getBranchId()
      )
      .subscribe({
        next: (data) => {
          this.objwidthdraw = data.data;
        },
      });
  }

  ngAfterViewInit() {
    this.CommonService.enableDragging(
      'editBankWithDrawPopup',
      'editBankWithDrawpopup'
    );
  }

  selectEvent(item) {
    this.bankId = item.id;
  }

  getAllWithDrawTypes() {
    this.bankService.getDepositWithDrawTypes().subscribe((res) => {
      this.withDrawTypes = res.data;
    });
  }

  getBankList() {
    this.bankService.getBankList().subscribe((data) => {
      this.data = data.data;
      this.bankList = data.data;
    });
  }

  submitForm(data) {
    const nepaliDateEl = document.getElementById(
      'nepali-datepicker'
    ) as HTMLInputElement;

    this.bankService.updateBankWithDraw(data).subscribe((res) => {
      this.toastrService.success(' form is successfully updated');
      this.emitToReset.emit(true);
      // this.destroyComp();// yo matra garyo vane mathiko dharko dakhinxa so close button lai nai clcike garaune
      const closeEditButtonEl = document.getElementById(
        'closeEditButton'
      ) as HTMLButtonElement;
      closeEditButtonEl.click();
      // this.withDrawForm.reset();
    });
  }

  cancel() {}
}
