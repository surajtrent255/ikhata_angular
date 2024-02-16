import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Form } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountType } from 'src/app/models/AccountTypes';
import { Bank } from 'src/app/models/Bank';
import { BankList } from 'src/app/models/BankList';
import { BankService } from 'src/app/service/shared/bank/bank.service';

@Component({
  selector: 'app-edit-bank',
  templateUrl: './edit-bank.component.html',
  styleUrls: ['./edit-bank.component.css']
})
export class EditBankComponent implements OnInit, OnChanges{

  @Input() editBankObj  = new Bank;
  @Input() bankList : BankList[] = [];
  @Input() accountTypes : AccountType[] = [];

  @Output() destroyEditBankCompEvent = new EventEmitter<boolean>(false);

  constructor(private bankService: BankService,
    private toastrService: ToastrService){}

  ngOnInit(){

  }

  ngOnChanges(){

  }

  updateBankForm(updateBank: Form){
    this.bankService.updateBank(this.editBankObj).subscribe(res=>{
      this.toastrService.success(" bank has been updated successfully ");
      this.destroyEditBankCompEvent.emit(true);
    })
  }


  cancel(){
    this.destroyEditBankCompEvent.emit(false);

  }
}
